# LearnHub — Plateforme d'apprentissage en ligne (Microservices)

Projet d'intégration de compétences — Master DevOps & Cloud M1  
Architecture microservices avec Docker Compose, IA pédagogique et workflow n8n.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway (Nginx :80)                    │
│   /          → learning-frontend (Next.js)                  │
│   /api/users → user-service (Node.js/Express)               │
│   /api/courses → course-service (FastAPI)                   │
│   /api/analytics → analytics-service (FastAPI)              │
│   /api/ai-tutor → ai-tutor-service (FastAPI + LLM)          │
│   /n8n/ → n8n-automation                                    │
└─────────────────────────────────────────────────────────────┘

Datastores :
  PostgreSQL :5432  — cours, analytics, feedbacks, n8n
  MongoDB :27017    — utilisateurs
  Redis :6379       — cache
  MinIO :9000/9001  — stockage médias
```

### Services et ports internes

| Service             | Port  | Technologie           |
|---------------------|-------|-----------------------|
| nginx-gateway       | 80    | Nginx                 |
| learning-frontend   | 3000  | Next.js 15            |
| user-service        | 3001  | Node.js / Express     |
| course-service      | 8001  | FastAPI (Python 3.12) |
| analytics-service   | 8002  | FastAPI (Python 3.12) |
| ai-tutor-service    | 8003  | FastAPI + OpenAI SDK  |
| n8n-automation      | 5678  | n8n                   |
| postgres            | 5432  | PostgreSQL 16         |
| mongodb             | 27017 | MongoDB 7             |
| redis               | 6379  | Redis 7               |
| minio               | 9000  | MinIO                 |

---

## Prérequis

- **Docker Desktop** (Windows) — [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- **Git** (optionnel, pour cloner le projet)
- **8 Go de RAM** minimum recommandés pour Docker

---

## Installation et démarrage rapide

### 1. Cloner / copier le projet

```powershell
# Depuis la racine du projet
cd learning-platform
```

### 2. Configurer les variables d'environnement

```powershell
Copy-Item .env.example .env
# Éditez .env si nécessaire (optionnel pour les tests locaux)
# Pour l'IA réelle, ajoutez votre OPENAI_API_KEY dans .env
notepad .env
```

### 3. Lancer tous les services

```powershell
docker-compose up --build
```

> La première fois, le build prend 5–10 minutes (téléchargement des images, installation des dépendances).

### 4. Accéder à la plateforme

| URL                             | Service                         |
|---------------------------------|---------------------------------|
| http://localhost                | Frontend Next.js                |
| http://localhost/courses        | Catalogue de cours              |
| http://localhost/n8n/           | Interface n8n (admin/admin_secret) |
| http://localhost:9001           | MinIO Console (minioadmin/minioadmin_secret) |
| http://localhost:8001/docs      | Course Service API (Swagger)    |
| http://localhost:8002/docs      | Analytics Service API (Swagger) |
| http://localhost:8003/docs      | AI Tutor Service API (Swagger)  |
| http://localhost:3001/health    | User Service health check       |

---

## Commandes utiles

```powershell
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (reset complet)
docker-compose down -v

# Voir les logs d'un service
docker-compose logs -f course-service
docker-compose logs -f learning-frontend

# Reconstruire un seul service après modification
docker-compose up --build course-service

# Voir le statut de tous les services
docker-compose ps
```

---

## Configuration de l'IA Tutor

Le service AI Tutor fonctionne en **deux modes** :

### Mode démonstration (par défaut, sans clé API)
Le service répond avec des messages types. Aucune configuration requise.

### Mode IA réelle (OpenAI)
Ajoutez dans `.env` :
```env
OPENAI_API_KEY=sk-...votre-clé...
LLM_MODEL=gpt-4o-mini
```
Puis redémarrez :
```powershell
docker-compose up -d ai-tutor-service
```

### Mode LLM local (Ollama)
Installez [Ollama](https://ollama.ai), lancez `ollama run llama3.2`, puis :
```env
OPENAI_API_KEY=ollama
OPENAI_BASE_URL=http://host.docker.internal:11434/v1
LLM_MODEL=llama3.2
```

---

## Workflow n8n — Traitement des feedbacks

1. Accédez à http://localhost/n8n/ (admin / admin_secret)
2. Importez le workflow : **Settings → Import from file** → `n8n-automation/feedback_workflow.json`
3. Activez le workflow
4. Le webhook écoute sur : `POST http://localhost:5678/webhook/feedback`

