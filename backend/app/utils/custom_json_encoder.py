from flask.json.provider import DefaultJSONProvider
import uuid

class CustomJSONProvider(DefaultJSONProvider):
    def default(self, obj):
        if isinstance(obj, uuid.UUID):
            return str(obj)  # Convert UUID to string
        return super().default(obj)

