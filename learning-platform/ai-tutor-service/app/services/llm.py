from openai import AsyncOpenAI
from ..core.config import get_settings

settings = get_settings()

MOCK_RESPONSES = {
    "question": "Je suis en mode démonstration (aucune clé OpenAI configurée). Pour obtenir de vraies réponses IA, veuillez configurer OPENAI_API_KEY dans votre fichier .env.",
    "quiz": [
        {"question": "Qu'est-ce qu'un conteneur Docker ?", "options": ["Un processus isolé", "Un réseau virtuel", "Un fichier compressé", "Un registre d'images"], "answer": 0},
        {"question": "Que fait docker-compose up ?", "options": ["Supprime les conteneurs", "Démarre les services définis", "Construit une image", "Publie une image"], "answer": 1},
        {"question": "Quel fichier définit une image Docker ?", "options": ["docker.yml", "Dockerfile", "compose.json", "image.conf"], "answer": 1},
    ],
    "recommendation": ["Docker & Kubernetes pour débutants", "CI/CD avec GitHub Actions", "Introduction aux LLM et RAG"],
}


async def ask_llm(system_prompt: str, user_message: str) -> str:
    if not settings.OPENAI_API_KEY:
        return MOCK_RESPONSES["question"]
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY, base_url=settings.OPENAI_BASE_URL)
    response = await client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        max_tokens=1024,
        temperature=0.7,
    )
    return response.choices[0].message.content or ""


async def generate_quiz_llm(course_title: str, lesson_content: str, num_questions: int = 3) -> list[dict]:
    if not settings.OPENAI_API_KEY:
        return MOCK_RESPONSES["quiz"][:num_questions]
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY, base_url=settings.OPENAI_BASE_URL)
    prompt = f"""Génère {num_questions} questions QCM (4 options chacune) en JSON basées sur le cours "{course_title}" et ce contenu :
{lesson_content[:2000]}

Format JSON attendu :
[{{"question": "...", "options": ["a","b","c","d"], "answer": 0}}]
Réponds uniquement avec le JSON valide."""
    response = await client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1024,
        temperature=0.5,
        response_format={"type": "json_object"},
    )
    import json
    text = response.choices[0].message.content or "[]"
    try:
        parsed = json.loads(text)
        return parsed.get("questions", parsed) if isinstance(parsed, dict) else parsed
    except Exception:
        return MOCK_RESPONSES["quiz"][:num_questions]
