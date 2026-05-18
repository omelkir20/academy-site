"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, CheckCircle, Clock, Star, Users, Play, MessageSquare } from "lucide-react";
import { coursesApi, analyticsApi, type CourseDetail, type Lesson } from "@/lib/api";
import { AiTutorChat } from "@/components/ai-tutor/AiTutorChat";
import { formatDuration, formatPrice, levelLabel } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    coursesApi.get(Number(id))
      .then((c) => { setCourse(c); setActiveLesson(c.lessons[0] ?? null); })
      .catch(() => router.push("/courses"))
      .finally(() => setLoading(false));
    analyticsApi.trackPageView(`/courses/${id}`, Number(id));
  }, [id]);

  async function handleEnroll() {
    if (!isAuthenticated) { router.push("/auth/login"); return; }
    setEnrolling(true);
    try {
      await coursesApi.enroll(Number(id));
      const updated = await coursesApi.get(Number(id));
      setCourse(updated);
      analyticsApi.trackEvent("enrollment", { course_id: Number(id), user_id: user?._id });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'inscription");
    } finally {
      setEnrolling(false);
    }
  }

  async function markDone(lesson: Lesson) {
    await coursesApi.updateProgress(Number(id), lesson.id, true);
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }
  if (!course) return null;

  const totalDuration = course.lessons.reduce((s, l) => s + l.duration, 0);
  const isEnrolled = course.lessons.some((l) => !l.is_preview && l.content);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            {course.category && (
              <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">{course.category.name}</span>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-3">{course.title}</h1>
            <p className="text-gray-600">{course.description}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{course.enrollment_count} inscrits</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{formatDuration(totalDuration)}</span>
            <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{course.lessons.length} leçons</span>
            {course.avg_rating && (
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />{course.avg_rating.toFixed(1)}/5</span>
            )}
            <span className="capitalize">{levelLabel(course.level)}</span>
          </div>

          {/* Lesson player */}
          {activeLesson ? (
            <div className="rounded-xl border bg-white overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">{activeLesson.title}</h2>
                <button
                  onClick={() => markDone(activeLesson)}
                  className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="h-4 w-4" /> Marquer comme terminé
                </button>
              </div>
              {activeLesson.video_url ? (
                <video controls className="w-full aspect-video bg-black" src={activeLesson.video_url} />
              ) : (
                <div className="p-6 prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{activeLesson.content}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border bg-gray-50 p-10 text-center text-gray-400">
              <Play className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Inscrivez-vous pour accéder aux leçons</p>
            </div>
          )}

          {/* AI Tutor toggle */}
          <button
            onClick={() => setShowChat((v) => !v)}
            className="flex items-center gap-2 rounded-lg border bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors w-full justify-center"
          >
            <MessageSquare className="h-4 w-4" />
            {showChat ? "Fermer le tuteur IA" : "Poser une question au tuteur IA"}
          </button>

          {showChat && (
            <div className="h-96">
              <AiTutorChat courseId={course.id} lessonId={activeLesson?.id} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Enroll card */}
          <div className="rounded-xl border bg-white p-6 shadow-sm sticky top-20">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatPrice(Number(course.price), course.is_free)}
            </div>
            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors mt-4"
            >
              {enrolling ? "Inscription..." : course.is_free ? "S'inscrire gratuitement" : "S'inscrire au cours"}
            </button>
          </div>

          {/* Lessons list */}
          <div className="rounded-xl border bg-white overflow-hidden">
            <div className="px-4 py-3 border-b font-semibold text-gray-900 text-sm">
              Programme du cours ({course.lessons.length} leçons)
            </div>
            <ul>
              {course.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <button
                    onClick={() => setActiveLesson(lesson)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-b last:border-0 ${
                      activeLesson?.id === lesson.id ? "bg-blue-50 text-blue-700" : "text-gray-700"
                    }`}
                  >
                    <Play className={`h-4 w-4 flex-shrink-0 ${lesson.is_preview ? "text-blue-400" : "text-gray-300"}`} />
                    <span className="flex-1 line-clamp-1">{lesson.title}</span>
                    <span className="text-xs text-gray-400">{formatDuration(lesson.duration)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
