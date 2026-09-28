"""NARA AI Digital Office — Tool Gateway MCP Table-Level Access Control (ACL) per TAD v2.0 §9.1.
Validates SQL queries against an agent's declared data_sources allowlist.
Blocks DDL, DML, unauthorized table queries, and dangerous SQL operations.
"""

import re
from typing import List, Set, Tuple
from pydantic import BaseModel


# Canonical 25 NARAwear MCP Database Tables per TAD v2.0 §11
KNOWN_NARAWEAR_TABLES: Set[str] = {
    # Customer Intelligence
    "customer_profiles",
    "customer_rfm",
    "cohort_retention",
    # Product & Inventory
    "products",
    "product_variants",
    # Behavioural Analytics
    "events",
    "sessions",
    "product_events",
    "tracking_events",
    "cart_removals",
    "emailed_carts",
    "spinning_wheel_data",
    # Marketing / Ads
    "meta_campaigns",
    "amazon_campaigns",
    "state_performance",
    "monthly_plans",
    # Supply Chain
    "supply_hubs",
    "production_vendors",
    "performance_metrics",
    # Design / 3D
    "fabric_library",
    "render_jobs",
    # AI Operations
    "insight_cache",
}

DISALLOWED_KEYWORDS: List[str] = [
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "ALTER",
    "CREATE",
    "TRUNCATE",
    "REPLACE",
    "GRANT",
    "REVOKE",
    "EXEC",
    "EXECUTE",
    "CALL",
    "MERGE",
]


class AclValidationResult(BaseModel):
    is_valid: bool
    tables_found: List[str]
    unauthorized_tables: List[str]
    rejection_reason: str = ""


class McpTableAclValidator:
    """Table-level ACL validator enforcing TAD v2.0 §9.1 security policies."""

    @staticmethod
    def extract_tables_from_sql(sql: str) -> Set[str]:
        """Extract table names referenced in a SQL SELECT query."""
        cleaned_sql = re.sub(r"--.*?$", "", sql, flags=re.MULTILINE)
        cleaned_sql = re.sub(r"/\*.*?\*/", "", cleaned_sql, flags=re.DOTALL)

        found_tables: Set[str] = set()

        # Regular expression patterns for FROM, JOIN, INTO, UPDATE, TABLE clauses
        patterns = [
            r"\bFROM\s+([a-zA-Z_][a-zA-Z0-9_\.]*)",
            r"\bJOIN\s+([a-zA-Z_][a-zA-Z0-9_\.]*)",
            r"\bTABLE\s+([a-zA-Z_][a-zA-Z0-9_\.]*)",
        ]

        for pat in patterns:
            matches = re.finditer(pat, cleaned_sql, re.IGNORECASE)
            for m in matches:
                full_table_expr = m.group(1).strip().strip('"').strip("'").strip("`")
                # Strip schema qualification if present (e.g. public.products -> products)
                table_name = full_table_expr.split(".")[-1].lower()
                # Exclude SQL subqueries or reserved tokens
                if table_name not in {"select", "lateral", "unnest", "generate_series"}:
                    found_tables.add(table_name)

        # Also check for known table names explicitly present anywhere in tokens
        tokens = set(re.findall(r"\b[a-zA-Z_][a-zA-Z0-9_]*\b", cleaned_sql.lower()))
        for known_tbl in KNOWN_NARAWEAR_TABLES:
            if known_tbl in tokens:
                found_tables.add(known_tbl)

        return found_tables

    @classmethod
    def validate_query(
        cls,
        sql: str,
        declared_data_sources: List[str],
        allow_insight_cache_write: bool = False,
    ) -> AclValidationResult:
        """Validate if the SQL query conforms to the agent's declared data_sources."""
        if not sql or not sql.strip():
            return AclValidationResult(
                is_valid=False,
                tables_found=[],
                unauthorized_tables=[],
                rejection_reason="Query cannot be empty",
            )

        upper_sql = sql.strip().upper()

        # Check for disallowed DDL/DML keywords
        for keyword in DISALLOWED_KEYWORDS:
            pattern = rf"\b{keyword}\b"
            if re.search(pattern, upper_sql):
                if keyword in ["INSERT", "UPDATE"] and allow_insight_cache_write:
                    # Verify write is ONLY to insight_cache table
                    tables = cls.extract_tables_from_sql(sql)
                    if tables == {"insight_cache"}:
                        continue
                return AclValidationResult(
                    is_valid=False,
                    tables_found=list(cls.extract_tables_from_sql(sql)),
                    unauthorized_tables=[],
                    rejection_reason=f"Forbidden SQL operation: {keyword}. Read-only queries only.",
                )

        # Extract queried tables
        tables = cls.extract_tables_from_sql(sql)
        if not tables:
            # If standard SELECT without tables (e.g. SELECT 1 or SELECT NOW()), allow
            if upper_sql.startswith("SELECT"):
                return AclValidationResult(
                    is_valid=True,
                    tables_found=[],
                    unauthorized_tables=[],
                )
            return AclValidationResult(
                is_valid=False,
                tables_found=[],
                unauthorized_tables=[],
                rejection_reason="Could not extract valid table from query.",
            )

        # Validate against declared data_sources
        allowed_set = set(declared_data_sources)
        unauthorized = [tbl for tbl in tables if tbl not in allowed_set]

        if unauthorized:
            return AclValidationResult(
                is_valid=False,
                tables_found=list(tables),
                unauthorized_tables=unauthorized,
                rejection_reason=(
                    f"Agent is not authorized to query table(s): {', '.join(unauthorized)}. "
                    f"Declared data_sources: {', '.join(declared_data_sources) if declared_data_sources else 'none'}."
                ),
            )

        return AclValidationResult(
            is_valid=True,
            tables_found=list(tables),
            unauthorized_tables=[],
        )
