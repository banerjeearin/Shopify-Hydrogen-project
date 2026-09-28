"""NARA AI Digital Office — Insight Cache Service per TAD v2.0 §6.12 and §16.4.
Provides cache-aside for expensive LLM analytical queries.
"""

import hashlib
import json
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field

from packages.contracts.models import InsightCacheEntry


class CacheMetrics(BaseModel):
    hits: int = 0
    misses: int = 0
    writes: int = 0
    evictions: int = 0

    @property
    def hit_rate(self) -> float:
        total = self.hits + self.misses
        return (self.hits / total) if total > 0 else 0.0


class InsightCacheService:
    """In-memory and backed Insight Cache service."""

    def __init__(self, default_ttl_seconds: int = 3600):
        self.default_ttl_seconds = default_ttl_seconds
        self._cache: Dict[str, InsightCacheEntry] = {}
        self.metrics = CacheMetrics()

    @staticmethod
    def generate_cache_key(view: str, entity: str, date_range: str, params: Optional[Dict[str, Any]] = None) -> str:
        """Generate deterministic cache key based on query parameters."""
        raw_key = f"{view.strip().lower()}:{entity.strip().lower()}:{date_range.strip().lower()}"
        if params:
            serialized_params = json.dumps(params, sort_keys=True)
            raw_key += f":{serialized_params}"
        hash_digest = hashlib.sha256(raw_key.encode("utf-8")).hexdigest()[:16]
        return f"insight:{view}:{entity}:{hash_digest}"

    def get(self, cache_key: str) -> Optional[InsightCacheEntry]:
        """Retrieve cached insight entry if valid and not expired."""
        now = datetime.now(timezone.utc)
        entry = self._cache.get(cache_key)

        if not entry:
            self.metrics.misses += 1
            return None

        # Check expiry
        expires_at_dt = datetime.fromisoformat(entry.expires_at)
        if now > expires_at_dt:
            # Expired
            del self._cache[cache_key]
            self.metrics.evictions += 1
            self.metrics.misses += 1
            return None

        self.metrics.hits += 1
        return entry

    def set(
        self,
        view: str,
        entity: str,
        date_range: str,
        cached_response: Dict[str, Any],
        model_used: str,
        tokens_used: int = 0,
        ttl_seconds: Optional[int] = None,
        params: Optional[Dict[str, Any]] = None,
    ) -> InsightCacheEntry:
        """Store insight response with TTL."""
        cache_key = self.generate_cache_key(view, entity, date_range, params)
        ttl = ttl_seconds if ttl_seconds is not None else self.default_ttl_seconds
        now = datetime.now(timezone.utc)
        expires_at = (now + timedelta(seconds=ttl)).isoformat()

        entry = InsightCacheEntry(
            cache_key=cache_key,
            view=view,
            entity=entity,
            date_range=date_range,
            cached_response=cached_response,
            model_used=model_used,
            tokens_used=tokens_used,
            created_at=now.isoformat(),
            expires_at=expires_at,
        )

        self._cache[cache_key] = entry
        self.metrics.writes += 1
        return entry

    def invalidate(self, cache_key: str) -> bool:
        if cache_key in self._cache:
            del self._cache[cache_key]
            self.metrics.evictions += 1
            return True
        return False

    def clear(self):
        self._cache.clear()
