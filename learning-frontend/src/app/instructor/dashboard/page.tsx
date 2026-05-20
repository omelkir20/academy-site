"use client";
import { useEffect, useState } from "react";
import {
  BookOpen, Users, TrendingUp, Plus,
  ArrowRight, Star, Sparkles
} from "lucide-react";
import { instructorApi, type Course } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instructorApi.getMyCourses().then(setCourses).catch(() => null).finally(() => setLoading(false));
  }, []);

  const totalEnrollments = courses.reduce((s, c) => s + (c.enrollment_count ?? 0), 0);
  const avgRating = courses.length > 0
    ? courses.reduce((s, c) => s + (c.avg_rating ?? 0), 0) / courses.filter(c => c.avg_rating).length || 0
    : 0;

  const STATS = [
    { icon: BookOpen,   label: "Mes cours",      value: courses.length,                      gradient: "from-emerald-400 to-teal-500",  shadow: "shadow-emerald-100" },
    { icon: Users,      label: "Étudiants",       value: totalEnrollments,                    gradient: "from-sky-400 to-cyan-500",      shadow: "shadow-sky-100" },
    { icon: Star,       label: "Note moyenne",    value: avgRating > 0 ? avgRating.toFixed(1) : "—", gradient: "from-amber-400 to-orange-500", shadow: "shadow-amber-100" },
    { icon: TrendingUp, label: "Cours publiés",   value: courses.filter(c => c.is_published).length, gradient: "from-violet-400 to-purple-500", shadow: "shadow-violet-100" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20 rounded-2xl" />
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-[40px]" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" /> Espace instructeur
            </p>
            <h1 className="text-xl font-black">Bonjour, {user?.firstName} !</h1>
            <p className="text-gray-400 text-sm mt-1">Gérez vos cours et suivez vos apprenants</p>
          </div>
          <Link href="/instructor/courses/new"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-bold text-white hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-900/50"
          >
            <Plus className="h-4 w-4" /> Nouveau cours
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} shadow-md ${s.shadow} mb-3`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <div className="h-6 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
            Mes cours
          </h2>
          <Link href="/instructor/courses" className="text-sm text-emerald-600 hover:underline font-semibold">
            Voir tout →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
            {[1,2].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-200" />
            <h3 className="font-semibold text-gray-700 mb-1">Vous n'avez pas encore de cours</h3>
            <p className="text-sm text-gray-400 mb-5">Créez votre premier cours et commencez à enseigner</p>
            <Link href="/instructor/courses/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md shadow-emerald-200"
            >
              <Plus className="h-4 w-4" /> Créer un cours
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.slice(0, 4).map((c) => (
              <Link key={c.id} href={`/instructor/courses/${c.id}/edit`}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all group cursor-pointer">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-100">
                    <BookOpen className="h-5 w-5 text-white/80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors text-sm">{c.title}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-400">{c.enrollment_count ?? 0} étudiants</span>
                      <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${c.is_published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {c.is_published ? "Publié" : "Brouillon"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-bold text-gray-900">{formatPrice(Number(c.price), c.is_free)}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
