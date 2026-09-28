"""NARA AI Digital Office — Canonical Event Schema per TAD v2.0 §12.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4
from pydantic import BaseModel, Field

from .enums import ActorType, EventType


class EventActor(BaseModel):
    type: ActorType = ActorType.SYSTEM
    id: str = "system"


class EventEnvelope(BaseModel):
    """Canonical event envelope defined in TAD v2.0 §12."""
    event_id: str = Field(default_factory=lambda: str(uuid4()))
    event_type: EventType
    schema_version: int = 1
    occurred_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    correlation_id: str = Field(default_factory=lambda: str(uuid4()))
    organization_id: str = "org_nara"
    workflow_run_id: Optional[str] = None
    task_id: Optional[str] = None
    actor: EventActor = Field(default_factory=EventActor)
    payload: Dict[str, Any] = Field(default_factory=dict)


class DataLineage(BaseModel):
    """Data lineage tracking for MCP queries & decisions per TAD §7.2 / §11."""
    data_sources_queried: List[str] = Field(default_factory=list)
    query_hashes: List[str] = Field(default_factory=list)
    row_counts: List[int] = Field(default_factory=list)
    cache_hit: bool = False
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


class McpQueryEventPayload(BaseModel):
    """Payload for MCP_QUERY_EXECUTED events per TAD §9.2."""
    agent_id: str
    tables_accessed: List[str]
    query_hash: str
    row_count: int
    latency_ms: float
    cache_hit: bool
    data_source_acl_passed: bool = True
