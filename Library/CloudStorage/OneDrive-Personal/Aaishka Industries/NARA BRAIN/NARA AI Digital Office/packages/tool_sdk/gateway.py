"""NARA AI Digital Office — Tool Gateway per TAD v2.0 §9 / §9.1 / §9.2.
Coordinates tool invocations, enforces MCP table-level ACL, records audit lineage, and integrates Insight Cache.
"""

import time
import hashlib
from typing import Any, Callable, Dict, List, Optional
from pydantic import BaseModel

from packages.contracts.enums import EventType, ActorType
from packages.contracts.events import EventEnvelope, EventActor, McpQueryEventPayload
from packages.agent_sdk.registry import AgentRegistry
from .acl import McpTableAclValidator, AclValidationResult
from .cache import InsightCacheService


class ToolInvocationRequest(BaseModel):
    agent_id: str
    tool_name: str
    arguments: Dict[str, Any]
    workflow_run_id: Optional[str] = None
    task_id: Optional[str] = None


class ToolInvocationResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
    tables_accessed: List[str] = []
    latency_ms: float = 0.0
    cache_hit: bool = False
    audit_event: Optional[EventEnvelope] = None


class ToolGateway:
    """Enterprise Tool and MCP Gateway enforcing data source policies."""

    def __init__(
        self,
        agent_registry: AgentRegistry,
        cache_service: Optional[InsightCacheService] = None,
        event_sink: Optional[Callable[[EventEnvelope], None]] = None,
    ):
        self.agent_registry = agent_registry
        self.cache = cache_service or InsightCacheService()
        self.event_sink = event_sink
        self._native_tools: Dict[str, Callable[[Dict[str, Any]], Any]] = {}

    def register_native_tool(self, name: str, handler: Callable[[Dict[str, Any]], Any]):
        self._native_tools[name] = handler

    async def execute_tool(
        self,
        request: ToolInvocationRequest,
        mcp_query_executor: Optional[Callable[[str], Any]] = None,
    ) -> ToolInvocationResponse:
        start_time = time.perf_counter()

        # 1. Authorize agent
        agent = self.agent_registry.get_agent(request.agent_id)
        if not agent:
            return ToolInvocationResponse(
                success=False,
                error=f"Agent '{request.agent_id}' not found in registry.",
            )

        # 2. Check tool permission
        if request.tool_name not in agent.tools and not request.tool_name.startswith("narawear_mcp."):
            return ToolInvocationResponse(
                success=False,
                error=f"Agent '{request.agent_id}' is not authorized to invoke tool '{request.tool_name}'.",
            )

        # 3. Handle MCP SQL Query Tool
        if request.tool_name in ["narawear_mcp.query", "query"]:
            sql = request.arguments.get("sql", "")
            allow_cache_write = "insight_cache_write" in agent.capabilities

            # Validate table-level ACL
            acl_result: AclValidationResult = McpTableAclValidator.validate_query(
                sql=sql,
                declared_data_sources=agent.data_sources,
                allow_insight_cache_write=allow_cache_write,
            )

            if not acl_result.is_valid:
                latency_ms = (time.perf_counter() - start_time) * 1000.0
                return ToolInvocationResponse(
                    success=False,
                    error=f"MCP ACL Violation: {acl_result.rejection_reason}",
                    tables_accessed=acl_result.tables_found,
                    latency_ms=latency_ms,
                )

            # Query hash for audit
            query_hash = hashlib.sha256(sql.encode("utf-8")).hexdigest()[:16]

            # Execute query via executor callback or simulated data
            row_count = 0
            query_result = None
            try:
                if mcp_query_executor:
                    query_result = await mcp_query_executor(sql) if callable(mcp_query_executor) else mcp_query_executor(sql)
                    if isinstance(query_result, list):
                        row_count = len(query_result)
                    elif isinstance(query_result, dict):
                        row_count = 1
                else:
                    # Mock / placeholder result for testing
                    query_result = {"status": "ok", "tables": acl_result.tables_found, "query_hash": query_hash}
                    row_count = 1
            except Exception as ex:
                latency_ms = (time.perf_counter() - start_time) * 1000.0
                return ToolInvocationResponse(
                    success=False,
                    error=f"MCP Query Execution Failed: {str(ex)}",
                    tables_accessed=acl_result.tables_found,
                    latency_ms=latency_ms,
                )

            latency_ms = (time.perf_counter() - start_time) * 1000.0

            # 4. Generate MCP_QUERY_EXECUTED event for data lineage per TAD §9.2
            event_payload = McpQueryEventPayload(
                agent_id=request.agent_id,
                tables_accessed=acl_result.tables_found,
                query_hash=query_hash,
                row_count=row_count,
                latency_ms=latency_ms,
                cache_hit=False,
                data_source_acl_passed=True,
            )

            event = EventEnvelope(
                event_type=EventType.MCP_QUERY_EXECUTED,
                workflow_run_id=request.workflow_run_id,
                task_id=request.task_id,
                actor=EventActor(type=ActorType.AGENT, id=request.agent_id),
                payload=event_payload.model_dump(),
            )

            if self.event_sink:
                self.event_sink(event)

            return ToolInvocationResponse(
                success=True,
                data=query_result,
                tables_accessed=acl_result.tables_found,
                latency_ms=latency_ms,
                audit_event=event,
            )

        # 5. Handle native tools
        if request.tool_name in self._native_tools:
            handler = self._native_tools[request.tool_name]
            try:
                res = handler(request.arguments)
                latency_ms = (time.perf_counter() - start_time) * 1000.0
                return ToolInvocationResponse(
                    success=True,
                    data=res,
                    latency_ms=latency_ms,
                )
            except Exception as e:
                latency_ms = (time.perf_counter() - start_time) * 1000.0
                return ToolInvocationResponse(
                    success=False,
                    error=str(e),
                    latency_ms=latency_ms,
                )

        return ToolInvocationResponse(
            success=False,
            error=f"Tool '{request.tool_name}' has no registered execution handler.",
        )
