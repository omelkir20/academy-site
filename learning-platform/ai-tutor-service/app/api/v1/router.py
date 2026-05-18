from fastapi import APIRouter
from .endpoints.tutor import router as tutor_router

api_router = APIRouter()
api_router.include_router(tutor_router, prefix="/ai-tutor", tags=["AI Tutor"])
