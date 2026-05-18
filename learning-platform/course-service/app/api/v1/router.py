from fastapi import APIRouter
from .endpoints import courses, categories

api_router = APIRouter()
api_router.include_router(courses.router, prefix="/courses", tags=["Courses"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
