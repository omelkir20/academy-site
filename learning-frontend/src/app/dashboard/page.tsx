"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen, CheckCircle, Zap, ArrowRight,
  TrendingUp, Clock, Sparkles, LayoutGrid
} from "lucide-react";
import { coursesApi, type Course } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { CourseCard } from "@/components/course/CourseCard";
import { formatPrice, levelLabel } from "@/lib/utils";
import Link from "next/link";

const LEVEL_BADGES: Record<string, string> = {
  beginner:     "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced:     "bg-rose-100 text-rose-700",
};

export default function DashboardPage() {
  const { user, loading: authLoading, isAdmin, isInstructor } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Course[]>([]);
  const [recommended, setRecommended] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth/login"); return; }
    if (isAdmin) { router.replace("/admin/dashboard"); return; }
    if (isInstructor) { router.replace("/instructor/dashboard"); return; }
  }, [user, authLoading, isAdmin, isInstructor, router]);

  useEffect(() => {
    if (!user || isAdmin || isInstructor) return;
    Promise.all([
      coursesApi.myEnrollments(),
      coursesApi.list({ page: 1 }),
    ]).then(([enrolled, all]) => {
      setEnrollments(enrolled);
      const ids = new Set(enrolled.map((c) => c.id));
      setRecommended(all.filter((c) => !ids.has(c.id)).slice(0, 4));
    }).catch(() => null).finally(() => setLoading(false));
  }, [user, isAdmin, isInstructor]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  if (authLoading || loading || !user) {
    return (
      <div className="container mx-auto px-4 py-10 animate-pulse space-y-6">
        <div className="h-44 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-3xl" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl" />)}
        </div>
        <div className="h-6 bg-gray-100 rounded w-1/4" />
        <div className="grid grid-cols-2 gap-4">
          {[1,2].map(i => <div key={i} className="h-40 bg-gray-100 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const STATS = [
    { icon: BookOpen,    label: "Cours suivis",     value: enrollments.length, gradient: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-100" },
    { icon: CheckCircle, label: "Cours complétés",  value: 0,                  gradient: "from-sky-400 to-cyan-500",    shadow: "shadow-sky-100" },
    { icon: Clock,       label: "Heures d'étude",   value: "—",                gradient: "from-violet-400 to-purple-500", shadow: "shadow-violet-100" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[80px]" />
        <div className="absolute left-0 bottom-0 h-60 w-60 rounded-full bg-violet-500/10 blur-[60px]" />
        <div className="relative container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <p className="text-emerald-400 text-xs font-semibold mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" /> Tableau de bord
              </p>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                {greeting}, <span className="gradient-text">{user.firstName}</span> !
              </h1>
              <p className="text-gray-400 mt-1.5 text-sm">
                {enrollments.length === 0
                  ? "Commencez votre parcours d'apprentissage dès aujourd'hui."
                  : `Vous suivez ${enrollments.length} cours — continuez sur votre lancée !`}
              </p>
            </div>
            <Link
              href="/courses"
              className="self-start md:self-center flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-5 py-3 text-sm hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-900/50"
            >
              <LayoutGrid className="h-4 w-4" /> Explorer les cours
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} flex-shrink-0 shadow-md ${s.shadow}`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
              Mes formations ({enrollments.length})
            </h2>
            <Link href="/profile" className="text-sm text-emerald-600 hover:underline font-semibold">
              Voir tout →
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-emerald-300" />
              </div>
              <h3 className="font-semibold text-gray-700 mb-1">Vous n'avez pas encore de cours</h3>
              <p className="text-sm text-gray-400 mb-6">Parcourez notre catalogue et commencez à apprendre.</p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-200"
              >
                Découvrir les cours <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all group cursor-pointer">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 text-2xl shadow-md shadow-emerald-200">
                      📚
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${LEVEL_BADGES[course.level] ?? "bg-gray-100 text-gray-600"}`}>
                          {levelLabel(course.level)}
                        </span>
                        {course.category && <span className="text-xs text-gray-400">{course.category.name}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-sm font-bold ${course.is_free ? "text-emerald-600" : "text-gray-900"}`}>
                        {formatPrice(Number(course.price), course.is_free)}
                      </span>
                      <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                        <CheckCircle className="h-3 w-3" /> Inscrit
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {recommended.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
                Recommandé pour vous
              </h2>
              <Link href="/courses" className="text-sm text-emerald-600 hover:underline font-semibold">
                Voir tout →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommended.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
