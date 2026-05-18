from pydantic import BaseModel, ConfigDict
from typing import Optional, Any
from datetime import datetime


class PageViewCreate(BaseModel):
    user_id: Optional[str] = None
    course_id: Optional[int] = None
    path: str


class EventCreate(BaseModel):
    user_id: Optional[str] = None
    event_type: str
    payload: Optional[dict[str, Any]] = None


class FeedbackCreate(BaseModel):
    user_id: Optional[str] = None
    course_id: Optional[int] = None
    lesson_id: Optional[int] = None
    content: str


class FeedbackOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: Optional[str]
    course_id: Optional[int]
    lesson_id: Optional[int]
    content: str
    sentiment: Optional[str]
    ai_summary: Optional[str]
    processed: bool
    created_at: datetime


class DashboardStats(BaseModel):
    total_views: int
    total_events: int
    total_feedbacks: int
    recent_events: list[dict]
    enrollments_by_course: list[dict]
    views_last_7_days: list[dict]
