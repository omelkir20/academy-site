const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost/api";

function getBaseUrl(service: "users" | "courses" | "analytics" | "ai-tutor") {
  return `${BASE}/${service}`;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.detail || err.error || res.statusText);
  }
  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; password: string; firstName: string; lastName: string; role?: string }) =>
    request<{ token: string; user: User }>(`${getBaseUrl("users")}/v1/auth/register`, { method: "POST", body: JSON.stringify(data) }),

  login: (email: string, password: string) =>
    request<{ token: string; user: User }>(`${getBaseUrl("users")}/v1/auth/login`, { method: "POST", body: JSON.stringify({ email, password }) }),

  me: () => request<User>(`${getBaseUrl("users")}/v1/auth/me`),
};

// ─── Courses ─────────────────────────────────────────────────────────────────
export const coursesApi = {
  list: (params?: { search?: string; category_id?: number; level?: string; is_free?: boolean; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.category_id) q.set("category_id", String(params.category_id));
    if (params?.level) q.set("level", params.level);
    if (params?.is_free !== undefined) q.set("is_free", String(params.is_free));
    if (params?.page) q.set("page", String(params.page));
    return request<Course[]>(`${getBaseUrl("courses")}/v1/courses/?${q}`);
  },

  get: (id: number) => request<CourseDetail>(`${getBaseUrl("courses")}/v1/courses/${id}`),

  enroll: (courseId: number) =>
    request<Enrollment>(`${getBaseUrl("courses")}/v1/courses/${courseId}/enroll`, { method: "POST" }),

  updateProgress: (courseId: number, lessonId: number, completed: boolean) =>
    request(`${getBaseUrl("courses")}/v1/courses/${courseId}/lessons/${lessonId}/progress`, {
      method: "POST", body: JSON.stringify({ completed }),
    }),

  addReview: (courseId: number, rating: number, comment?: string) =>
    request<Review>(`${getBaseUrl("courses")}/v1/courses/${courseId}/reviews`, {
      method: "POST", body: JSON.stringify({ rating, comment }),
    }),

  categories: () => request<Category[]>(`${getBaseUrl("courses")}/v1/categories/`),
};

// ─── Analytics ────────────────────────────────────────────────────────────────
export const analyticsApi = {
  trackPageView: (path: string, courseId?: number) =>
    request(`${getBaseUrl("analytics")}/v1/analytics/track/pageview`, {
      method: "POST", body: JSON.stringify({ path, course_id: courseId }),
    }).catch(() => null),

  trackEvent: (eventType: string, payload?: Record<string, unknown>) =>
    request(`${getBaseUrl("analytics")}/v1/analytics/track/event`, {
      method: "POST", body: JSON.stringify({ event_type: eventType, payload }),
    }).catch(() => null),

  submitFeedback: (data: { course_id?: number; lesson_id?: number; content: string }) =>
    request(`${getBaseUrl("analytics")}/v1/analytics/feedback`, { method: "POST", body: JSON.stringify(data) }),

  dashboard: () => request<DashboardStats>(`${getBaseUrl("analytics")}/v1/analytics/dashboard`),
};

// ─── AI Tutor ────────────────────────────────────────────────────────────────
export const aiTutorApi = {
  ask: (courseId: number, question: string, lessonId?: number) =>
    request<{ answer: string; course_id: number }>(`${getBaseUrl("ai-tutor")}/v1/ai-tutor/ask`, {
      method: "POST", body: JSON.stringify({ course_id: courseId, lesson_id: lessonId, question }),
    }),

  generateQuiz: (courseId: number, numQuestions = 3) =>
    request<{ course_id: number; questions: QuizQuestion[] }>(`${getBaseUrl("ai-tutor")}/v1/ai-tutor/quiz`, {
      method: "POST", body: JSON.stringify({ course_id: courseId, num_questions: numQuestions }),
    }),

  recommend: (userId: string, currentCourseId?: number) =>
    request<{ recommendations: string[]; reason: string }>(`${getBaseUrl("ai-tutor")}/v1/ai-tutor/recommend`, {
      method: "POST", body: JSON.stringify({ user_id: userId, current_course_id: currentCourseId }),
    }),
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface User {
  _id?: string;
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "instructor" | "admin";
  avatar?: string;
  bio?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Lesson {
  id: number;
  title: string;
  content?: string;
  video_url?: string;
  duration: number;
  position: number;
  is_preview: boolean;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description?: string;
  thumbnail_url?: string;
  price: number;
  is_free: boolean;
  level: string;
  instructor_id: string;
  is_published: boolean;
  created_at: string;
  category?: Category;
}

export interface CourseDetail extends Course {
  lessons: Lesson[];
  enrollment_count: number;
  avg_rating?: number;
}

export interface Enrollment {
  id: number;
  user_id: string;
  course_id: number;
  enrolled_at: string;
}

export interface Review {
  id: number;
  user_id: string;
  course_id: number;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface DashboardStats {
  total_views: number;
  total_events: number;
  total_feedbacks: number;
  recent_events: Array<{ id: number; type: string; user_id?: string; created_at: string }>;
  enrollments_by_course: Array<{ course_id: string; count: number }>;
  views_last_7_days: Array<{ day: string; count: number }>;
}
