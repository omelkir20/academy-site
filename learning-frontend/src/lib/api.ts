const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost/api";

function svc(service: "users" | "courses" | "analytics" | "ai-tutor") {
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
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; password: string; firstName: string; lastName: string; role?: string }) =>
    request<{ token: string; user: User }>(`${svc("users")}/v1/auth/register`, { method: "POST", body: JSON.stringify(data) }),

  login: (email: string, password: string) =>
    request<{ token: string; user: User }>(`${svc("users")}/v1/auth/login`, { method: "POST", body: JSON.stringify({ email, password }) }),

  me: () => request<User>(`${svc("users")}/v1/auth/me`),

  updateProfile: (data: Partial<User>) =>
    request<User>(`${svc("users")}/v1/users/profile`, { method: "PUT", body: JSON.stringify(data) }),
};

// ─── Admin ───────────────────────────────────────────────────────────────────
export const adminApi = {
  stats: () => request<AdminStats>(`${svc("users")}/v1/admin/stats`),

  listUsers: (params?: { page?: number; limit?: number; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.search) q.set("search", params.search);
    return request<{ users: User[]; total: number; pages: number }>(`${svc("users")}/v1/admin/users?${q}`);
  },

  createUser: (data: { email: string; password: string; firstName: string; lastName: string; role: string }) =>
    request<User>(`${svc("users")}/v1/admin/users`, { method: "POST", body: JSON.stringify(data) }),

  updateUser: (id: string, data: Partial<User & { isActive: boolean }>) =>
    request<User>(`${svc("users")}/v1/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteUser: (id: string) =>
    request<{ message: string }>(`${svc("users")}/v1/admin/users/${id}`, { method: "DELETE" }),

  listAllCourses: (params?: { search?: string; page?: number }) => {
    const q = new URLSearchParams();
    q.set("published_only", "false");
    if (params?.search) q.set("search", params.search);
    if (params?.page) q.set("page", String(params.page));
    return request<Course[]>(`${svc("courses")}/v1/courses/?${q}`);
  },

  getAnalytics: () =>
    request<DashboardStats>(`${svc("analytics")}/v1/analytics/dashboard`).then((d) => ({
      pageViews: d.total_views,
      uniqueVisitors: d.total_events,
      topCourses: d.enrollments_by_course.map((e) => ({
        course_id: Number(e.course_id),
        title: `Course ${e.course_id}`,
        views: 0,
        enrollments: e.count,
      })),
      enrollmentsByDay: d.views_last_7_days.map((v) => ({ date: v.day, count: v.count })),
      revenueByMonth: [] as { month: string; amount: number }[],
      userGrowth: [] as { month: string; count: number }[],
    })),
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
    return request<Course[]>(`${svc("courses")}/v1/courses/?${q}`);
  },

  listByInstructor: (instructorId: string) =>
    request<Course[]>(`${svc("courses")}/v1/courses/?instructor_id=${instructorId}&published_only=false`),

  get: (id: number) => request<CourseDetail>(`${svc("courses")}/v1/courses/${id}`),

  create: (data: Partial<Course>) =>
    request<Course>(`${svc("courses")}/v1/courses/`, { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: Partial<Course>) =>
    request<Course>(`${svc("courses")}/v1/courses/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: number) =>
    request<void>(`${svc("courses")}/v1/courses/${id}`, { method: "DELETE" }),

  togglePublish: (id: number) =>
    request<Course>(`${svc("courses")}/v1/courses/${id}/publish`, { method: "PATCH" }),

  addLesson: (courseId: number, data: Partial<Lesson>) =>
    request<Lesson>(`${svc("courses")}/v1/courses/${courseId}/lessons`, { method: "POST", body: JSON.stringify(data) }),

  deleteLesson: (courseId: number, lessonId: number) =>
    request<void>(`${svc("courses")}/v1/courses/${courseId}/lessons/${lessonId}`, { method: "DELETE" }),

  enroll: (courseId: number) =>
    request<Enrollment>(`${svc("courses")}/v1/courses/${courseId}/enroll`, { method: "POST" }),

  myEnrollments: () =>
    request<Course[]>(`${svc("courses")}/v1/courses/user/enrollments`),

  updateProgress: (courseId: number, lessonId: number, completed: boolean) =>
    request(`${svc("courses")}/v1/courses/${courseId}/lessons/${lessonId}/progress`, {
      method: "POST", body: JSON.stringify({ completed }),
    }),

  addReview: (courseId: number, rating: number, comment?: string) =>
    request<Review>(`${svc("courses")}/v1/courses/${courseId}/reviews`, {
      method: "POST", body: JSON.stringify({ rating, comment }),
    }),

  categories: () => request<Category[]>(`${svc("courses")}/v1/categories/`),
};

