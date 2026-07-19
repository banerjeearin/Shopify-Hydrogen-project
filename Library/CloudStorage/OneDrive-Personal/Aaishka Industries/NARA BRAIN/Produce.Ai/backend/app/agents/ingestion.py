import os
import httpx
import logging
from datetime import datetime
from typing import Optional
from sqlalchemy.future import select
from app.db.session import AsyncSessionLocal
from app.models import ShopifyOrderRaw, StgShopifySalesOrderHdr, StgShopifySalesOrderLine, ProcessingStatus
from app.agents.state import AgentState

logger = logging.getLogger(__name__)

async def fetch_shopify_orders(date_from: Optional[datetime], date_to: Optional[datetime]) -> list:
    store_url = os.environ.get("SHOPIFY_STORE_URL")
    access_token = os.environ.get("SHOPIFY_ACCESS_TOKEN")
    
    if not store_url or not access_token:
        logger.warning("SHOPIFY_STORE_URL or SHOPIFY_ACCESS_TOKEN not set. Cannot fetch from real API.")
        return []
        
    url = f"https://{store_url}/admin/api/2024-01/orders.json"
    
    params = {"status": "any", "limit": 250}
    if date_from:
        params["created_at_min"] = date_from.isoformat()
    if date_to:
        params["created_at_max"] = date_to.isoformat()
        
    headers = {
        "X-Shopify-Access-Token": access_token,
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            logger.info(f"Fetching from Shopify: {url}")
            response = await client.get(url, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()
            orders = data.get("orders", [])
            logger.info(f"Fetched {len(orders)} orders from Shopify.")
            return orders
        except Exception as e:
            logger.error(f"Failed to fetch orders from Shopify: {e}")
            return []

async def ingestion_agent(state: AgentState) -> AgentState:
    """
    Ingestion Agent:
    Takes raw orders from the state, inserts them into staging tables.
    Checks for duplicates and updates financial status if it changed.
    Uses date_from and date_to for filtering (when connecting to real API).
    """
    raw_orders = state.get("raw_orders", [])
    staged_ids = state.get("staged_order_ids", [])
    date_from = state.get("date_from")
    date_to = state.get("date_to")
    
    if not raw_orders:
        logger.info(f"No raw_orders in state, attempting to fetch from Shopify API directly.")
        raw_orders = await fetch_shopify_orders(date_from, date_to)
    
    logger.info(f"Ingesting orders from {date_from} to {date_to}")
    
    async with AsyncSessionLocal() as db:
        for order in raw_orders:
            # We now process ALL orders (paid or unpaid)
            financial_status = order.get("financial_status") or ""
            financial_status = financial_status.lower()
            order_id = str(order.get("id"))
            
            # Check if we already staged this order
            stmt = select(ShopifyOrderRaw).where(ShopifyOrderRaw.shopify_order_id == order_id)
            result = await db.execute(stmt)
            existing_raw = result.scalars().first()
            
            if existing_raw:
                # Update existing header if financial_status changed (e.g. pending -> paid)
                stmt_hdr = select(StgShopifySalesOrderHdr).where(StgShopifySalesOrderHdr.shopify_order_id == order_id)
                res_hdr = await db.execute(stmt_hdr)
                existing_hdr = res_hdr.scalars().first()
                if existing_hdr and existing_hdr.financial_status != financial_status:
                    existing_hdr.financial_status = financial_status
                continue # Skip re-inserting lines
                
            # 1. Insert Raw
            raw_record = ShopifyOrderRaw(
                run_id=state.get("run_id"),
                shopify_order_id=order_id,
                raw_payload=order
            )
            db.add(raw_record)
            
            # 2. Insert Header
            hdr_record = StgShopifySalesOrderHdr(
                run_id=state.get("run_id"),
                shopify_order_id=order_id,
                customer_email=order.get("email"),
                total_price=float(order.get("total_price", 0.0)),
                financial_status=financial_status
            )
            db.add(hdr_record)
            await db.flush() # To get hdr_record.id
            
            # 3. Insert Lines
            line_items = order.get("line_items", [])
            for item in line_items:
                line_record = StgShopifySalesOrderLine(
                    hdr_id=hdr_record.id,
                    sku=item.get("sku"),
                    quantity=int(item.get("quantity", 0)),
                    processing_status=ProcessingStatus.PENDING
                )
                db.add(line_record)
            
            staged_ids.append(hdr_record.id)
            
        # Log Activity unconditionally
        from app.models import ActivityLog, ActivityType
        log = ActivityLog(
            run_id=state.get("run_id"),
            agent_name="Ingestion",
            title=f"Pipeline Run Started ({date_from or 'All Time'})",
            description=f"Fetched {len(raw_orders)} orders from Shopify: {', '.join([str(o.get('id')) for o in raw_orders])}",
            type=ActivityType.INFO
        )
        db.add(log)
            
        await db.commit()

    return {"staged_order_ids": staged_ids, "raw_orders": raw_orders}
