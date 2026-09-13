"""
Redis cache service for real-time data and session management.
"""

import json
from typing import Optional, Any, List
from datetime import datetime, timedelta
import redis
from app.config import get_settings
from app.utils.logging import get_logger


logger = get_logger(__name__)
settings = get_settings()


class CacheService:
    """Service for Redis cache operations."""
    
    def __init__(self):
        try:
            self.redis_client = redis.from_url(
                settings.redis_url,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_keepalive=True
            )
            # Test connection
            self.redis_client.ping()
            logger.info("cache_service_connected", redis_url=settings.redis_url)
        except Exception as e:
            logger.error("cache_connection_failed", error=str(e))
            self.redis_client = None
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        if not self.redis_client:
            return None
        
        try:
            value = self.redis_client.get(key)
            if value:
                try:
                    return json.loads(value)
                except:
                    return value
            return None
        except Exception as e:
            logger.error("cache_get_failed", key=key, error=str(e))
            return None
    
    async def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> bool:
        """Set value in cache with optional TTL."""
        if not self.redis_client:
            return False
        
        try:
            ttl = ttl_seconds or settings.redis_cache_ttl
            
            if isinstance(value, (dict, list)):
                value = json.dumps(value)
            
            self.redis_client.setex(key, ttl, value)
            return True
        except Exception as e:
            logger.error("cache_set_failed", key=key, error=str(e))
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete value from cache."""
        if not self.redis_client:
            return False
        
        try:
            self.redis_client.delete(key)
            return True
        except Exception as e:
            logger.error("cache_delete_failed", key=key, error=str(e))
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists in cache."""
        if not self.redis_client:
            return False
        
        try:
            return self.redis_client.exists(key) > 0
        except Exception as e:
            logger.error("cache_exists_failed", key=key, error=str(e))
            return False
    
    async def increment(self, key: str, amount: int = 1) -> int:
        """Increment counter in cache."""
        if not self.redis_client:
            return 0
        
        try:
            return self.redis_client.incrby(key, amount)
        except Exception as e:
            logger.error("cache_increment_failed", key=key, error=str(e))
            return 0
    
    async def append_list(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> int:
        """Append value to list in cache."""
        if not self.redis_client:
            return 0
        
        try:
            if isinstance(value, (dict, list)):
                value = json.dumps(value)
            
            result = self.redis_client.rpush(key, value)
            
            # Set TTL if specified
            if ttl_seconds:
                self.redis_client.expire(key, ttl_seconds)
            
            return result
        except Exception as e:
            logger.error("cache_append_list_failed", key=key, error=str(e))
            return 0
    
    async def get_list(self, key: str, start: int = 0, end: int = -1) -> List[Any]:
        """Get list from cache."""
        if not self.redis_client:
            return []
        
        try:
            values = self.redis_client.lrange(key, start, end)
            result = []
            for v in values:
                try:
                    result.append(json.loads(v))
                except:
                    result.append(v)
            return result
        except Exception as e:
            logger.error("cache_get_list_failed", key=key, error=str(e))
            return []
    
    async def set_hash(self, key: str, data: dict, ttl_seconds: Optional[int] = None) -> bool:
        """Set hash in cache."""
        if not self.redis_client:
            return False
        
        try:
            # Convert nested dicts to JSON strings
            hash_data = {}
            for k, v in data.items():
                if isinstance(v, (dict, list)):
                    hash_data[k] = json.dumps(v)
                else:
                    hash_data[k] = str(v)
            
            self.redis_client.hset(key, mapping=hash_data)
            
            if ttl_seconds:
                self.redis_client.expire(key, ttl_seconds)
            
            return True
        except Exception as e:
            logger.error("cache_set_hash_failed", key=key, error=str(e))
            return False
    
    async def get_hash(self, key: str) -> dict:
        """Get hash from cache."""
        if not self.redis_client:
            return {}
        
        try:
            data = self.redis_client.hgetall(key)
            result = {}
            for k, v in data.items():
                try:
                    result[k] = json.loads(v)
                except:
                    result[k] = v
            return result
        except Exception as e:
            logger.error("cache_get_hash_failed", key=key, error=str(e))
            return {}
    
    async def invalidate_pattern(self, pattern: str) -> int:
        """Invalidate all keys matching pattern."""
        if not self.redis_client:
            return 0
        
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                return self.redis_client.delete(*keys)
            return 0
        except Exception as e:
            logger.error("cache_invalidate_pattern_failed", pattern=pattern, error=str(e))
            return 0


class RealTimeCallCache:
    """Cache for real-time call data."""
    
    PREFIX = "call:"
    
    def __init__(self, cache_service: CacheService):
        self.cache = cache_service
    
    async def store_call_context(self, call_id: str, context: dict) -> bool:
        """Store call context during active call."""
        key = f"{self.PREFIX}{call_id}:context"
        return await self.cache.set(key, context, ttl_seconds=3600)  # 1 hour
    
    async def get_call_context(self, call_id: str) -> Optional[dict]:
        """Get call context."""
        key = f"{self.PREFIX}{call_id}:context"
        return await self.cache.get(key)
    
    async def store_transcript(self, call_id: str, segment: dict) -> bool:
        """Append transcript segment."""
        key = f"{self.PREFIX}{call_id}:transcript"
        await self.cache.append_list(key, segment, ttl_seconds=3600)
        return True
    
    async def get_transcript(self, call_id: str) -> List[dict]:
        """Get full transcript for call."""
        key = f"{self.PREFIX}{call_id}:transcript"
        return await self.cache.get_list(key)
    
    async def store_sentiment_history(self, call_id: str, sentiment: dict) -> bool:
        """Append sentiment analysis."""
        key = f"{self.PREFIX}{call_id}:sentiments"
        await self.cache.append_list(key, sentiment, ttl_seconds=3600)
        return True
    
    async def get_sentiment_history(self, call_id: str) -> List[dict]:
        """Get sentiment trend for call."""
        key = f"{self.PREFIX}{call_id}:sentiments"
        return await self.cache.get_list(key)
    
    async def clear_call(self, call_id: str) -> bool:
        """Clear all data for a call."""
        pattern = f"{self.PREFIX}{call_id}:*"
        await self.cache.invalidate_pattern(pattern)
        return True


class AgentStatusCache:
    """Cache for agent status and metrics."""
    
    PREFIX = "agent:"
    
    def __init__(self, cache_service: CacheService):
        self.cache = cache_service
    
    async def set_agent_status(self, agent_id: str, status: dict) -> bool:
        """Set agent current status."""
        key = f"{self.PREFIX}{agent_id}:status"
        return await self.cache.set(key, status, ttl_seconds=3600)
    
    async def get_agent_status(self, agent_id: str) -> Optional[dict]:
        """Get agent status."""
        key = f"{self.PREFIX}{agent_id}:status"
        return await self.cache.get(key)
    
    async def increment_agent_calls(self, agent_id: str) -> int:
        """Increment call count for agent today."""
        key = f"{self.PREFIX}{agent_id}:calls_today"
        return await self.cache.increment(key, 1)
    
    async def store_shift_metrics(self, agent_id: str, metrics: dict) -> bool:
        """Store current shift metrics."""
        key = f"{self.PREFIX}{agent_id}:shift_metrics"
        return await self.cache.set(key, metrics, ttl_seconds=3600)
    
    async def get_shift_metrics(self, agent_id: str) -> Optional[dict]:
        """Get current shift metrics."""
        key = f"{self.PREFIX}{agent_id}:shift_metrics"
        return await self.cache.get(key)


class TeamStatusCache:
    """Cache for team-wide status and burnout alerts."""
    
    PREFIX = "team:"
    
    def __init__(self, cache_service: CacheService):
        self.cache = cache_service
    
    async def store_team_status(self, team_id: str, status: dict) -> bool:
        """Store team status snapshot."""
        key = f"{self.PREFIX}{team_id}:status"
        return await self.cache.set(key, status, ttl_seconds=300)  # 5 min
    
    async def get_team_status(self, team_id: str) -> Optional[dict]:
        """Get team status."""
        key = f"{self.PREFIX}{team_id}:status"
        return await self.cache.get(key)
    
    async def store_burnout_alert(self, team_id: str, alert: dict) -> bool:
        """Store burnout alert for team."""
        key = f"{self.PREFIX}{team_id}:burnout_alerts"
        await self.cache.append_list(key, alert, ttl_seconds=3600)
        return True
    
    async def get_burnout_alerts(self, team_id: str) -> List[dict]:
        """Get recent burnout alerts."""
        key = f"{self.PREFIX}{team_id}:burnout_alerts"
        return await self.cache.get_list(key, start=-10)  # Last 10


# Singleton instances
_cache_service: Optional[CacheService] = None
_call_cache: Optional[RealTimeCallCache] = None
_agent_cache: Optional[AgentStatusCache] = None
_team_cache: Optional[TeamStatusCache] = None


def get_cache_service() -> CacheService:
    """Get or create cache service."""
    global _cache_service
    if _cache_service is None:
        _cache_service = CacheService()
    return _cache_service


def get_call_cache() -> RealTimeCallCache:
    """Get call cache instance."""
    global _call_cache
    if _call_cache is None:
        _call_cache = RealTimeCallCache(get_cache_service())
    return _call_cache


def get_agent_cache() -> AgentStatusCache:
    """Get agent cache instance."""
    global _agent_cache
    if _agent_cache is None:
        _agent_cache = AgentStatusCache(get_cache_service())
    return _agent_cache


def get_team_cache() -> TeamStatusCache:
    """Get team cache instance."""
    global _team_cache
    if _team_cache is None:
        _team_cache = TeamStatusCache(get_cache_service())
    return _team_cache
