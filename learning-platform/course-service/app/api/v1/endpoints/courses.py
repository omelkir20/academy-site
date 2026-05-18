from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from sqlalchemy.orm import selectinload
from typing import Optional
from datetime import datetime, timezone
from slugify import slugify

from ....db.database import get_db
from ....models.models import Course, Lesson, Enrollment, Review, LessonProgress
from ....schemas.schemas import (
    CourseOut, CourseDetail, CourseCreate, CourseUpdate,
    EnrollmentOut, ReviewCreate, ReviewOut, ProgressUpdate, LessonCreate, LessonOut
)
from ....core.security import verify_token, optional_token

router = APIRouter()


@router.get("/", response_model=list[CourseOut])
async def list_courses(
    search: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    level: Optional[str] = Query(None),
    is_free: Optional[bool] = Query(None),
    instructor_id: Optional[str] = Query(None),
    published_only: bool = Query(True),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user: Optional[dict] = Depends(optional_token),
):
    stmt = (
        select(Course)
        .options(selectinload(Course.category))
        .order_by(desc(Course.created_at))
        .offset((page - 1) * limit)
        .limit(limit)
    )
    if published_only:
        stmt = stmt.where(Course.is_published == True)
    if search:
        stmt = stmt.where(Course.title.ilike(f"%{search}%"))
    if category_id:
        stmt = stmt.where(Course.category_id == category_id)
    if level:
        stmt = stmt.where(Course.level == level)
    if is_free is not None:
        stmt = stmt.where(Course.is_free == is_free)
    if instructor_id:
        stmt = stmt.where(Course.instructor_id == instructor_id)

    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
async def create_course(
    payload: CourseCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token),
):
    role = user.get("role", "student")
    if role not in ("instructor", "admin"):
        raise HTTPException(status_code=403, detail="Accès réservé aux instructeurs et admins")

    base_slug = slugify(payload.title)
    slug = base_slug
    count = 1
    while True:
        existing = await db.execute(select(Course).where(Course.slug == slug))
        if not existing.scalar_one_or_none():
            break
        slug = f"{base_slug}-{count}"
        count += 1

    course = Course(
        title=payload.title,
        slug=slug,
        description=payload.description,
        price=payload.price,
        is_free=payload.is_free,
        level=payload.level,
        category_id=payload.category_id,
        instructor_id=user.get("sub", "unknown"),
        thumbnail_url=payload.thumbnail_url,
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
        .where(Course.id == course_id)
    )
    result = await db.execute(stmt)
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Cours introuvable")

    user_role = user.get("role", "") if user else ""
    user_id = user.get("sub", "") if user else ""
    is_owner = course.instructor_id == user_id
    is_admin = user_role == "admin"

    if not course.is_published and not is_owner and not is_admin:
        raise HTTPException(status_code=404, detail="Cours introuvable")

    enrollment_count = len(course.enrollments)
    ratings = [r.rating for r in course.reviews if r.rating]
    avg_rating = sum(ratings) / len(ratings) if ratings else None

    is_enrolled = False
    if user:
        is_enrolled = any(e.user_id == user_id for e in course.enrollments)

    lessons = [
        l for l in sorted(course.lessons, key=lambda x: x.position)
        if l.is_preview or is_enrolled or is_owner or is_admin
    ]

    return CourseDetail(
        **CourseOut.model_validate(course).model_dump(),
        lessons=lessons,
        enrollment_count=enrollment_count,
        avg_rating=avg_rating,
    )


@router.put("/{course_id}", response_model=CourseOut)
async def update_course(
    course_id: int,
    payload: CourseUpdate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token),
):
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Cours introuvable")

    user_role = user.get("role", "")
    user_id = user.get("sub", "")
    if course.instructor_id != user_id and user_role != "admin":
        raise HTTPException(status_code=403, detail="Accès refusé")

    update_data = payload.model_dump(exclude_unset=True)
    if "title" in update_data and update_data["title"] != course.title:
        update_data["slug"] = slugify(update_data["title"])

    for key, value in update_data.items():
        setattr(course, key, value)

    await db.commit()
    await db.refresh(course)
    return course


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token),
):
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Cours introuvable")

    user_role = user.get("role", "")
    user_id = user.get("sub", "")
    if course.instructor_id != user_id and user_role != "admin":
        raise HTTPException(status_code=403, detail="Accès refusé")

    await db.delete(course)
    await db.commit()


@router.patch("/{course_id}/publish", response_model=CourseOut)
async def toggle_publish(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token),
):
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Cours introuvable")

    user_role = user.get("role", "")
    user_id = user.get("sub", "")
    if course.instructor_id != user_id and user_role != "admin":
        raise HTTPException(status_code=403, detail="Accès refusé")

    course.is_published = not course.is_published
    await db.commit()
    await db.refresh(course)
    return course


@router.post("/{course_id}/lessons", response_model=LessonOut, status_code=status.HTTP_201_CREATED)
async def add_lesson(
    course_id: int,
    payload: LessonCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token),
):
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Cours introuvable")

    user_role = user.get("role", "")
    user_id = user.get("sub", "")
    if course.instructor_id != user_id and user_role != "admin":
        raise HTTPException(status_code=403, detail="Accès refusé")

    max_pos_r = await db.execute(
        select(func.max(Lesson.position)).where(Lesson.course_id == course_id)
    )
    max_pos = max_pos_r.scalar() or 0
    lesson = Lesson(
        course_id=course_id,
        title=payload.title,
        content=payload.content,
        video_url=payload.video_url,
        duration=payload.duration,
        position=max_pos + 1,
        is_preview=payload.is_preview,
    )
    db.add(lesson)
    await db.commit()
    await db.refresh(lesson)
    return lesson


@router.delete("/{course_id}/lessons/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lesson(
    course_id: int,
    lesson_id: int,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token),
):
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Cours introuvable")

    user_role = user.get("role", "")
    user_id = user.get("sub", "")
    if course.instructor_id != user_id and user_role != "admin":
        raise HTTPException(status_code=403, detail="Accès refusé")

    lesson_result = await db.execute(
        select(Lesson).where(Lesson.id == lesson_id, Lesson.course_id == course_id)
    )
    lesson = lesson_result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=404, detail="Leçon introuvable")

    await db.delete(lesson)
    await db.commit()


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


@router.get("/user/enrollments", response_model=list[CourseOut])
async def my_enrollments(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token),
):
    stmt = (
        select(Course)
        .options(selectinload(Course.category))
        .join(Enrollment, Enrollment.course_id == Course.id)
        .where(Enrollment.user_id == user["sub"])
        .order_by(desc(Enrollment.enrolled_at))
    )
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/{course_id}/lessons/{lesson_id}/progress", status_code=status.HTTP_200_OK)
async def update_progress(
    course_id: int,
    lesson_id: int,
    payload: ProgressUpdate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_token),
):
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
