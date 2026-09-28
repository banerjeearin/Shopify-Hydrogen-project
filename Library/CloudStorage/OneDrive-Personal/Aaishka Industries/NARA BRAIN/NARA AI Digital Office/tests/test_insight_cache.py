"""Unit tests for Insight Cache Service per TAD v2.0 §6.12 & §16.4.
"""

import time
from packages.tool_sdk.cache import InsightCacheService


def test_insight_cache_set_and_get():
    cache = InsightCacheService(default_ttl_seconds=3600)
    
    # Store response
    entry = cache.set(
        view="roas_analysis",
        entity="campaign_spring_promo",
        date_range="last_7_days",
        cached_response={"roas": 3.4, "recommendation": "Scale budget by 15%"},
        model_used="claude-3-5-sonnet",
        tokens_used=420,
    )
    assert entry.cache_key is not None
    assert cache.metrics.writes == 1

    # Retrieve from cache (Hit)
    fetched = cache.get(entry.cache_key)
    assert fetched is not None
    assert fetched.cached_response["roas"] == 3.4
    assert cache.metrics.hits == 1

    # Miss check
    miss = cache.get("non_existent_key")
    assert miss is None
    assert cache.metrics.misses == 1


def test_insight_cache_ttl_expiry():
    cache = InsightCacheService(default_ttl_seconds=1)
    
    entry = cache.set(
        view="variant_stockout_prediction",
        entity="sku_ivy_xs",
        date_range="next_14_days",
        cached_response={"predicted_stockout_days": 2},
        model_used="gpt-4o",
        ttl_seconds=1,
    )

    # Immediately fetch -> Hit
    assert cache.get(entry.cache_key) is not None

    # Wait for TTL expiry
    time.sleep(1.2)

    # Fetch after expiry -> Miss & Evicted
    expired = cache.get(entry.cache_key)
    assert expired is None
    assert cache.metrics.evictions == 1
