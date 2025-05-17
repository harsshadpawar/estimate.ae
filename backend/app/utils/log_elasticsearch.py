import logging
from elasticsearch import Elasticsearch
from datetime import datetime
import contextvars
import time
from app.config.settings import get_settings

# Load settings
settings = get_settings()
ELASTIC_URL = settings.ELASTIC_URL
ELASTIC_USER = settings.ELASTIC_USER
ELASTIC_PASSWORD = settings.ELASTIC_PASSWORD

# Context variables
trace_id_var = contextvars.ContextVar("trace_id", default=None)
request_var = contextvars.ContextVar("request")
user_id_var = contextvars.ContextVar("user_id", default=None)
ip_var = contextvars.ContextVar("ip", default=None)
country_var = contextvars.ContextVar("country", default=None)
city_var = contextvars.ContextVar("city", default=None)


def create_es_client(retries=5, delay=15):
    for i in range(retries):
        try:
            es = Elasticsearch(
                ELASTIC_URL,
                headers={"Content-Type": "application/json", "Accept": "application/json"},
                basic_auth=(ELASTIC_USER, ELASTIC_PASSWORD),
                verify_certs=True
            )
            
            if es.ping():
                return es
        except Exception as e:
            print(f"[Retry {i+1}] Elasticsearch not ready. Retrying in {delay}s...")
            time.sleep(delay)
    raise Exception("Elasticsearch is not reachable after retries.")


class ElasticsearchLogHandler(logging.Handler):
    def __init__(self, es_client):
        super().__init__()
        self.es = es_client

    def emit(self, record):
        doc = {
            "timestamp": datetime.utcnow(),
            "log_level": record.levelname,
            "message": record.getMessage(),
            "service": "fastapi-service",
            "trace_id": trace_id_var.get(),
            "user_id": user_id_var.get(),
            "ip": ip_var.get(),
            "country": country_var.get(),
            "city": city_var.get(),
            "path": getattr(record, "path", None),
            "method": getattr(record, "method", None)
        }
        try:
            self.es.index(index="fastapi-logs", document=doc)
        except Exception as e:
            print("Failed to send log to Elasticsearch:", e)


class RequestContextFilter(logging.Filter):
    def filter(self, record):
        try:
            request = request_var.get()
            record.path = request.url.path
            record.method = request.method
        except LookupError:
            record.path = None
            record.method = None

        record.trace_id = trace_id_var.get()
        record.user_id = user_id_var.get()
        record.ip = ip_var.get()
        record.country = country_var.get()
        record.city = city_var.get()
        return True


def setup_logger():
    logger = logging.getLogger("fastapi_logger")
    logger.setLevel(logging.DEBUG)
    logger.addFilter(RequestContextFilter())
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

    if settings.ENABLE_ELASTIC_LOGGING:
        print("Elasticsearch logging enabled.")
        try:
            es = create_es_client()
            es_handler = ElasticsearchLogHandler(es)
            es_handler.setFormatter(formatter)
            logger.addHandler(es_handler)
        except Exception as e:
            print("Elasticsearch not reachable. Falling back to console logging.")
            stream_handler = logging.StreamHandler()
            stream_handler.setFormatter(formatter)
            logger.addHandler(stream_handler)
    else:
        print("Standard logging enabled.")
        stream_handler = logging.StreamHandler()
        stream_handler.setFormatter(formatter)
        logger.addHandler(stream_handler)

    return logger
