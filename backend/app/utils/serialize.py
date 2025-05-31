from datetime import datetime, date
def serialize_value(value):
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, dict):
        return value  # JSON already
    return value
