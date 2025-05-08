
import logging
from elasticsearch import Elasticsearch
from datetime import datetime
import contextvars

trace_id_var = contextvars.ContextVar("trace_id", default=None)
request_var = contextvars.ContextVar("request")
user_id_var = contextvars.ContextVar("user_id", default=None)
ip_var = contextvars.ContextVar("ip", default=None)
country_var = contextvars.ContextVar("country", default=None)
city_var = contextvars.ContextVar("city", default=None)

es = Elasticsearch("http://localhost:9200", headers={"Content-Type": "application/json", "Accept": "application/json"}, basic_auth=("elastic", "cqyzNo3fLfhkhKXzatBU"),  
    verify_certs=True) 

class ElasticsearchLogHandler(logging.Handler):
    def emit(self, record):
        log_entry = self.format(record)
        trace_id = trace_id_var.get()
        user_id = user_id_var.get()
        ip = ip_var.get()
        country = country_var.get()
        city = city_var.get()
        
        doc = {
            "timestamp": datetime.utcnow(),
            "log_level": record.levelname,
            "message": record.getMessage(),
            "service": "fastapi-service",
            "trace_id": trace_id,
            "user_id": user_id,
            "ip": ip,
            "country": country,
            "city": city,
            "path": getattr(record, "path", None),
            "method": getattr(record, "method", None)
        }
        es.index(index="fastapi-logs", document=doc)

def setup_logger():
    logger = logging.getLogger("fastapi_logger")
    # logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
    logger.setLevel(logging.DEBUG)
    # logger.setLevel(logging.ERROR)
    es_handler = ElasticsearchLogHandler()
    formatter = logging.Formatter('%(message)s')
    es_handler.setFormatter(formatter)

    logger.addHandler(es_handler)
    logger.addFilter(RequestContextFilter())
    return logger

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