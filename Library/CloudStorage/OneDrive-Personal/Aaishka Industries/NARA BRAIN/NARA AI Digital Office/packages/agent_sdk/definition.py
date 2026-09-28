"""NARA AI Digital Office — Declarative Agent Definition and Parser per TAD v2.0 §7.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from packages.contracts.enums import DepartmentId, ModelPolicy, AgentStatus
from packages.contracts.models import Agent, AgentLimits


class AgentDefinition(BaseModel):
    id: str
    name: str
    department: DepartmentId
    purpose: str
    role: str = ""
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

    def to_agent_model(self, status: AgentStatus = AgentStatus.IDLE) -> Agent:
        return Agent(
            id=self.id,
            name=self.name,
            department=self.department,
            purpose=self.purpose,
            role=self.role,
            status=status,
            model_policy=self.model_policy,
            capabilities=self.capabilities,
            tools=self.tools,
            knowledge_sources=self.knowledge_sources,
            data_sources=self.data_sources,
            limits=self.limits,
            approval_policy=self.approval_policy,
        )
