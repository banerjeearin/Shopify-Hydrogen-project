"""NARA AI Digital Office — Core Contracts & Enums.
Treat all definitions as strictly conforming to TAD v2.0 and BRD v2.1.
"""

from enum import Enum


class DepartmentId(str, Enum):
    EXECUTIVE = "executive"
    MARKETING = "marketing"
    TREND_DESIGN = "trend_design"
    SALES_ECOMMERCE = "sales_ecommerce"
    PRODUCT_INVENTORY = "product_inventory"
    SUPPLY_CHAIN = "supply_chain"
    CUSTOMER_SUPPORT = "customer_support"
    FINANCE_ACCOUNTING = "finance_accounting"


class AgentStatus(str, Enum):
    IDLE = "idle"
    ACTIVE = "active"
    BUSY = "busy"
    PAUSED = "paused"
    WAITING_APPROVAL = "waiting_approval"
    ERROR = "error"
    OFFLINE = "offline"


class TaskStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    WAITING_TOOL = "waiting_tool"
    WAITING_AGENT = "waiting_agent"
    WAITING_APPROVAL = "waiting_approval"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    RETRYING = "retrying"


class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class WorkflowStatus(str, Enum):
    CREATED = "created"
    QUEUED = "queued"
    RUNNING = "running"
    WAITING_APPROVAL = "waiting_approval"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class ApprovalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"


class AlertSeverity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    HIGH = "high"
    CRITICAL = "critical"


class AlertCategory(str, Enum):
    ROAS = "roas"
    STOCKOUT = "stockout"
    CONVERSION = "conversion"
    VENDOR = "vendor"
    SYSTEM = "system"


class AlertStatus(str, Enum):
    ACTIVE = "active"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"
    ESCALATED = "escalated"


class ActorType(str, Enum):
    AGENT = "AGENT"
    USER = "USER"
    SYSTEM = "SYSTEM"
    WEBHOOK = "WEBHOOK"


class EventType(str, Enum):
    # Workflow / Task lifecycle
    WORKFLOW_STARTED = "WORKFLOW_STARTED"
    WORKFLOW_COMPLETED = "WORKFLOW_COMPLETED"
    WORKFLOW_FAILED = "WORKFLOW_FAILED"
    TASK_CREATED = "TASK_CREATED"
    TASK_ASSIGNED = "TASK_ASSIGNED"
    TASK_UPDATED = "TASK_UPDATED"
    AGENT_STARTED = "AGENT_STARTED"
    AGENT_STATUS_CHANGED = "AGENT_STATUS_CHANGED"
    MODEL_CALL_COMPLETED = "MODEL_CALL_COMPLETED"
    TOOL_CALL_STARTED = "TOOL_CALL_STARTED"
    TOOL_CALL_COMPLETED = "TOOL_CALL_COMPLETED"
    TASK_HANDOFF = "TASK_HANDOFF"
    APPROVAL_REQUESTED = "APPROVAL_REQUESTED"
    APPROVAL_DECIDED = "APPROVAL_DECIDED"
    EXCEPTION_RAISED = "EXCEPTION_RAISED"
    TASK_COMPLETED = "TASK_COMPLETED"
    TASK_FAILED = "TASK_FAILED"

    # Data & Alerts
    ALERT_TRIGGERED = "ALERT_TRIGGERED"
    ALERT_ACKNOWLEDGED = "ALERT_ACKNOWLEDGED"
    ALERT_RESOLVED = "ALERT_RESOLVED"
    ALERT_ESCALATED = "ALERT_ESCALATED"
    MCP_QUERY_EXECUTED = "MCP_QUERY_EXECUTED"
    INSIGHT_CACHE_HIT = "INSIGHT_CACHE_HIT"
    INSIGHT_CACHE_MISS = "INSIGHT_CACHE_MISS"

    # Campaign Management
    CAMPAIGN_ACTION_PROPOSED = "CAMPAIGN_ACTION_PROPOSED"
    CAMPAIGN_ACTION_EXECUTED = "CAMPAIGN_ACTION_EXECUTED"

    # System & Office
    OFFICE_SNAPSHOT_UPDATED = "OFFICE_SNAPSHOT_UPDATED"


class ModelPolicy(str, Enum):
    FAST_LOW_COST = "fast_low_cost"
    BALANCED_REASONING = "balanced_reasoning"
    DEEP_REASONING = "deep_reasoning"
    STRUCTURED_EXTRACTOR = "structured_extractor"
