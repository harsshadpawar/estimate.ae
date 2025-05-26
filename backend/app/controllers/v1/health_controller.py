from fastapi import APIRouter
from app.services.health_service import HealthCheckService

router = APIRouter()

@router.get("/check")
async def health_check():
    health_status = HealthCheckService.health_check()
    return health_status