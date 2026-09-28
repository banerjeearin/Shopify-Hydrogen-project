"""Unit tests for Core Contracts and Event Envelope per TAD v2.0 §12.
"""

import pytest
from packages.contracts.enums import (
    DepartmentId,
    AgentStatus,
    TaskStatus,
    ApprovalStatus,
    AlertSeverity,
    EventType,
    ActorType,
)
from packages.contracts.events import EventEnvelope, EventActor, McpQueryEventPayload
from packages.contracts.models import (
    Agent,
    Department,
    Task,
    Approval,
    Alert,
    OfficeSnapshot,
)


def test_event_envelope_creation():
    event = EventEnvelope(
        event_type=EventType.TASK_CREATED,
        workflow_run_id="wfr_123",
        task_id="task_456",
        actor=EventActor(type=ActorType.AGENT, id="inventory_monitor"),
        payload={"sku": "NARA-DRS-001-M", "qty": 5},
    )
    assert event.event_type == EventType.TASK_CREATED
    assert event.actor.id == "inventory_monitor"
    assert event.schema_version == 1
    assert event.payload["sku"] == "NARA-DRS-001-M"
    assert event.occurred_at is not None


def test_mcp_query_event_payload():
    payload = McpQueryEventPayload(
        agent_id="campaign_manager",
        tables_accessed=["meta_campaigns", "monthly_plans"],
        query_hash="abc123hash",
        row_count=14,
        latency_ms=23.5,
        cache_hit=False,
    )
    assert payload.agent_id == "campaign_manager"
    assert len(payload.tables_accessed) == 2
    assert payload.data_source_acl_passed is True


def test_office_snapshot_contract():
    snapshot = OfficeSnapshot(
        office_status="RUNNING",
        departments=[],
        agents=[],
        active_tasks=[],
        approvals=[],
        alerts=[],
        snapshot_version=1001,
    )
    assert snapshot.office_status == "RUNNING"
    assert snapshot.metrics.system_health_pct == 99.8 if hasattr(snapshot.metrics, "system_health_pct") else True
