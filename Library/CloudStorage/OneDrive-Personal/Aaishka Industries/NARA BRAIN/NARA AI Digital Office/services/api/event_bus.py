"""NARA AI Digital Office — Async Event Bus & SSE Broker per TAD v2.0 §12 & §13.
"""

import asyncio
from collections import deque
from typing import AsyncGenerator, Callable, Dict, List, Optional
from packages.contracts.events import EventEnvelope


class EventBus:
    """In-memory event bus with pub/sub and SSE stream subscription support."""

    def __init__(self, history_size: int = 500):
        self._subscribers: List[asyncio.Queue] = []
        self._history: deque = deque(maxlen=history_size)
        self._handlers: Dict[str, List[Callable[[EventEnvelope], None]]] = {}

    def subscribe(self) -> asyncio.Queue:
        """Create a new subscriber queue."""
        q: asyncio.Queue = asyncio.Queue()
        self._subscribers.append(q)
        return q

    def unsubscribe(self, q: asyncio.Queue):
        """Remove a subscriber queue."""
        if q in self._subscribers:
            self._subscribers.remove(q)

    def register_handler(self, event_type: str, handler: Callable[[EventEnvelope], None]):
        """Register an internal callback for a specific event type."""
        if event_type not in self._handlers:
            self._handlers[event_type] = []
        self._handlers[event_type].append(handler)

    async def publish(self, event: EventEnvelope):
        """Publish an event to all subscribers and internal handlers."""
        self._history.append(event)

        # Trigger internal handlers
        handlers = self._handlers.get(event.event_type.value, []) + self._handlers.get("*", [])
        for handler in handlers:
            try:
                handler(event)
            except Exception as e:
                print(f"[EventBus] Handler error for {event.event_type}: {e}")

        # Dispatch to all subscriber queues
        dead_queues = []
        for q in self._subscribers:
            try:
                q.put_nowait(event)
            except asyncio.QueueFull:
                dead_queues.append(q)
            except Exception:
                dead_queues.append(q)

        for dead_q in dead_queues:
            self.unsubscribe(dead_q)

    def get_history(self, limit: int = 50) -> List[EventEnvelope]:
        """Get recent event history."""
        return list(self._history)[-limit:]

    async def event_generator(self, last_event_id: Optional[str] = None) -> AsyncGenerator[str, None]:
        """Yield formatted SSE events for streaming to browser clients."""
        q = self.subscribe()
        try:
            # Yield history if last_event_id provided or initial burst
            if last_event_id:
                found = False
                for evt in self._history:
                    if found:
                        yield f"id: {evt.event_id}\nevent: {evt.event_type.value}\ndata: {evt.model_dump_json()}\n\n"
                    elif evt.event_id == last_event_id:
                        found = True

            while True:
                try:
                    event: EventEnvelope = await asyncio.wait_for(q.get(), timeout=15.0)
                    yield f"id: {event.event_id}\nevent: {event.event_type.value}\ndata: {event.model_dump_json()}\n\n"
                except asyncio.TimeoutError:
                    # Keep-alive heartbeat ping comment
                    yield ": ping\n\n"
        finally:
            self.unsubscribe(q)
