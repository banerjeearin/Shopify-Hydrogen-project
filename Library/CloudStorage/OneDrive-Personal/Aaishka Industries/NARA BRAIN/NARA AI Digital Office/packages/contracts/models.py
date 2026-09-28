"""NARA AI Digital Office — Core Domain Models & Schemas.
Conforms strictly to TAD v2.0 §7, §9, §27, §28, §29 and BRD v2.1.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4
from pydantic import BaseModel, Field

from .enums import (
    DepartmentId,
    AgentStatus,
    TaskStatus,
    TaskPriority,
    WorkflowStatus,
    ApprovalStatus,
    AlertSeverity,
    AlertCategory,
    AlertStatus,
    ModelPolicy,
)


class AgentLimits(BaseModel):
    max_run_seconds: int = 180
    max_tool_calls: int = 20
    max_delegation_depth: int = 2
    max_mcp_query_rows: int = 5000


class AgentApprovalPolicy(BaseModel):
    create_purchase_order: str = "required"
    publish_campaign: str = "required"
    refund_above_threshold: str = "required"
    journal_entry_post: str = "required"


class Agent(BaseModel):
    id: str
    name: str
    department: DepartmentId
    purpose: str
    role: str = ""
    status: AgentStatus = AgentStatus.IDLE
    model_policy: ModelPolicy = ModelPolicy.BALANCED_REASONING
    capabilities: List[str] = Field(default_factory=list)
    tools: List[str] = Field(default_factory=list)
    knowledge_sources: List[str] = Field(default_factory=list)
    data_sources: List[str] = Field(
        default_factory=list,
        description="Declared MCP tables this agent is authorized to query per TAD §7/§9.1",
    )
    limits: AgentLimits = Field(default_factory=AgentLimits)
    approval_policy: Dict[str, str] = Field(default_factory=dict)
    active_task_id: Optional[str] = None
    tasks_completed_24h: int = 0
    total_tokens_used: int = 0
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    updated_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


class Department(BaseModel):
    id: DepartmentId
    name: str
    description: str
    lead_agent_id: str
    agent_ids: List[str] = Field(default_factory=list)
    active_tasks_count: int = 0
    color: str = "#00d4aa"


class Task(BaseModel):
    id: str = Field(default_factory=lambda: f"task_{uuid4().hex[:8]}")
    title: str
    description: str = ""
    department: DepartmentId
    assigned_agent_id: str
    created_by: str = "system"
    status: TaskStatus = TaskStatus.PENDING
    priority: TaskPriority = TaskPriority.MEDIUM
    workflow_run_id: Optional[str] = None
    input_payload: Dict[str, Any] = Field(default_factory=dict)
    output_payload: Dict[str, Any] = Field(default_factory=dict)
    data_sources_queried: List[str] = Field(default_factory=list)
    error_message: Optional[str] = None
    trace_id: str = Field(default_factory=lambda: str(uuid4()))
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    updated_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    completed_at: Optional[str] = None


class TaskCreate(BaseModel):
    title: str
    description: str = ""
    department: DepartmentId
    assigned_agent_id: str
    priority: TaskPriority = TaskPriority.MEDIUM
    input_payload: Dict[str, Any] = Field(default_factory=dict)
    workflow_run_id: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    assigned_agent_id: Optional[str] = None
    output_payload: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None


class WorkflowStep(BaseModel):
    step_index: int
    name: str
    agent_id: str
    department: DepartmentId
    action: str
    requires_approval: bool = False
    status: TaskStatus = TaskStatus.PENDING


class Workflow(BaseModel):
    id: str
    name: str
    description: str
    trigger_event: str
    steps: List[WorkflowStep] = Field(default_factory=list)


class WorkflowRun(BaseModel):
    id: str = Field(default_factory=lambda: f"wfr_{uuid4().hex[:8]}")
    workflow_id: str
    workflow_name: str
    status: WorkflowStatus = WorkflowStatus.CREATED
    current_step_index: int = 0
    steps_total: int = 0
    steps_completed: int = 0
    context_data: Dict[str, Any] = Field(default_factory=dict)
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    updated_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


class Approval(BaseModel):
    id: str = Field(default_factory=lambda: f"appr_{uuid4().hex[:8]}")
    task_id: Optional[str] = None
    workflow_run_id: Optional[str] = None
    agent_id: str
    action_type: str
    reason: str
    summary: str
    status: ApprovalStatus = ApprovalStatus.PENDING
    requested_payload: Dict[str, Any] = Field(default_factory=dict)
    requested_by: str
    decided_by: Optional[str] = None
    decision_notes: Optional[str] = None
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    decided_at: Optional[str] = None
    expires_at: Optional[str] = None


class ApprovalDecision(BaseModel):
    approved: bool
    decided_by: str = "operations_user"
    notes: Optional[str] = None


class Alert(BaseModel):
    id: str = Field(default_factory=lambda: f"alt_{uuid4().hex[:8]}")
    rule_id: str
    title: str
    description: str
    severity: AlertSeverity = AlertSeverity.INFO
    category: AlertCategory = AlertCategory.SYSTEM
    department: Optional[DepartmentId] = None
    agent_id: Optional[str] = None
    status: AlertStatus = AlertStatus.ACTIVE
    metric_value: Optional[float] = None
    threshold_value: Optional[float] = None
    escalated_task_id: Optional[str] = None
    payload: Dict[str, Any] = Field(default_factory=dict)
    triggered_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    acknowledged_at: Optional[str] = None
    resolved_at: Optional[str] = None


class AlertCreate(BaseModel):
    rule_id: str
    title: str
    description: str
    severity: AlertSeverity = AlertSeverity.INFO
    category: AlertCategory = AlertCategory.SYSTEM
    department: Optional[DepartmentId] = None
    agent_id: Optional[str] = None
    metric_value: Optional[float] = None
    threshold_value: Optional[float] = None
    payload: Dict[str, Any] = Field(default_factory=dict)


class AuditEvent(BaseModel):
    id: str = Field(default_factory=lambda: f"aud_{uuid4().hex[:8]}")
    event_id: str
    event_type: str
    actor_type: str
    actor_id: str
    target_type: Optional[str] = None
    target_id: Optional[str] = None
    data_sources_queried: List[str] = Field(default_factory=list)
    query_hashes: List[str] = Field(default_factory=list)
    payload: Dict[str, Any] = Field(default_factory=dict)
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


class InsightCacheEntry(BaseModel):
    cache_key: str
    view: str
    entity: str
    date_range: str
    cached_response: Dict[str, Any]
    model_used: str
    tokens_used: int = 0
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    expires_at: str


class OfficeMetrics(BaseModel):
    """Business and operational metrics matching TAD v2.0 §29."""
    agents_active: int = 0
    tasks_in_progress: int = 0
    awaiting_approval: int = 0
    active_alerts: int = 0
    today_revenue: float = 0.0
    today_orders: int = 0
    meta_roas_7d: float = 0.0
    amazon_roas_7d: float = 0.0
    variant_stockouts: int = 0
    conversion_rate_7d: float = 0.0


class OfficeSnapshot(BaseModel):
    """Office Snapshot contract defined in TAD v2.0 §29."""
    office_status: str = "RUNNING"
    departments: List[Department] = Field(default_factory=list)
    agents: List[Agent] = Field(default_factory=list)
    active_tasks: List[Task] = Field(default_factory=list)
    active_connections: List[Dict[str, Any]] = Field(default_factory=list)
    approvals: List[Approval] = Field(default_factory=list)
    alerts: List[Alert] = Field(default_factory=list)
    metrics: OfficeMetrics = Field(default_factory=OfficeMetrics)
    snapshot_version: int = 1
