"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen, CheckCircle, Clock, Star, Users, Play,
  MessageSquare, ArrowLeft, Lock, Unlock, GraduationCap
} from "lucide-react";
import { coursesApi, analyticsApi, type CourseDetail, type Lesson } from "@/lib/api";
import { AiTutorChat } from "@/components/ai-tutor/AiTutorChat";
import { formatDuration, formatPrice, levelLabel } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

const LEVEL_COLORS: Record<string, string> = {
  beginner:     "bg-green-100 text-green-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced:     "bg-red-100 text-red-700",
};

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse]       = useState<CourseDetail | null>(null);
  const [loading, setLoading]     = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showChat, setShowChat]   = useState(false);
  const [error, setError]         = useState("");
  const [enrolled, setEnrolled]   = useState(false);

  useEffect(() => {
    coursesApi.get(Number(id))
      .then((c) => {
        setCourse(c);
        setActiveLesson(c.lessons[0] ?? null);
      })
      .catch(() => router.push("/courses"))
      .finally(() => setLoading(false));
    analyticsApi.trackPageView(`/courses/${id}`, Number(id));
  }, [id, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    coursesApi.myEnrollments()
      .then((list) => setEnrolled(list.some((c) => c.id === Number(id))))
      .catch(() => null);
  }, [id, isAuthenticated]);

  async function handleEnroll() {
    if (!isAuthenticated) { router.push("/auth/login"); return; }
    setEnrolling(true); setError("");
    try {
      await coursesApi.enroll(Number(id));
      setEnrolled(true);
      analyticsApi.trackEvent("enrollment", { course_id: Number(id), user_id: user?._id });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'inscription");
    } finally {
      setEnrolling(false);
    }
  }

  async function markDone(lesson: Lesson) {
    try { await coursesApi.updateProgress(Number(id), lesson.id, true); } catch { /* silent */ }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 bg-gray-200 rounded-2xl" />
            <div className="h-32 bg-gray-200 rounded-2xl" />
          </div>
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }
  if (!course) return null;

  const totalDuration = course.lessons.reduce((s, l) => s + l.duration, 0);
  const freePreview = course.lessons.filter((l) => l.is_preview);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-10">
          <Link href="/courses" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Retour au catalogue
          </Link>

          {course.category && (
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2 block">
              {course.category.name}
            </span>
          )}
          <h1 className="text-2xl md:text-3xl font-black mb-3 leading-snug max-w-2xl">{course.title}</h1>
          <p className="text-gray-300 text-sm mb-5 max-w-xl leading-relaxed">{course.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEVEL_COLORS[course.level] ?? "bg-gray-700 text-gray-300"}`}>
              {levelLabel(course.level)}
            </span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{course.enrollment_count} inscrits</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{formatDuration(totalDuration)}</span>
            <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{course.lessons.length} leçons</span>
            {course.avg_rating && (
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {course.avg_rating.toFixed(1)}/5
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main ──────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Lesson viewer */}
            {activeLesson ? (
              <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-gray-900">{activeLesson.title}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Durée : {formatDuration(activeLesson.duration)}
                    </p>
                  </div>
                  {enrolled && (
                    <button
                      onClick={() => markDone(activeLesson)}
                      className="flex items-center gap-1.5 rounded-xl border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Terminé
                    </button>
                  )}
                </div>

                {activeLesson.video_url ? (
                  <video controls className="w-full aspect-video bg-black" src={activeLesson.video_url} />
                ) : activeLesson.is_preview || enrolled ? (
                  <div className="p-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                      {activeLesson.content}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50">
                    <div className="h-16 w-16 rounded-2xl bg-gray-200 flex items-center justify-center mb-4">
                      <Lock className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-700 mb-1">Contenu verrouillé</h3>
                    <p className="text-sm text-gray-400 mb-5">Inscrivez-vous pour accéder à ce contenu.</p>
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      {enrolling ? "Inscription…" : "S'inscrire au cours"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border shadow-sm flex flex-col items-center justify-center py-16 text-center">
                <Play className="h-12 w-12 mb-3 text-gray-200" />
                <p className="text-gray-400">Ce cours ne contient pas encore de leçons.</p>
              </div>
            )}

            {/* AI Tutor */}
            {enrolled && (
              <>
                <button
                  onClick={() => setShowChat((v) => !v)}
                  className={`flex items-center gap-2.5 rounded-2xl border px-5 py-3.5 text-sm font-semibold w-full justify-center transition-all ${
                    showChat
                      ? "border-blue-300 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  {showChat ? "Fermer le tuteur IA" : "Poser une question au tuteur IA"}
                </button>
                {showChat && (
                  <div className="h-96 rounded-2xl overflow-hidden border shadow-sm">
                    <AiTutorChat courseId={course.id} lessonId={activeLesson?.id} />
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Enroll card */}
            <div className="bg-white rounded-2xl border shadow-sm p-5 sticky top-20">
              <div className="text-3xl font-black text-gray-900 mb-1">
                {formatPrice(Number(course.price), course.is_free)}
              </div>
              {course.is_free && (
                <p className="text-xs text-green-600 font-medium mb-3">Accès gratuit — aucune carte requise</p>
              )}
              {error && (
                <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2 mb-3 border border-red-200">{error}</p>
              )}

              {enrolled ? (
                <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-700">
                  <CheckCircle className="h-4 w-4" /> Vous êtes inscrit à ce cours
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60 transition-all shadow-sm hover:shadow-md hover:shadow-blue-100"
                >
                  {enrolling ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <GraduationCap className="h-4 w-4" />
                  )}
                  {enrolling ? "Inscription…" : course.is_free ? "S'inscrire gratuitement" : "S'inscrire maintenant"}
                </button>
              )}

              <div className="mt-4 pt-4 border-t space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" /> {course.lessons.length} leçons incluses</div>
                <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {formatDuration(totalDuration)} de contenu</div>
                <div className="flex items-center gap-2"><Unlock className="h-3.5 w-3.5" /> {freePreview.length} leçon(s) en aperçu gratuit</div>
              </div>
            </div>

            {/* Lessons list */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">Programme</span>
                <span className="text-xs text-gray-400">{course.lessons.length} leçons</span>
              </div>
              <ul className="divide-y max-h-80 overflow-y-auto">
                {course.lessons.map((lesson, idx) => (
                  <li key={lesson.id}>
                    <button
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                        activeLesson?.id === lesson.id
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        activeLesson?.id === lesson.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="flex-1 line-clamp-1">{lesson.title}</span>
                      <div className="flex-shrink-0 flex items-center gap-1.5">
                        {lesson.is_preview && (
                          <span className="text-xs text-blue-500 font-medium bg-blue-50 px-1.5 rounded">Aperçu</span>
                        )}
                        <span className="text-xs text-gray-400">{formatDuration(lesson.duration)}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
