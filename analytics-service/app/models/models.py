from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from ..db.database import Base


class PageView(Base):
    __tablename__ = "page_views"
    id = Column(Integer, primary_key=True)
    user_id = Column(String(100))
    course_id = Column(Integer)
    path = Column(String(512))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True)
    user_id = Column(String(100))
    event_type = Column(String(100), nullable=False)
    payload = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Feedback(Base):
    __tablename__ = "feedbacks"
    id = Column(Integer, primary_key=True)
    user_id = Column(String(100))
    course_id = Column(Integer)
    lesson_id = Column(Integer)
    content = Column(Text, nullable=False)
    sentiment = Column(String(50))
    ai_summary = Column(Text)
    processed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
