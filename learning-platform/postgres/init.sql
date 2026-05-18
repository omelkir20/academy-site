-- Create schemas
CREATE SCHEMA IF NOT EXISTS n8n;

-- ─── Courses ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
    id            SERIAL PRIMARY KEY,
    title         VARCHAR(255) NOT NULL,
    slug          VARCHAR(255) NOT NULL UNIQUE,
    description   TEXT,
    thumbnail_url VARCHAR(512),
    price         NUMERIC(10,2) DEFAULT 0.00,
    is_free       BOOLEAN DEFAULT TRUE,
    level         VARCHAR(50) DEFAULT 'beginner',
    category_id   INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    instructor_id VARCHAR(100) NOT NULL,
    is_published  BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
    id          SERIAL PRIMARY KEY,
    course_id   INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    content     TEXT,
    video_url   VARCHAR(512),
    duration    INTEGER DEFAULT 0,
    position    INTEGER NOT NULL DEFAULT 0,
    is_preview  BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
    id          SERIAL PRIMARY KEY,
    user_id     VARCHAR(100) NOT NULL,
    course_id   INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
    id           SERIAL PRIMARY KEY,
    user_id      VARCHAR(100) NOT NULL,
    lesson_id    INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed    BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id         SERIAL PRIMARY KEY,
    user_id    VARCHAR(100) NOT NULL,
    course_id  INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    rating     INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment    TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- ─── Analytics ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS page_views (
    id         SERIAL PRIMARY KEY,
    user_id    VARCHAR(100),
    course_id  INTEGER,
    path       VARCHAR(512),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
    id         SERIAL PRIMARY KEY,
    user_id    VARCHAR(100),
    event_type VARCHAR(100) NOT NULL,
    payload    JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedbacks (
    id           SERIAL PRIMARY KEY,
    user_id      VARCHAR(100),
    course_id    INTEGER,
    lesson_id    INTEGER,
    content      TEXT NOT NULL,
    sentiment    VARCHAR(50),
    ai_summary   TEXT,
    processed    BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Seed data ──────────────────────────────────────────────────────────────

INSERT INTO categories (name, slug, description) VALUES
    ('Développement Web',  'dev-web',       'HTML, CSS, JavaScript, frameworks modernes'),
    ('DevOps & Cloud',     'devops-cloud',  'Docker, Kubernetes, CI/CD, AWS, GCP'),
    ('Data Science',       'data-science',  'Python, Machine Learning, Deep Learning'),
    ('Cybersécurité',      'cybersecurite', 'Sécurité réseau, pentest, conformité'),
    ('Intelligence Artificielle', 'ia',     'LLM, RAG, agents autonomes')
ON CONFLICT DO NOTHING;

INSERT INTO courses (title, slug, description, price, is_free, level, category_id, instructor_id, is_published) VALUES
    ('Docker & Kubernetes pour débutants', 'docker-k8s-debutants',
     'Apprenez à containeriser vos applications et à les orchestrer avec Kubernetes.',
     0.00, TRUE, 'beginner', 2, 'instructor-001', TRUE),

    ('Next.js 14 — App Router complet', 'nextjs-14-app-router',
     'Maîtrisez Next.js 14 avec le nouveau App Router, Server Components et les actions serveur.',
     49.99, FALSE, 'intermediate', 1, 'instructor-001', TRUE),

    ('Python pour la Data Science', 'python-data-science',
     'NumPy, Pandas, Matplotlib et introduction au Machine Learning.',
     0.00, TRUE, 'beginner', 3, 'instructor-002', TRUE),

    ('CI/CD avec GitHub Actions', 'cicd-github-actions',
     'Automatisez vos pipelines de build, test et déploiement.',
     29.99, FALSE, 'intermediate', 2, 'instructor-001', TRUE),

    ('Introduction aux LLM et RAG', 'intro-llm-rag',
     'Comprenez les grands modèles de langage et construisez vos propres pipelines RAG.',
     0.00, TRUE, 'advanced', 5, 'instructor-003', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, content, duration, position, is_preview) VALUES
    (1, 'Introduction à Docker', 'Docker est une plateforme de containerisation...', 900, 1, TRUE),
    (1, 'Images et conteneurs',  'Une image Docker est un template...', 1200, 2, FALSE),
    (1, 'Docker Compose',        'Docker Compose permet de définir des applications multi-conteneurs...', 1500, 3, FALSE),
    (1, 'Introduction à Kubernetes', 'Kubernetes est un orchestrateur de conteneurs...', 1800, 4, FALSE),

    (2, 'Présentation du App Router', 'Le App Router de Next.js 14 introduit les Server Components...', 600, 1, TRUE),
    (2, 'Server Components vs Client Components', 'La distinction entre Server et Client Components...', 900, 2, FALSE),
    (2, 'Routes et navigation', 'Le système de fichiers de Next.js définit les routes...', 1200, 3, FALSE),

    (3, 'Introduction à NumPy', 'NumPy est la bibliothèque fondamentale pour le calcul scientifique...', 900, 1, TRUE),
    (3, 'Pandas — DataFrames', 'Pandas fournit des structures de données flexibles...', 1200, 2, FALSE)
ON CONFLICT DO NOTHING;
