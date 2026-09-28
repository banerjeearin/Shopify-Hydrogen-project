"""Unit tests for Agent & Department Registry.
Validates preloading and registration per TAD v2.0 and BRD v2.1.
"""

import pytest
from packages.contracts.enums import DepartmentId, AgentStatus
from packages.agent_sdk.registry import AgentRegistry


def test_registry_initialization():
    registry = AgentRegistry()
    departments = registry.list_departments()
    agents = registry.list_agents()

    assert len(departments) == 8
    assert len(agents) >= 18

    dept_ids = {d.id for d in departments}
    expected_depts = {
        DepartmentId.EXECUTIVE,
        DepartmentId.MARKETING,
        DepartmentId.TREND_DESIGN,
        DepartmentId.SALES_ECOMMERCE,
        DepartmentId.PRODUCT_INVENTORY,
        DepartmentId.SUPPLY_CHAIN,
        DepartmentId.CUSTOMER_SUPPORT,
        DepartmentId.FINANCE_ACCOUNTING,
    }
    assert dept_ids == expected_depts


def test_feedback_analyst_registered():
    """Verify Feedback Analyst is registered per BRD v2.1 §10.1 / §25 requirement."""
    registry = AgentRegistry()
    agent = registry.get_agent("feedback_analyst")
    assert agent is not None
    assert agent.department == DepartmentId.CUSTOMER_SUPPORT
    assert "events" in agent.data_sources
    assert "customer_profiles" in agent.data_sources


def test_inventory_monitor_data_sources():
    registry = AgentRegistry()
    agent = registry.get_agent("inventory_monitor")
    assert agent is not None
    assert agent.department == DepartmentId.PRODUCT_INVENTORY
    assert "product_variants" in agent.data_sources
    assert "products" in agent.data_sources


def test_agent_status_updates():
    registry = AgentRegistry()
    updated = registry.update_agent_status("inventory_monitor", AgentStatus.PAUSED)
    assert updated is not None
    assert updated.status == AgentStatus.PAUSED

    resumed = registry.update_agent_status("inventory_monitor", AgentStatus.IDLE)
    assert resumed.status == AgentStatus.IDLE
