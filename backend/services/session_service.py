import json
import redis
from config import get_settings

class SessionService:
    def __init__(self):
        settings = get_settings()
        self.redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)

    def store_session(self, call_sid: str, data: dict, expire: int = 3600):
        self.redis_client.setex(f"session:{call_sid}", expire, json.dumps(data))

    def get_session(self, call_sid: str) -> dict:
        data = self.redis_client.get(f"session:{call_sid}")
        if data:
            return json.loads(data)
        return None

    def delete_session(self, call_sid: str):
        self.redis_client.delete(f"session:{call_sid}")
