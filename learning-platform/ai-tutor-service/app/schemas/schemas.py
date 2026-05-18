from pydantic import BaseModel
from typing import Optional


class QuestionRequest(BaseModel):
    course_id: int
    lesson_id: Optional[int] = None
    question: str
    context: Optional[str] = None


class QuestionResponse(BaseModel):
    answer: str
    course_id: int


class QuizRequest(BaseModel):
    course_id: int
    lesson_id: Optional[int] = None
    num_questions: int = 3


class QuizQuestion(BaseModel):
    question: str
    options: list[str]
    answer: int


class QuizResponse(BaseModel):
    course_id: int
    questions: list[QuizQuestion]


class RecommendationRequest(BaseModel):
    user_id: str
    current_course_id: Optional[int] = None


class RecommendationResponse(BaseModel):
    recommendations: list[str]
    reason: str
