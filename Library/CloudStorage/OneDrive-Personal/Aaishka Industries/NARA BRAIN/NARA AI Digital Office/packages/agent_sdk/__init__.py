"""NARA AI Digital Office — Agent SDK Package.
"""

from .definition import AgentDefinition
from .registry import AgentRegistry, DEFAULT_DEPARTMENTS, DEFAULT_AGENT_DEFINITIONS

__all__ = [
    "AgentDefinition",
    "AgentRegistry",
    "DEFAULT_DEPARTMENTS",
    "DEFAULT_AGENT_DEFINITIONS",
]
