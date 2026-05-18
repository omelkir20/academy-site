from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from sqlalchemy.orm import selectinload
from typing import Optional
from slugify import slugify

from ....db.database import get_db
from ....models.models import Course, Lesson, Enrollment, Review, LessonProgress
from ....schemas.schemas import (
    CourseOut, CourseDetail, CourseCreate, EnrollmentOut,
    ReviewCreate, ReviewOut, ProgressUpdate, LessonOut
)
from ....core.security import verify_token, optional_token

router = APIRouter()


@router.get("/", response_model=list[CourseOut])
async def list_courses(
    search: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    level: Optional[str] = Query(None),
    is_free: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user: Optional[dict] = Depends(optional_token),
):
    stmt = (
        select(Course)
        .options(selectinload(Course.category))
        .where(Course.is_published == True)
        .order_by(desc(Course.created_at))
        .offset((page - 1) * limit)
        .limit(limit)
    )
    if search:
        stmt = stmt.where(Course.title.ilike(f"%{search}%"))
    if category_id:
        stmt = stmt.where(Course.category_id == category_id)
    if level:
        stmt = stmt.where(Course.level == level)
    if is_free is not None:
        stmt = stmt.where(Course.is_free == is_free)

    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
async def create_course(
    payload: CourseCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token),
):
    course = Course(
        title=payload.title,
        slug=slugify(payload.title),
        description=payload.description,
        price=payload.price,
        is_free=payload.is_free,
        level=payload.level,
        category_id=payload.category_id,
        instructor_id=user.get("sub", "unknown"),
    )
    db.add(course)
    await db.commit()
    await db.refresh(course)
    return course


@router.get("/{course_id}", response_model=CourseDetail)
async def get_course(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    user: Optional[dict] = Depends(optional_token),
):
    stmt = (
        select(Course)
        .options(
            selectinload(Course.category),
            selectinload(Course.lessons),
            selectinload(Course.enrollments),
            selectinload(Course.reviews),
        )
        .where(Course.id == course_id, Course.is_published == True)
    )
    result = await db.execute(stmt)
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Cours introuvable")

    enrollment_count = len(course.enrollments)
    ratings = [r.rating for r in course.reviews if r.rating]
    avg_rating = sum(ratings) / len(ratings) if ratings else None

    is_enrolled = False
    if user:
        is_enrolled = any(e.user_id == user.get("sub") for e in course.enrollments)

    lessons = [
        l for l in sorted(course.lessons, key=lambda x: x.position)
        if l.is_preview or is_enrolled
    ]

    return CourseDetail(
        **CourseOut.model_validate(course).model_dump(),
        lessons=lessons,
        enrollment_count=enrollment_count,
        avg_rating=avg_rating,
    )


@router.post("/{course_id}/enroll", response_model=EnrollmentOut, status_code=status.HTTP_201_CREATED)
async def enroll(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token),
):
    existing = await db.execute(
        select(Enrollment).where(
            Enrollment.user_id == user["sub"],
            Enrollment.course_id == course_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Déjà inscrit")

    enrollment = Enrollment(user_id=user["sub"], course_id=course_id)
    db.add(enrollment)
    await db.commit()
    await db.refresh(enrollment)
    return enrollment


@router.post("/{course_id}/lessons/{lesson_id}/progress", status_code=status.HTTP_200_OK)
async def update_progress(
    course_id: int,
    lesson_id: int,
    payload: ProgressUpdate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token),
):
    from datetime import datetime, timezone
    stmt = select(LessonProgress).where(
        LessonProgress.user_id == user["sub"],
        LessonProgress.lesson_id == lesson_id,
    )
    result = await db.execute(stmt)
    progress = result.scalar_one_or_none()
    if progress:
        progress.completed = payload.completed
        progress.completed_at = datetime.now(timezone.utc) if payload.completed else None
    else:
        progress = LessonProgress(
            user_id=user["sub"],
            lesson_id=lesson_id,
            completed=payload.completed,
            completed_at=datetime.now(timezone.utc) if payload.completed else None,
        )
        db.add(progress)
    await db.commit()
    return {"message": "Progression mise à jour"}


@router.post("/{course_id}/reviews", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
async def add_review(
    course_id: int,
    payload: ReviewCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token),
):
    review = Review(
        user_id=user["sub"],
        course_id=course_id,
        rating=payload.rating,
        comment=payload.comment,
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review
