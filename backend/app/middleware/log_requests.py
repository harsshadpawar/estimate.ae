import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from app.utils.log_elasticsearch import trace_id_var, request_var, user_id_var,ip_var,country_var,city_var
from app.config.settings import get_settings
from app.utils.jwt_utils import decode_token
import requests


class APIKeyMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        api_key = request.headers.get("x-api-key")
        expected_api_key = get_settings().X_API_KEY

        if not api_key or api_key != expected_api_key:
            return JSONResponse(
                status_code=403,
                content={"detail": "Invalid or missing API key"}
            )

        response = await call_next(request)
        return response

class TraceIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        
        # add user id
        # user_id_var.set(None)
        
        # print("here in middleware")
        trace_id = str(uuid.uuid4())
        trace_id_var.set(trace_id)  
        request_var.set(request)
        request.state.trace_id = trace_id  
        
        token = request.headers.get("Authorization")
        # print("toke<<<<",token)
        if token and token.startswith("Bearer "):
            token = token.split(" ")[1]
            try:
                payload = decode_token(token)
                user_id = payload.get("sub")
                print("Trace user id",user_id)
                user_id_var.set(user_id)
                # request.state.user_id = user_id  
                # print("user >>>",user_id_var)
            except Exception as e:
                print("except >>>>",e)
                pass      
        
        # TODO fix 
        # Get country and city using ipapi.co
        # ip = request.client.host
        ip = request.headers.get("x-forwarded-for")
        ip_var.set(ip)
        # print("ip>>",ip)
        try:
            response = requests.get(f"https://ipapi.co/{ip}/json/", timeout=2)
            # print("response>>",response.content)
            if response.status_code == 200:
                data = response.json()
                country_var.set(data.get("country_name", "Unknown"))
                city_var.set(data.get("city", "Unknown"))
            else:
                country_var.set("Unknown")
                city_var.set("Unknown")
        except:
            country_var.set("Unknown")
            city_var.set("Unknown")
        
        response = await call_next(request)
        response.headers["X-Trace-ID"] = trace_id
        return response
