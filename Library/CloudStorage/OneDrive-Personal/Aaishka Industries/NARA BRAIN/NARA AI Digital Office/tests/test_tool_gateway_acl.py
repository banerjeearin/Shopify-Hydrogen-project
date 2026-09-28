"""Unit tests for Tool Gateway and MCP Table-Level ACL Enforcement per TAD v2.0 §9.1.
"""

import pytest
from packages.agent_sdk.registry import AgentRegistry
from packages.tool_sdk.acl import McpTableAclValidator
from packages.tool_sdk.gateway import ToolGateway, ToolInvocationRequest


def test_acl_table_extraction():
    sql = "SELECT pv.sku, p.title FROM product_variants pv JOIN products p ON pv.product_id = p.id WHERE pv.inventory_quantity < 5;"
    tables = McpTableAclValidator.extract_tables_from_sql(sql)
    assert "product_variants" in tables
    assert "products" in tables


def test_acl_allowed_query():
    sql = "SELECT sku, size, inventory_quantity FROM product_variants WHERE inventory_quantity < 2;"
    declared = ["products", "product_variants", "product_events"]
    result = McpTableAclValidator.validate_query(sql, declared)
    assert result.is_valid is True
    assert "product_variants" in result.tables_found
    assert len(result.unauthorized_tables) == 0


def test_acl_blocked_unauthorized_table():
    # inventory_monitor tries to access customer_profiles (not in its declared data_sources)
    sql = "SELECT c.email, pv.sku FROM customer_profiles c JOIN product_variants pv ON c.id = pv.id;"
    declared = ["products", "product_variants", "product_events"]
    result = McpTableAclValidator.validate_query(sql, declared)
    assert result.is_valid is False
    assert "customer_profiles" in result.unauthorized_tables
    assert "not authorized to query table" in result.rejection_reason


def test_acl_blocked_ddl_and_dml():
    queries = [
        "DROP TABLE products;",
        "DELETE FROM product_variants WHERE id = 1;",
        "UPDATE products SET title = 'Hacked';",
        "TRUNCATE TABLE sessions;",
        "ALTER TABLE meta_campaigns ADD COLUMN leaked text;",
    ]
    declared = ["products", "product_variants", "meta_campaigns"]
    for q in queries:
        result = McpTableAclValidator.validate_query(q, declared)
        assert result.is_valid is False
        assert "Forbidden SQL operation" in result.rejection_reason


@pytest.mark.asyncio
async def test_tool_gateway_execution_flow():
    registry = AgentRegistry()
    gateway = ToolGateway(agent_registry=registry)

    # Authorized query execution
    req_valid = ToolInvocationRequest(
        agent_id="inventory_monitor",
        tool_name="narawear_mcp.query",
        arguments={"sql": "SELECT * FROM product_variants LIMIT 10;"},
    )
    res_valid = await gateway.execute_tool(req_valid)
    assert res_valid.success is True
    assert "product_variants" in res_valid.tables_accessed
    assert res_valid.audit_event is not None

    # Unauthorized query execution
    req_invalid = ToolInvocationRequest(
        agent_id="inventory_monitor",
        tool_name="narawear_mcp.query",
        arguments={"sql": "SELECT * FROM customer_rfm LIMIT 10;"},
    )
    res_invalid = await gateway.execute_tool(req_invalid)
    assert res_invalid.success is False
    assert "MCP ACL Violation" in res_invalid.error