// ─── Instructor ───────────────────────────────────────────────────────────────
export const instructorApi = {
  getMyCourses: () =>
    request<Course[]>(`${svc("courses")}/v1/courses/?published_only=false`),

  getCourse: (id: number) =>
    request<CourseDetail>(`${svc("courses")}/v1/courses/${id}`),

  createCourse: (data: Partial<Course>) =>
    request<Course>(`${svc("courses")}/v1/courses/`, { method: "POST", body: JSON.stringify(data) }),

  updateCourse: (id: number, data: Partial<Course>) =>
    request<Course>(`${svc("courses")}/v1/courses/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteCourse: (id: number) =>
    request<void>(`${svc("courses")}/v1/courses/${id}`, { method: "DELETE" }),

  addLesson: (courseId: number, data: Partial<Lesson>) =>
    request<Lesson>(`${svc("courses")}/v1/courses/${courseId}/lessons`, { method: "POST", body: JSON.stringify(data) }),

  deleteLesson: (courseId: number, lessonId: number) =>
    request<void>(`${svc("courses")}/v1/courses/${courseId}/lessons/${lessonId}`, { method: "DELETE" }),
};

// ─── Analytics ────────────────────────────────────────────────────────────────
export const analyticsApi = {
  trackPageView: (path: string, courseId?: number) =>
    request(`${svc("analytics")}/v1/analytics/track/pageview`, {
      method: "POST", body: JSON.stringify({ path, course_id: courseId }),
    }).catch(() => null),

  trackEvent: (eventType: string, payload?: Record<string, unknown>) =>
    request(`${svc("analytics")}/v1/analytics/track/event`, {
      method: "POST", body: JSON.stringify({ event_type: eventType, payload }),
    }).catch(() => null),

  submitFeedback: (data: { course_id?: number; lesson_id?: number; content: string }) =>
    request(`${svc("analytics")}/v1/analytics/feedback`, { method: "POST", body: JSON.stringify(data) }),

  dashboard: () => request<DashboardStats>(`${svc("analytics")}/v1/analytics/dashboard`),
};

// ─── AI Tutor ────────────────────────────────────────────────────────────────
export const aiTutorApi = {
  ask: (courseId: number, question: string, lessonId?: number) =>
    request<{ answer: string; course_id: number }>(`${svc("ai-tutor")}/v1/ai-tutor/ask`, {
      method: "POST", body: JSON.stringify({ course_id: courseId, lesson_id: lessonId, question }),
    }),

  generateQuiz: (courseId: number, numQuestions = 3) =>
    request<{ course_id: number; questions: QuizQuestion[] }>(`${svc("ai-tutor")}/v1/ai-tutor/quiz`, {
      method: "POST", body: JSON.stringify({ course_id: courseId, num_questions: numQuestions }),
    }),

  recommend: (userId: string, currentCourseId?: number) =>
    request<{ recommendations: string[]; reason: string }>(`${svc("ai-tutor")}/v1/ai-tutor/recommend`, {
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
  isActive?: boolean;
  createdAt?: string;
}

export interface AdminStats {
  total: number;
  students: number;
  instructors: number;
  admins: number;
  active: number;
  inactive: number;
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
  category_id?: number;
  enrollment_count?: number;
  avg_rating?: number;
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
