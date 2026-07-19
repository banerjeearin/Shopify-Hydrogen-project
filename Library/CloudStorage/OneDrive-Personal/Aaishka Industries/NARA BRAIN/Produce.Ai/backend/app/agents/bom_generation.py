import httpx
from sqlalchemy.future import select
from app.db.session import AsyncSessionLocal
from app.models import BomRecipeMaster, ExceptionQueue, ExceptionStatus
from app.agents.state import AgentState
from app.services.erpnext_client import ERPNextClient

async def bom_generation_agent(state: AgentState) -> AgentState:
    """
    BOM Generation Agent:
    Ensures a default BOM exists in ERPNext for each SKU, strictly using BomRecipeMaster.
    """
    classified_skus = state.get("classified_skus", [])
    exceptions = state.get("exceptions", [])
    
    erp_client = ERPNextClient()
    
    async with AsyncSessionLocal() as db:
        for sku in classified_skus:
            # Skip if we already logged a creation exception for this SKU
            if any(e.get("sku") == sku for e in exceptions):
                continue
                
            try:
                # Check ERPNext for active default BOM
                bom = await erp_client.get_bom(sku)
                if bom:
                    continue
                    
                # Look up recipe locally
                stmt = select(BomRecipeMaster).where(BomRecipeMaster.fg_item_code == sku)
                result = await db.execute(stmt)
                recipe_lines = result.scalars().all()
                
                if not recipe_lines:
                    # Exception: Missing Recipe
                    ex = ExceptionQueue(
                        error_type="MISSING_BOM_RECIPE",
                        related_sku=sku,
                        description=f"No BOM recipe found in BomRecipeMaster for {sku}",
                        status=ExceptionStatus.OPEN
                    )
                    db.add(ex)
                    exceptions.append({"type": "MISSING_BOM_RECIPE", "sku": sku})
                    continue
                
                items_payload = []
                missing_rm = False
                for line in recipe_lines:
                    rm_code = line.raw_material_code
                    # Verify RM exists in ERP
                    rm_item = await erp_client.get_item(rm_code)
                    if not rm_item:
                        ex = ExceptionQueue(
                            error_type="MISSING_RAW_MATERIAL",
                            related_sku=sku,
                            description=f"Raw material {rm_code} does not exist in ERPNext.",
                            status=ExceptionStatus.OPEN
                        )
                        db.add(ex)
                        exceptions.append({"type": "MISSING_RAW_MATERIAL", "sku": sku, "rm": rm_code})
                        missing_rm = True
                        break
                    
                    items_payload.append({
                        "item_code": rm_code,
                        "qty": line.qty,
                        "uom": line.uom
                    })
                
                if missing_rm:
                    continue
                    
                # Create BOM
                payload = {
                    "item": sku,
                    "is_active": 1,
                    "is_default": 1,
                    "items": items_payload
                }
                await erp_client.create_bom(payload)
                
            except httpx.HTTPStatusError as e:
                # Exception: ERPNext BOM creation failed
                ex = ExceptionQueue(
                    error_type="ERP_BOM_CREATION_FAILED",
                    related_sku=sku,
                    description=f"Failed to create BOM in ERPNext: {str(e)}",
                    status=ExceptionStatus.OPEN
                )
                db.add(ex)
                exceptions.append({"type": "ERP_BOM_CREATION_FAILED", "sku": sku})
                
        await db.commit()
        
        if classified_skus:
            from app.models import ActivityLog, ActivityType
            log = ActivityLog(
                run_id=state.get("run_id"),
                agent_name="BOM Generation",
                title="BOM Verified",
                description=f"Verified BOMs for {len(classified_skus)} ERP items: {', '.join(list(classified_skus))}",
                type=ActivityType.SUCCESS
            )
            db.add(log)
            await db.commit()
    
    await erp_client.close()

    return {"exceptions": exceptions}
