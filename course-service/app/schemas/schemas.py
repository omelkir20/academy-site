from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from decimal import Decimal


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    slug: str
    description: Optional[str] = None


class LessonOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    duration: int
    position: int
    is_preview: bool
    content: Optional[str] = None
    video_url: Optional[str] = None


class LessonCreate(BaseModel):
    title: str
    content: Optional[str] = None
    video_url: Optional[str] = None
    duration: int = 0
    is_preview: bool = False


class CourseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    slug: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    price: Decimal
    is_free: bool
    level: str
    instructor_id: str
    is_published: bool
    created_at: datetime
    category: Optional[CategoryOut] = None


class CourseDetail(CourseOut):
    lessons: list[LessonOut] = []
    enrollment_count: int = 0
    avg_rating: Optional[float] = None


class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    price: Decimal = Decimal("0.00")
    is_free: bool = True
    level: str = "beginner"
    category_id: Optional[int] = None


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    price: Optional[Decimal] = None
    is_free: Optional[bool] = None
    level: Optional[str] = None
    category_id: Optional[int] = None
    is_published: Optional[bool] = None


class EnrollmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: str
    course_id: int
    enrolled_at: datetime
    completed_at: Optional[datetime] = None


class ReviewCreate(BaseModel):
    rating: int
    comment: Optional[str] = None


class ReviewOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: str
    course_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime


class ProgressUpdate(BaseModel):
    completed: bool = True
