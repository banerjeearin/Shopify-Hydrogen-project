"""NARA AI Digital Office — Control Plane REST API Endpoints per TAD v2.0 §28 & §29.
"""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import StreamingResponse

from packages.contracts.enums import (
    DepartmentId,
    AgentStatus,
    TaskStatus,
    ApprovalStatus,
    AlertStatus,
    EventType,
    ActorType,
)
from packages.contracts.events import EventEnvelope, EventActor
from packages.contracts.models import (
    Agent,
    Department,
    Task,
    TaskCreate,
    TaskUpdate,
    Approval,
    ApprovalDecision,
    Alert,
    AlertCreate,
    AuditEvent,
    OfficeSnapshot,
)
from packages.agent_sdk.registry import AgentRegistry
from packages.tool_sdk.gateway import ToolGateway, ToolInvocationRequest, ToolInvocationResponse
from packages.tool_sdk.cache import InsightCacheService
from .storage import DigitalOfficeStorage
from .event_bus import EventBus


def create_api_router(
    storage: DigitalOfficeStorage,
    registry: AgentRegistry,
    event_bus: EventBus,
    tool_gateway: ToolGateway,
    cache_service: InsightCacheService,
) -> APIRouter:
    router = APIRouter(prefix="/api/v1")

    # --- Health & Office Snapshot ---
    @router.get("/health", tags=["System"])
    async def health_check():
        return {
            "status": "healthy",
            "service": "nara-ai-digital-office-control-plane",
            "version": "2.0.0",
            "architecture_baseline": "TAD v2.0 / BRD v2.1",
        }

    @router.get("/office/snapshot", response_model=OfficeSnapshot, tags=["Office"])
    async def get_office_snapshot():
        """Retrieve live digital office snapshot conforming to TAD v2.0 §29."""
        return storage.generate_office_snapshot()

    @router.get("/events/stream", tags=["Events"])
    async def stream_events(last_event_id: Optional[str] = Query(None)):
        """Server-Sent Events (SSE) stream for real-time digital office updates."""
        return StreamingResponse(
            event_bus.event_generator(last_event_id=last_event_id),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )

    # --- Department Endpoints ---
    @router.get("/departments", response_model=List[Department], tags=["Departments"])
    async def list_departments():
        return registry.list_departments()

    # --- Agent Endpoints ---
    @router.get("/agents", response_model=List[Agent], tags=["Agents"])
    async def list_agents(department: Optional[DepartmentId] = Query(None)):
        return registry.list_agents(department_id=department)

    @router.get("/agents/{agent_id}", response_model=Agent, tags=["Agents"])
    async def get_agent(agent_id: str):
        agent = registry.get_agent(agent_id)
        if not agent:
            raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found")
        return agent

    @router.post("/agents/{agent_id}/pause", response_model=Agent, tags=["Agents"])
    async def pause_agent(agent_id: str):
        agent = registry.update_agent_status(agent_id, AgentStatus.PAUSED)
        if not agent:
            raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found")
        
        event = EventEnvelope(
            event_type=EventType.AGENT_STATUS_CHANGED,
            actor=EventActor(type=ActorType.USER, id="operations_user"),
            payload={"agent_id": agent_id, "new_status": AgentStatus.PAUSED.value},
        )
        await event_bus.publish(event)
        storage.record_audit_event(event)
        return agent

    @router.post("/agents/{agent_id}/resume", response_model=Agent, tags=["Agents"])
    async def resume_agent(agent_id: str):
        agent = registry.update_agent_status(agent_id, AgentStatus.IDLE)
        if not agent:
            raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found")

        event = EventEnvelope(
            event_type=EventType.AGENT_STATUS_CHANGED,
            actor=EventActor(type=ActorType.USER, id="operations_user"),
            payload={"agent_id": agent_id, "new_status": AgentStatus.IDLE.value},
        )
        await event_bus.publish(event)
        storage.record_audit_event(event)
        return agent

    # --- Task Endpoints ---
    @router.get("/tasks", response_model=List[Task], tags=["Tasks"])
    async def list_tasks(
        status: Optional[TaskStatus] = Query(None),
        agent_id: Optional[str] = Query(None),
        department: Optional[DepartmentId] = Query(None),
    ):
        return storage.list_tasks(status=status, agent_id=agent_id, department=department)

    @router.post("/tasks", response_model=Task, status_code=status.HTTP_201_CREATED, tags=["Tasks"])
    async def create_task(data: TaskCreate):
        task = storage.create_task(data)
        event = EventEnvelope(
            event_type=EventType.TASK_CREATED,
            task_id=task.id,
            actor=EventActor(type=ActorType.SYSTEM, id="api_control_plane"),
            payload=task.model_dump(),
        )
        await event_bus.publish(event)
        storage.record_audit_event(event)
        return task

    @router.get("/tasks/{task_id}", response_model=Task, tags=["Tasks"])
    async def get_task(task_id: str):
        task = storage.get_task(task_id)
        if not task:
            raise HTTPException(status_code=404, detail=f"Task '{task_id}' not found")
        return task

    @router.post("/tasks/{task_id}/cancel", response_model=Task, tags=["Tasks"])
    async def cancel_task(task_id: str):
        task = storage.cancel_task(task_id)
        if not task:
            raise HTTPException(status_code=404, detail=f"Task '{task_id}' not found")
        event = EventEnvelope(
            event_type=EventType.TASK_UPDATED,
            task_id=task.id,
            actor=EventActor(type=ActorType.USER, id="operations_user"),
            payload={"task_id": task.id, "new_status": TaskStatus.CANCELLED.value},
        )
        await event_bus.publish(event)
        storage.record_audit_event(event)
        return task

    @router.post("/tasks/{task_id}/retry", response_model=Task, tags=["Tasks"])
    async def retry_task(task_id: str):
        task = storage.retry_task(task_id)
        if not task:
            raise HTTPException(status_code=404, detail=f"Task '{task_id}' not found")
        event = EventEnvelope(
            event_type=EventType.TASK_UPDATED,
            task_id=task.id,
            actor=EventActor(type=ActorType.USER, id="operations_user"),
            payload={"task_id": task.id, "new_status": TaskStatus.RUNNING.value},
        )
        await event_bus.publish(event)
        storage.record_audit_event(event)
        return task

    # --- Approval Endpoints ---
    @router.get("/approvals", response_model=List[Approval], tags=["Approvals"])
    async def list_approvals(status: Optional[ApprovalStatus] = Query(None)):
        return storage.list_approvals(status=status)

    @router.post("/approvals/{approval_id}/approve", response_model=Approval, tags=["Approvals"])
    async def approve_request(approval_id: str, notes: Optional[str] = Query(None)):
        decision = ApprovalDecision(approved=True, decided_by="operations_user", notes=notes)
        appr = storage.decide_approval(approval_id, decision)
        if not appr:
            raise HTTPException(status_code=404, detail=f"Approval '{approval_id}' not found")
        event = EventEnvelope(
            event_type=EventType.APPROVAL_DECIDED,
            task_id=appr.task_id,
            workflow_run_id=appr.workflow_run_id,
            actor=EventActor(type=ActorType.USER, id="operations_user"),
            payload=appr.model_dump(),
        )
        await event_bus.publish(event)
        storage.record_audit_event(event)
        return appr

    @router.post("/approvals/{approval_id}/reject", response_model=Approval, tags=["Approvals"])
    async def reject_request(approval_id: str, notes: Optional[str] = Query(None)):
        decision = ApprovalDecision(approved=False, decided_by="operations_user", notes=notes)
        appr = storage.decide_approval(approval_id, decision)
        if not appr:
            raise HTTPException(status_code=404, detail=f"Approval '{approval_id}' not found")
        event = EventEnvelope(
            event_type=EventType.APPROVAL_DECIDED,
            task_id=appr.task_id,
            workflow_run_id=appr.workflow_run_id,
            actor=EventActor(type=ActorType.USER, id="operations_user"),
            payload=appr.model_dump(),
        )
        await event_bus.publish(event)
        storage.record_audit_event(event)
        return appr

    # --- Alert Endpoints ---
    @router.get("/alerts", response_model=List[Alert], tags=["Alerts"])
    async def list_alerts(status: Optional[AlertStatus] = Query(None)):
        return storage.list_alerts(status=status)

    @router.post("/alerts", response_model=Alert, status_code=status.HTTP_201_CREATED, tags=["Alerts"])
    async def trigger_alert(data: AlertCreate):
        alert = storage.create_alert(data)
        event = EventEnvelope(
            event_type=EventType.ALERT_TRIGGERED,
            actor=EventActor(type=ActorType.SYSTEM, id="alert_engine"),
            payload=alert.model_dump(),
        )
        await event_bus.publish(event)
        storage.record_audit_event(event)
        return alert

    @router.post("/alerts/{alert_id}/acknowledge", response_model=Alert, tags=["Alerts"])
    async def acknowledge_alert(alert_id: str):
        alert = storage.acknowledge_alert(alert_id)
        if not alert:
            raise HTTPException(status_code=404, detail=f"Alert '{alert_id}' not found")
        event = EventEnvelope(
            event_type=EventType.ALERT_ACKNOWLEDGED,
            actor=EventActor(type=ActorType.USER, id="operations_user"),
            payload={"alert_id": alert_id},
        )
        await event_bus.publish(event)
        storage.record_audit_event(event)
        return alert

    @router.post("/alerts/{alert_id}/escalate", response_model=Task, tags=["Alerts"])
    async def escalate_alert(alert_id: str):
        task = storage.escalate_alert_to_task(alert_id)
        if not task:
            raise HTTPException(status_code=404, detail=f"Alert '{alert_id}' not found")
        event = EventEnvelope(
            event_type=EventType.ALERT_ESCALATED,
            task_id=task.id,
            actor=EventActor(type=ActorType.USER, id="operations_user"),
            payload={"alert_id": alert_id, "escalated_task_id": task.id},
        )
        await event_bus.publish(event)
        storage.record_audit_event(event)
        return task

    # --- Audit Endpoints ---
    @router.get("/audit", response_model=List[AuditEvent], tags=["Audit"])
    async def get_audit_trail(limit: int = Query(50, le=500)):
        return storage.list_audit_events(limit=limit)

    # --- Tool Gateway Endpoints ---
    @router.post("/tools/execute", response_model=ToolInvocationResponse, tags=["Tools"])
    async def execute_tool(request: ToolInvocationRequest):
        res = await tool_gateway.execute_tool(request)
        if res.audit_event:
            await event_bus.publish(res.audit_event)
            storage.record_audit_event(res.audit_event, data_sources_queried=res.tables_accessed)
        return res

    # --- Cache Metrics Endpoint ---
    @router.get("/cache/metrics", tags=["Insight Cache"])
    async def get_cache_metrics():
        return cache_service.metrics.model_dump()

    return router
