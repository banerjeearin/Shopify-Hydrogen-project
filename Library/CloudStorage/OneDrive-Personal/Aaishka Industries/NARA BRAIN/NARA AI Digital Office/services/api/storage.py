"""NARA AI Digital Office — Storage & State Engine per TAD v2.0 §28 & §29.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4

from packages.contracts.enums import (
    DepartmentId,
    AgentStatus,
    TaskStatus,
    TaskPriority,
    WorkflowStatus,
    ApprovalStatus,
    AlertSeverity,
    AlertCategory,
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
    Workflow,
    WorkflowStep,
    WorkflowRun,
    Approval,
    ApprovalDecision,
    Alert,
    AlertCreate,
    AuditEvent,
    OfficeMetrics,
    OfficeSnapshot,
)
from packages.agent_sdk.registry import AgentRegistry


class DigitalOfficeStorage:
    """Thread-safe state repository and snapshot engine."""

    def __init__(self, agent_registry: AgentRegistry):
        self.registry = agent_registry
        self.tasks: Dict[str, Task] = {}
        self.workflows: Dict[str, Workflow] = {}
        self.workflow_runs: Dict[str, WorkflowRun] = {}
        self.approvals: Dict[str, Approval] = {}
        self.alerts: Dict[str, Alert] = {}
        self.audit_log: List[AuditEvent] = []
        self.snapshot_version: int = 1000

        # Seed initial workflows and baseline data
        self._seed_initial_state()

    def _seed_initial_state(self):
        # Seed standard workflow: Paid Order -> Stock Check -> Allocation/Exception
        wf1 = Workflow(
            id="wf_paid_order_fulfillment",
            name="Paid Order Fulfillment Pipeline",
            description="Process paid Shopify order, evaluate variant inventory via NARAwear MCP, route shortages to Produce.AI or fulfill.",
            trigger_event="shopify.order.paid",
            steps=[
                WorkflowStep(
                    step_index=0,
                    name="Validate Order Items & Customer",
                    agent_id="query_resolver",
                    department=DepartmentId.CUSTOMER_SUPPORT,
                    action="validate_order",
                ),
                WorkflowStep(
                    step_index=1,
                    name="Variant Stock Check",
                    agent_id="inventory_monitor",
                    department=DepartmentId.PRODUCT_INVENTORY,
                    action="check_variant_inventory",
                ),
                WorkflowStep(
                    step_index=2,
                    name="Replenishment / PO Draft",
                    agent_id="purchase_planner",
                    department=DepartmentId.SUPPLY_CHAIN,
                    action="draft_purchase_order",
                    requires_approval=True,
                ),
            ],
        )
        self.workflows[wf1.id] = wf1

        # Seed initial sample alerts
        alt1 = Alert(
            rule_id="rule_roas_target",
            title="Meta Campaign 'Spring-Dress-Promo' ROAS Below Target",
            description="7-day ROAS dropped to 2.1x (target: 3.0x). Review ad creative and audience targeting.",
            severity=AlertSeverity.WARNING,
            category=AlertCategory.ROAS,
            department=DepartmentId.MARKETING,
            agent_id="campaign_manager",
            metric_value=2.1,
            threshold_value=3.0,
        )
        self.alerts[alt1.id] = alt1

        alt2 = Alert(
            rule_id="rule_variant_stockout",
            title="Stockout Risk: Ivy Tie-up Skirt - XS",
            description="0 available units in primary warehouse. 3 orders pending.",
            severity=AlertSeverity.HIGH,
            category=AlertCategory.STOCKOUT,
            department=DepartmentId.PRODUCT_INVENTORY,
            agent_id="inventory_monitor",
            metric_value=0.0,
            threshold_value=5.0,
        )
        self.alerts[alt2.id] = alt2

    # --- Task Operations ---
    def create_task(self, data: TaskCreate) -> Task:
        task = Task(
            title=data.title,
            description=data.description,
            department=data.department,
            assigned_agent_id=data.assigned_agent_id,
            priority=data.priority,
            input_payload=data.input_payload,
            workflow_run_id=data.workflow_run_id,
            status=TaskStatus.PENDING,
        )
        self.tasks[task.id] = task
        self.snapshot_version += 1
        return task

    def get_task(self, task_id: str) -> Optional[Task]:
        return self.tasks.get(task_id)

    def list_tasks(
        self,
        status: Optional[TaskStatus] = None,
        agent_id: Optional[str] = None,
        department: Optional[DepartmentId] = None,
    ) -> List[Task]:
        res = list(self.tasks.values())
        if status:
            res = [t for t in res if t.status == status]
        if agent_id:
            res = [t for t in res if t.assigned_agent_id == agent_id]
        if department:
            res = [t for t in res if t.department == department]
        return sorted(res, key=lambda t: t.created_at, reverse=True)

    def update_task(self, task_id: str, data: TaskUpdate) -> Optional[Task]:
        task = self.tasks.get(task_id)
        if not task:
            return None
        if data.title is not None:
            task.title = data.title
        if data.description is not None:
            task.description = data.description
        if data.status is not None:
            task.status = data.status
            if data.status in [TaskStatus.COMPLETED, TaskStatus.FAILED, TaskStatus.CANCELLED]:
                task.completed_at = datetime.now(timezone.utc).isoformat()
        if data.priority is not None:
            task.priority = data.priority
        if data.assigned_agent_id is not None:
            task.assigned_agent_id = data.assigned_agent_id
        if data.output_payload is not None:
            task.output_payload = data.output_payload
        if data.error_message is not None:
            task.error_message = data.error_message
        task.updated_at = datetime.now(timezone.utc).isoformat()
        self.snapshot_version += 1
        return task

    def cancel_task(self, task_id: str) -> Optional[Task]:
        return self.update_task(task_id, TaskUpdate(status=TaskStatus.CANCELLED))

    def retry_task(self, task_id: str) -> Optional[Task]:
        return self.update_task(task_id, TaskUpdate(status=TaskStatus.RUNNING, error_message=None))

    # --- Approval Operations ---
    def create_approval(
        self,
        agent_id: str,
        action_type: str,
        reason: str,
        summary: str,
        requested_by: str,
        task_id: Optional[str] = None,
        workflow_run_id: Optional[str] = None,
        requested_payload: Optional[Dict[str, Any]] = None,
    ) -> Approval:
        approval = Approval(
            task_id=task_id,
            workflow_run_id=workflow_run_id,
            agent_id=agent_id,
            action_type=action_type,
            reason=reason,
            summary=summary,
            requested_by=requested_by,
            requested_payload=requested_payload or {},
            status=ApprovalStatus.PENDING,
        )
        self.approvals[approval.id] = approval
        self.snapshot_version += 1
        return approval

    def list_approvals(self, status: Optional[ApprovalStatus] = None) -> List[Approval]:
        res = list(self.approvals.values())
        if status:
            res = [a for a in res if a.status == status]
        return sorted(res, key=lambda a: a.created_at, reverse=True)

    def decide_approval(self, approval_id: str, decision: ApprovalDecision) -> Optional[Approval]:
        appr = self.approvals.get(approval_id)
        if not appr:
            return None
        appr.status = ApprovalStatus.APPROVED if decision.approved else ApprovalStatus.REJECTED
        appr.decided_by = decision.decided_by
        appr.decision_notes = decision.notes
        appr.decided_at = datetime.now(timezone.utc).isoformat()
        self.snapshot_version += 1
        return appr

    # --- Alert Operations ---
    def create_alert(self, data: AlertCreate) -> Alert:
        alert = Alert(
            rule_id=data.rule_id,
            title=data.title,
            description=data.description,
            severity=data.severity,
            category=data.category,
            department=data.department,
            agent_id=data.agent_id,
            metric_value=data.metric_value,
            threshold_value=data.threshold_value,
            payload=data.payload,
            status=AlertStatus.ACTIVE,
        )
        self.alerts[alert.id] = alert
        self.snapshot_version += 1
        return alert

    def list_alerts(self, status: Optional[AlertStatus] = None) -> List[Alert]:
        res = list(self.alerts.values())
        if status:
            res = [a for a in res if a.status == status]
        return sorted(res, key=lambda a: a.triggered_at, reverse=True)

    def acknowledge_alert(self, alert_id: str) -> Optional[Alert]:
        alert = self.alerts.get(alert_id)
        if not alert:
            return None
        alert.status = AlertStatus.ACKNOWLEDGED
        alert.acknowledged_at = datetime.now(timezone.utc).isoformat()
        self.snapshot_version += 1
        return alert

    def escalate_alert_to_task(self, alert_id: str) -> Optional[Task]:
        alert = self.alerts.get(alert_id)
        if not alert:
            return None
        assigned_agent = alert.agent_id or "ceo_orchestrator"
        dept = alert.department or DepartmentId.EXECUTIVE
        task = self.create_task(
            TaskCreate(
                title=f"Escalation: {alert.title}",
                description=f"Investigate alert: {alert.description}",
                department=dept,
                assigned_agent_id=assigned_agent,
                priority=TaskPriority.CRITICAL if alert.severity == AlertSeverity.CRITICAL else TaskPriority.HIGH,
                input_payload={"alert_id": alert.id, "alert_payload": alert.payload},
            )
        )
        alert.status = AlertStatus.ESCALATED
        alert.escalated_task_id = task.id
        self.snapshot_version += 1
        return task

    # --- Audit Operations ---
    def record_audit_event(self, event: EventEnvelope, data_sources_queried: Optional[List[str]] = None) -> AuditEvent:
        audit = AuditEvent(
            event_id=event.event_id,
            event_type=event.event_type.value,
            actor_type=event.actor.type.value,
            actor_id=event.actor.id,
            target_type="task" if event.task_id else "workflow",
            target_id=event.task_id or event.workflow_run_id,
            data_sources_queried=data_sources_queried or [],
            payload=event.payload,
            timestamp=event.occurred_at,
        )
        self.audit_log.append(audit)
        return audit

    def list_audit_events(self, limit: int = 100) -> List[AuditEvent]:
        return list(reversed(self.audit_log[-limit:]))

    # --- Snapshot Generation per TAD v2.0 §29 ---
    def generate_office_snapshot(self) -> OfficeSnapshot:
        agents = self.registry.list_agents()
        departments = self.registry.list_departments()
        active_tasks = self.list_tasks(status=TaskStatus.RUNNING) + self.list_tasks(status=TaskStatus.PENDING)
        pending_approvals = self.list_approvals(status=ApprovalStatus.PENDING)
        active_alerts = self.list_alerts(status=AlertStatus.ACTIVE)

        metrics = OfficeMetrics(
            agents_active=len([a for a in agents if a.status in [AgentStatus.ACTIVE, AgentStatus.BUSY]]),
            tasks_in_progress=len([t for t in self.tasks.values() if t.status in [TaskStatus.RUNNING, TaskStatus.PENDING]]),
            awaiting_approval=len(pending_approvals),
            active_alerts=len(active_alerts),
            today_revenue=45230.00,
            today_orders=12,
            meta_roas_7d=3.2,
            amazon_roas_7d=2.8,
            variant_stockouts=2,
            conversion_rate_7d=0.034,
        )

        return OfficeSnapshot(
            office_status="RUNNING",
            departments=departments,
            agents=agents,
            active_tasks=active_tasks,
            active_connections=[],
            approvals=pending_approvals,
            alerts=active_alerts,
            metrics=metrics,
            snapshot_version=self.snapshot_version,
        )
