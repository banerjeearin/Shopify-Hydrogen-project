"""Integration tests for Control Plane REST API endpoints per TAD v2.0 §28 & §29.
"""

import pytest
from fastapi.testclient import TestClient
from services.api.main import create_app
from packages.contracts.enums import DepartmentId, TaskPriority, TaskStatus


@pytest.fixture
def client():
    app = create_app()
    return TestClient(app)


def test_health_endpoint(client):
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["version"] == "2.0.0"


def test_office_snapshot_contract(client):
    res = client.get("/api/v1/office/snapshot")
    assert res.status_code == 200
    data = res.json()

    # Verify TAD §29 required contract properties
    assert data["office_status"] == "RUNNING"
    assert "departments" in data
    assert "agents" in data
    assert "active_tasks" in data
    assert "approvals" in data
    assert "alerts" in data
    assert "metrics" in data
    assert "snapshot_version" in data

    assert len(data["departments"]) == 8
    assert len(data["agents"]) >= 18
    assert "meta_roas_7d" in data["metrics"]


def test_agent_lifecycle(client):
    # 1. Get agent
    res = client.get("/api/v1/agents/inventory_monitor")
    assert res.status_code == 200
    assert res.json()["id"] == "inventory_monitor"

    # 2. Pause agent
    res_pause = client.post("/api/v1/agents/inventory_monitor/pause")
    assert res_pause.status_code == 200
    assert res_pause.json()["status"] == "paused"

    # 3. Resume agent
    res_resume = client.post("/api/v1/agents/inventory_monitor/resume")
    assert res_resume.status_code == 200
    assert res_resume.json()["status"] == "idle"


def test_task_management_flow(client):
    # 1. Create task
    task_payload = {
        "title": "Evaluate Stockout for Silk Blouse - S",
        "description": "Variant inventory is below reorder threshold",
        "department": "product_inventory",
        "assigned_agent_id": "inventory_monitor",
        "priority": "high",
        "input_payload": {"sku": "SILK-BLS-S", "threshold": 5},
    }
    res = client.post("/api/v1/tasks", json=task_payload)
    assert res.status_code == 201
    task_data = res.json()
    task_id = task_data["id"]
    assert task_data["status"] == "pending"

    # 2. Retrieve task
    res_get = client.get(f"/api/v1/tasks/{task_id}")
    assert res_get.status_code == 200
    assert res_get.json()["title"] == task_payload["title"]

    # 3. Cancel task
    res_cancel = client.post(f"/api/v1/tasks/{task_id}/cancel")
    assert res_cancel.status_code == 200
    assert res_cancel.json()["status"] == "cancelled"

    # 4. Retry task
    res_retry = client.post(f"/api/v1/tasks/{task_id}/retry")
    assert res_retry.status_code == 200
    assert res_retry.json()["status"] == "running"


def test_approval_flow(client):
    # Retrieve approvals seeded in storage
    res = client.get("/api/v1/approvals")
    assert res.status_code == 200

    # Trigger a new approval by creating an approval directly in storage
    storage = client.app.state.storage
    appr = storage.create_approval(
        agent_id="purchase_planner",
        action_type="create_purchase_order",
        reason="Purchase order draft amount $12,400 exceeds autonomous limit $5,000",
        summary="PO-2026-09-001: 500m Cotton Fabric from Liimra Hub",
        requested_by="purchase_planner",
        requested_payload={"po_amount": 12400.0, "vendor": "Liimra"},
    )

    # Approve request
    res_approve = client.post(f"/api/v1/approvals/{appr.id}/approve?notes=Approved+by+Operations+Lead")
    assert res_approve.status_code == 200
    assert res_approve.json()["status"] == "approved"
    assert res_approve.json()["decided_by"] == "operations_user"


def test_alert_escalation_flow(client):
    # Trigger alert
    alert_payload = {
        "rule_id": "rule_critical_stockout",
        "title": "Critical Stockout: Linen Shirt - L",
        "description": "Inventory zero with 10 pending backorders",
        "severity": "critical",
        "category": "stockout",
        "department": "product_inventory",
        "agent_id": "inventory_monitor",
        "metric_value": 0.0,
        "threshold_value": 5.0,
    }
    res_alert = client.post("/api/v1/alerts", json=alert_payload)
    assert res_alert.status_code == 201
    alert_id = res_alert.json()["id"]

    # Escalate alert to task
    res_esc = client.post(f"/api/v1/alerts/{alert_id}/escalate")
    assert res_esc.status_code == 200
    task = res_esc.json()
    assert "Escalation" in task["title"]
    assert task["priority"] == "critical"
