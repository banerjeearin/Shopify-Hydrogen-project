from fastapi import APIRouter
from sqlalchemy.future import select
from sqlalchemy import func
from app.db.session import AsyncSessionLocal
from app.models import StgShopifySalesOrderHdr, StgWorkOrderPlan, ExceptionQueue

router = APIRouter()

@router.get("/stats")
async def get_stats():
    async with AsyncSessionLocal() as db:
        orders_count = await db.scalar(select(func.count(StgShopifySalesOrderHdr.id)))
        wos_created = await db.scalar(select(func.count(StgWorkOrderPlan.id)).where(StgWorkOrderPlan.status == 'CREATED'))
        open_exceptions = await db.scalar(select(func.count(ExceptionQueue.id)).where(ExceptionQueue.status == 'OPEN'))
        
    return {
        "orders_processed": orders_count or 0,
        "work_orders_created": wos_created or 0,
        "open_exceptions": open_exceptions or 0
    }

@router.get("/activities")
async def get_activities(limit: int = 15):
    from app.models import ActivityLog
    async with AsyncSessionLocal() as db:
        try:
            result = await db.execute(select(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(limit))
            activities = result.scalars().all()
            return [{"title": a.title, "description": a.description, "type": a.type, "created_at": a.created_at, "run_id": a.run_id, "agent_name": a.agent_name} for a in activities]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@router.get("/exceptions")
async def get_exceptions():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(ExceptionQueue).where(ExceptionQueue.status == 'OPEN').order_by(ExceptionQueue.id.desc()))
        exceptions = result.scalars().all()
        
    return [
        {
            "id": ex.id,
            "error_type": ex.error_type,
            "related_sku": ex.related_sku,
            "description": ex.description,
            "status": ex.status,
            "resolution_notes": ex.resolution_notes
        }
        for ex in exceptions
    ]

@router.get("/inventory")
async def get_inventory(date: str = None):
    from datetime import datetime
    import os
    from fastapi import HTTPException
    from app.services.erpnext_client import ERPNextClient

    target_date = date or datetime.now().strftime("%Y-%m-%d")
    
    # Check if ERPNext is actually configured
    if not os.getenv("ERPNEXT_URL"):
        raise HTTPException(
            status_code=500, 
            detail="ERPNEXT_URL is not configured in your .env file! The system cannot fetch from the real ERP system until it is connected."
        )

    client = ERPNextClient()
    try:
        company = os.getenv("ERPNEXT_COMPANY")
        raw_results = await client.get_stock_balance_report(target_date, company=company)
        
        # Transform ERPNext report format into our frontend format
        inventory_data = []
        for row in raw_results:
            # Skip totals/grouping rows if they aren't dicts or don't have an item_code
            if not isinstance(row, dict) or not row.get("item_code"):
                continue
                
            inventory_data.append({
                "item_code": row.get("item_code"),
                "item_name": row.get("item_name", row.get("item_code")),
                "stock_type": "Stock", # Implicitly stock since it's on the ledger
                "quantity": float(row.get("bal_qty", 0.0)),
                "uom": row.get("stock_uom", "Nos")
            })
            
        return {
            "date": target_date,
            "data": inventory_data
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch from ERPNext: {str(e)}")
    finally:
        await client.close()
