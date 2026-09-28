"""NARA AI Digital Office — Control Plane API Server per TAD v2.0 §27 & §28.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from packages.agent_sdk.registry import AgentRegistry
from packages.tool_sdk.cache import InsightCacheService
from packages.tool_sdk.gateway import ToolGateway
from .storage import DigitalOfficeStorage
from .event_bus import EventBus
from .routes import create_api_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="NARA AI Digital Office — Control Plane API",
        description="Event-driven multi-agent platform control plane conforming to TAD v2.0 and BRD v2.1.",
        version="2.0.0",
    )

    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Instantiate core subsystems
    registry = AgentRegistry()
    storage = DigitalOfficeStorage(agent_registry=registry)
    event_bus = EventBus()
    cache_service = InsightCacheService()
    tool_gateway = ToolGateway(
        agent_registry=registry,
        cache_service=cache_service,
    )

    # Mount API router
    api_router = create_api_router(
        storage=storage,
        registry=registry,
        event_bus=event_bus,
        tool_gateway=tool_gateway,
        cache_service=cache_service,
    )
    app.include_router(api_router)

    # Attach core services to app state for testing and extension
    app.state.registry = registry
    app.state.storage = storage
    app.state.event_bus = event_bus
    app.state.cache_service = cache_service
    app.state.tool_gateway = tool_gateway

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("services.api.main:app", host="0.0.0.0", port=8000, reload=True)
