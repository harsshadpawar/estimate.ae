import uuid
import contextvars
from fastapi import Request

# Create a context variable to hold the trace ID
trace_id_var = contextvars.ContextVar("trace_id", default=None)

def set_trace_id(request: Request):
    """
    Extracts or generates a trace ID and stores it in the context variable.
    """
    trace_id = request.headers.get("X-Trace-Id") or str(uuid.uuid4())
    trace_id_var.set(trace_id)

def get_trace_id() -> str:
    """
    Retrieves the current trace ID from the context variable.
    """
    return trace_id_var.get()
