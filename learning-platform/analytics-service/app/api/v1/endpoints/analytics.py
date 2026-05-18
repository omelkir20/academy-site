from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from datetime import datetime, timezone, timedelta
from typing import Optional

from ....db.database import get_db
from ....models.models import PageView, Event, Feedback
from ....schemas.schemas import (
    PageViewCreate, EventCreate, FeedbackCreate, FeedbackOut, DashboardStats
)

router = APIRouter()


@router.post("/track/pageview", status_code=201)
async def track_pageview(payload: PageViewCreate, db: AsyncSession = Depends(get_db)):
    view = PageView(**payload.model_dump())
    db.add(view)
    await db.commit()
    return {"message": "Vue enregistrée"}


@router.post("/track/event", status_code=201)
async def track_event(payload: EventCreate, db: AsyncSession = Depends(get_db)):
    event = Event(**payload.model_dump())
    db.add(event)
    await db.commit()
    return {"message": "Événement enregistré"}


@router.post("/feedback", response_model=FeedbackOut, status_code=201)
async def submit_feedback(payload: FeedbackCreate, db: AsyncSession = Depends(get_db)):
    feedback = Feedback(**payload.model_dump())
    db.add(feedback)
    await db.commit()
    await db.refresh(feedback)
    return feedback


@router.get("/feedback", response_model=list[FeedbackOut])
async def list_feedbacks(
    course_id: Optional[int] = None,
    processed: Optional[bool] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Feedback).order_by(Feedback.created_at.desc()).limit(100)
    if course_id:
        stmt = stmt.where(Feedback.course_id == course_id)
    if processed is not None:
        stmt = stmt.where(Feedback.processed == processed)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/dashboard", response_model=DashboardStats)
async def dashboard(db: AsyncSession = Depends(get_db)):
    total_views_r = await db.execute(select(func.count()).select_from(PageView))
    total_views = total_views_r.scalar() or 0

    total_events_r = await db.execute(select(func.count()).select_from(Event))
    total_events = total_events_r.scalar() or 0

    total_feedbacks_r = await db.execute(select(func.count()).select_from(Feedback))
    total_feedbacks = total_feedbacks_r.scalar() or 0

    recent_events_r = await db.execute(
        select(Event).order_by(Event.created_at.desc()).limit(10)
    )
    recent_events = [
        {"id": e.id, "type": e.event_type, "user_id": e.user_id, "created_at": e.created_at.isoformat()}
        for e in recent_events_r.scalars().all()
    ]

    cutoff = datetime.now(timezone.utc) - timedelta(days=7)
    views_r = await db.execute(
        select(
            func.date_trunc("day", PageView.created_at).label("day"),
            func.count().label("count")
        )
        .where(PageView.created_at >= cutoff)
        .group_by("day")
        .order_by("day")
    )
    views_last_7 = [{"day": str(r.day), "count": r.count} for r in views_r.all()]

    enroll_r = await db.execute(
        select(
            Event.payload["course_id"].astext.label("course_id"),
            func.count().label("count")
        )
        .where(Event.event_type == "enrollment")
        .group_by("course_id")
        .order_by(func.count().desc())
        .limit(5)
    )
    enroll_by_course = [{"course_id": r.course_id, "count": r.count} for r in enroll_r.all()]

    return DashboardStats(
        total_views=total_views,
        total_events=total_events,
        total_feedbacks=total_feedbacks,
        recent_events=recent_events,
        enrollments_by_course=enroll_by_course,
        views_last_7_days=views_last_7,
    )