**Exemple de déclenchement :**
```powershell
Invoke-WebRequest -Uri "http://localhost:5678/webhook/feedback" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"user_id":"user-123","course_id":1,"content":"Excellent cours, très bien expliqué !"}'
```

Le workflow effectue :
1. Réception du feedback via Webhook
2. Stockage dans Analytics Service (PostgreSQL)
3. Analyse IA du sentiment et résumé
4. Enregistrement de l'événement analytics
5. Notification (log)

---

## Structure du projet

```
learning-platform/
├── docker-compose.yml          ← Orchestration principale
├── .env.example                ← Template de configuration
├── README.md
│
├── nginx-gateway/              ← Reverse proxy
│   ├── Dockerfile
│   └── nginx.conf
│
├── postgres/
│   └── init.sql                ← Schéma + données de seed
│
├── learning-frontend/          ← Next.js 15 (App Router)
│   ├── Dockerfile
│   ├── src/app/                ← Pages (/, /courses, /dashboard, /auth)
│   ├── src/components/         ← Composants (CourseCard, AiTutorChat, Navbar)
│   ├── src/lib/api.ts          ← Client API centralisé
│   └── src/hooks/useAuth.ts    ← Gestion de l'authentification
│
├── user-service/               ← Node.js / Express + MongoDB
│   ├── Dockerfile
│   └── src/
│       ├── controllers/        ← auth.controller.ts, profile.controller.ts
│       ├── middleware/auth.ts   ← Vérification JWT
│       ├── models/User.ts      ← Schéma Mongoose
│       └── routes/index.ts
│
├── course-service/             ← FastAPI + PostgreSQL
│   ├── Dockerfile
│   └── app/
│       ├── api/v1/endpoints/   ← courses.py, categories.py
│       ├── models/models.py    ← SQLAlchemy models
│       └── schemas/schemas.py  ← Pydantic schemas
│
├── analytics-service/          ← FastAPI + PostgreSQL
│   ├── Dockerfile
│   └── app/
│       └── api/v1/endpoints/analytics.py
│
├── ai-tutor-service/           ← FastAPI + OpenAI SDK
│   ├── Dockerfile
│   └── app/
│       ├── services/llm.py     ← Intégration LLM (OpenAI / mock)
│       └── api/v1/endpoints/tutor.py
│
└── n8n-automation/
    └── feedback_workflow.json  ← Workflow n8n à importer
```

---

## Fonctionnalités implémentées

- **Catalogue de cours** : liste, recherche, filtres (niveau, catégorie, gratuit/payant)
- **Détail de cours** : syllabus, lecteur de leçons (texte/vidéo), progression
- **Authentification JWT** : inscription, connexion, profils, rôles (student/instructor/admin)
- **Inscription aux cours** : enrôlement, suivi de progression par leçon
- **Tuteur IA** : Q&A contextuel, génération de quiz, recommandations
- **Analytics** : suivi des vues, événements, dashboard, feedbacks
- **Workflow n8n** : collecte feedback → analyse IA → stockage → notification
- **Stockage médias** : MinIO (prêt à l'emploi)
- **Cache** : Redis (session + cache API)

---

## Dépannage

| Problème | Solution |
|---------|----------|
| Port 80 déjà utilisé | Modifiez dans `docker-compose.yml` : `"8080:80"` |
| MongoDB ne démarre pas | `docker-compose down -v` puis `docker-compose up` |
| Course service timeout | Attendez que PostgreSQL soit healthy (30-60s) |
| Frontend 502 | Vérifiez que `learning-frontend` est bien démarré : `docker-compose logs learning-frontend` |
| n8n erreur DB | Le schéma n8n dans PostgreSQL est créé automatiquement au 1er démarrage |
