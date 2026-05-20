from fastapi import APIRouter, HTTPException
import httpx
from ....schemas.schemas import (
    QuestionRequest, QuestionResponse,
    QuizRequest, QuizResponse, QuizQuestion,
    RecommendationRequest, RecommendationResponse,
)
from ....services.llm import ask_llm, generate_quiz_llm, MOCK_RESPONSES
from ....core.config import get_settings

router = APIRouter()
settings = get_settings()


async def fetch_course_context(course_id: int, lesson_id: int | None = None) -> str:
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{settings.COURSE_SERVICE_URL}/api/v1/courses/{course_id}")
            if resp.status_code == 200:
                data = resp.json()
                title = data.get("title", "")
                description = data.get("description", "")
                lessons = data.get("lessons", [])
                if lesson_id:
                    lesson = next((l for l in lessons if l["id"] == lesson_id), None)
                    if lesson:
                        return f"Cours : {title}\nLeçon : {lesson['title']}\n{lesson.get('content', '')}"
                return f"Cours : {title}\nDescription : {description}"
    except Exception:
        pass
    return "Contexte du cours non disponible."


@router.post("/ask", response_model=QuestionResponse)
async def ask_question(payload: QuestionRequest):
    context = payload.context or await fetch_course_context(payload.course_id, payload.lesson_id)
    system_prompt = f"""Tu es un tuteur IA pédagogique pour une plateforme d'apprentissage en ligne.
Contexte du cours :
{context}

Réponds de façon claire, précise et pédagogique en français. Si la question sort du contexte du cours, redirige gentiment l'apprenant."""
    answer = await ask_llm(system_prompt, payload.question)
    return QuestionResponse(answer=answer, course_id=payload.course_id)


@router.post("/quiz", response_model=QuizResponse)
async def generate_quiz(payload: QuizRequest):
    context = await fetch_course_context(payload.course_id, payload.lesson_id)
    course_title = context.split("\n")[0].replace("Cours : ", "")
    questions_raw = await generate_quiz_llm(course_title, context, payload.num_questions)
    questions = [QuizQuestion(**q) for q in questions_raw]
    return QuizResponse(course_id=payload.course_id, questions=questions)


@router.post("/recommend", response_model=RecommendationResponse)
async def recommend(payload: RecommendationRequest):
    if not settings.OPENAI_API_KEY:
        return RecommendationResponse(
            recommendations=MOCK_RESPONSES["recommendation"],
            reason="Recommandations de démonstration (mode sans clé API)."
        )
    prompt = f"Suggère 3 cours pertinents pour un apprenant (user_id={payload.user_id}) qui suit actuellement le cours {payload.current_course_id}. Réponds en JSON : {{\"recommendations\": [...], \"reason\": \"...\"}}"
    import json
    raw = await ask_llm("Tu es un conseiller pédagogique.", prompt)
    try:
        data = json.loads(raw)
        return RecommendationResponse(**data)
    except Exception:
        return RecommendationResponse(
            recommendations=MOCK_RESPONSES["recommendation"],
            reason="Recommandations générées."
        )
