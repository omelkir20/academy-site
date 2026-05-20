from fastapi import APIRouter
from .endpoints.analytics import router as analytics_router

api_router = APIRouter()
api_router.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
