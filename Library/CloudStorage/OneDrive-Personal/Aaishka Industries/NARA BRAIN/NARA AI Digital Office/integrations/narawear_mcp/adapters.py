"""NARA AI Digital Office — NARAwear MCP Query Adapters per TAD v2.0 §16.2.
Provides type-safe, parameterized SQL query generation for MCP operations.
"""

from typing import Any, Dict, List, Optional


class NarawearQueryAdapters:
    """Type-safe query builders for NARAwear PostgreSQL tables."""

    @staticmethod
    def query_variants(
        product_id: Optional[str] = None,
        min_inventory: Optional[int] = None,
        size_filter: Optional[str] = None,
        limit: int = 100,
    ) -> str:
        clauses = []
        if product_id:
            clauses.append(f"product_id = '{product_id}'")
        if min_inventory is not None:
            clauses.append(f"inventory_quantity >= {min_inventory}")
        if size_filter:
            clauses.append(f"size = '{size_filter}'")

        where_stmt = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        return f"SELECT * FROM product_variants {where_stmt} ORDER BY id ASC LIMIT {limit};"

    @staticmethod
    def query_products(
        category: Optional[str] = None,
        is_active: bool = True,
        limit: int = 100,
    ) -> str:
        clauses = [f"is_active = {str(is_active).lower()}"]
        if category:
            clauses.append(f"category = '{category}'")

        where_stmt = f"WHERE {' AND '.join(clauses)}"
        return f"SELECT * FROM products {where_stmt} ORDER BY created_at DESC LIMIT {limit};"

    @staticmethod
    def query_campaigns(
        platform: str = "meta",
        date_range: Optional[str] = None,
        limit: int = 50,
    ) -> str:
        table = "meta_campaigns" if platform.lower() == "meta" else "amazon_campaigns"
        where_stmt = f"WHERE date_range = '{date_range}'" if date_range else ""
        return f"SELECT * FROM {table} {where_stmt} ORDER BY spend DESC LIMIT {limit};"

    @staticmethod
    def query_customers(
        segment: Optional[str] = None,
        min_ltv: Optional[float] = None,
        limit: int = 100,
    ) -> str:
        clauses = []
        if segment:
            clauses.append(f"segment = '{segment}'")
        if min_ltv is not None:
            clauses.append(f"total_spent >= {min_ltv}")
        where_stmt = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        return f"SELECT * FROM customer_profiles {where_stmt} ORDER BY total_spent DESC LIMIT {limit};"

    @staticmethod
    def query_rfm(segment_filter: Optional[str] = None, limit: int = 100) -> str:
        where_stmt = f"WHERE rfm_segment = '{segment_filter}'" if segment_filter else ""
        return f"SELECT * FROM customer_rfm {where_stmt} ORDER BY rfm_score DESC LIMIT {limit};"

    @staticmethod
    def query_cart_removals(
        reason: Optional[str] = None,
        limit: int = 100,
    ) -> str:
        where_stmt = f"WHERE removal_reason = '{reason}'" if reason else ""
        return f"SELECT * FROM cart_removals {where_stmt} ORDER BY removed_at DESC LIMIT {limit};"

    @staticmethod
    def query_vendors(
        hub_id: Optional[str] = None,
        min_quality_score: Optional[float] = None,
        limit: int = 50,
    ) -> str:
        clauses = []
        if hub_id:
            clauses.append(f"hub_id = '{hub_id}'")
        if min_quality_score is not None:
            clauses.append(f"quality_score >= {min_quality_score}")
        where_stmt = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        return f"SELECT * FROM production_vendors {where_stmt} ORDER BY quality_score DESC LIMIT {limit};"

    @staticmethod
    def query_fabric(
        composition: Optional[str] = None,
        max_cost: Optional[float] = None,
        limit: int = 50,
    ) -> str:
        clauses = []
        if composition:
            clauses.append(f"composition LIKE '%{composition}%'")
        if max_cost is not None:
            clauses.append(f"cost_per_meter <= {max_cost}")
        where_stmt = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        return f"SELECT * FROM fabric_library {where_stmt} ORDER BY cost_per_meter ASC LIMIT {limit};"

    @staticmethod
    def query_monthly_plan(month_key: str) -> str:
        return f"SELECT * FROM monthly_plans WHERE month_key = '{month_key}' LIMIT 1;"
