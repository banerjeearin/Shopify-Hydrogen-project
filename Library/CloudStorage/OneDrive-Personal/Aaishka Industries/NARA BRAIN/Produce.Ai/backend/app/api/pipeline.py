from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.agents.orchestrator import run_pipeline

router = APIRouter()

class PipelineRequest(BaseModel):
    date_from: Optional[str] = None # Expects DD.MM.YYYY
    date_to: Optional[str] = None # Expects DD.MM.YYYY

@router.post("/run")
async def trigger_pipeline(req: PipelineRequest, background_tasks: BackgroundTasks):
    def parse_date(date_str: str) -> Optional[datetime]:
        if not date_str:
            return None
        try:
            return datetime.strptime(date_str, "%d.%m.%Y")
        except ValueError:
            return None

    parsed_from = parse_date(req.date_from)
    parsed_to = parse_date(req.date_to)

    background_tasks.add_task(run_pipeline, raw_orders=[], date_from=parsed_from, date_to=parsed_to)
    return {"message": f"Pipeline triggered for dates: {req.date_from} to {req.date_to}"}

@router.delete("/runs/{run_id}")
async def delete_run_data(run_id: str):
    """
    Deletes all ingested data (raw, hdr, lines, work plans, and logs) for a specific run_id.
    """
    from sqlalchemy import delete, select
    from app.db.session import AsyncSessionLocal
    from app.models import (
        StgShopifySalesOrderLine, StgShopifySalesOrderHdr, ShopifyOrderRaw, 
        StgWorkOrderPlan, ActivityLog
    )

    async with AsyncSessionLocal() as db:
        try:
            # 1. Get header IDs for this run to delete lines
            res_hdr = await db.execute(select(StgShopifySalesOrderHdr.id).where(StgShopifySalesOrderHdr.run_id == run_id))
            hdr_ids = [r[0] for r in res_hdr.all()]
            
            if hdr_ids:
                stmt_lines = delete(StgShopifySalesOrderLine).where(StgShopifySalesOrderLine.hdr_id.in_(hdr_ids))
                await db.execute(stmt_lines)

            # 2. Delete headers for run
            stmt_hdr = delete(StgShopifySalesOrderHdr).where(StgShopifySalesOrderHdr.run_id == run_id)
            await db.execute(stmt_hdr)
            
            # 3. Delete raw orders for run
            stmt_raw = delete(ShopifyOrderRaw).where(ShopifyOrderRaw.run_id == run_id)
            await db.execute(stmt_raw)
            
            # 3.5 Delete sales invoices for run
            from app.models import StgSalesInvoice
            stmt_inv = delete(StgSalesInvoice).where(StgSalesInvoice.run_id == run_id)
            await db.execute(stmt_inv)
            
            # 4. Delete work plans for run
            stmt_plans = delete(StgWorkOrderPlan).where(StgWorkOrderPlan.run_id == run_id)
            await db.execute(stmt_plans)
            
            # 5. Delete activity logs for run
            stmt_logs = delete(ActivityLog).where(ActivityLog.run_id == run_id)
            await db.execute(stmt_logs)

            await db.commit()
            return {"message": f"Successfully deleted all data for run {run_id}"}
            
        except Exception as e:
            await db.rollback()
            return {"error": str(e)}
