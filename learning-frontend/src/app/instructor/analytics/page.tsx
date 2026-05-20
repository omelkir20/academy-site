"use client";
import { useEffect, useState } from "react";
import {
  BarChart3, Users, BookOpen, TrendingUp,
  ArrowUpRight, Loader2, Star
} from "lucide-react";
import { instructorApi, type Course } from "@/lib/api";

export default function InstructorAnalyticsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instructorApi.getMyCourses().then(setCourses).catch(() => null).finally(() => setLoading(false));
  }, []);

  const totalEnrollments = courses.reduce((s, c) => s + (c.enrollment_count ?? 0), 0);
  const totalRevenue = courses.reduce((s, c) => s + (c.is_free ? 0 : Number(c.price) * (c.enrollment_count ?? 0)), 0);
  const avgRating = courses.length > 0
    ? courses.filter(c => c.avg_rating).reduce((s, c) => s + (c.avg_rating ?? 0), 0) / Math.max(courses.filter(c => c.avg_rating).length, 1)
    : 0;

  const STATS = [
    { icon: BookOpen,   label: "Cours créés",    value: courses.length,                gradient: "from-emerald-400 to-teal-500",   shadow: "shadow-emerald-100" },
    { icon: Users,      label: "Étudiants",       value: totalEnrollments,              gradient: "from-sky-400 to-cyan-500",       shadow: "shadow-sky-100" },
    { icon: TrendingUp, label: "Revenus estimés", value: `${totalRevenue.toFixed(0)} €`, gradient: "from-amber-400 to-orange-500",  shadow: "shadow-amber-100" },
    { icon: Star,       label: "Note moyenne",    value: avgRating > 0 ? avgRating.toFixed(1) : "—", gradient: "from-violet-400 to-purple-500", shadow: "shadow-violet-100" },
  ];

  const maxEnrollments = Math.max(...courses.map(c => c.enrollment_count ?? 0), 1);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Analytiques</h1>
        <p className="text-sm text-gray-500 mt-0.5">Performances de vos cours</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
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

          {courses.length > 0 && (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-900 mb-1">Inscriptions par cours</h2>
                <p className="text-xs text-gray-400 mb-6">Nombre d'apprenants inscrits</p>
                <div className="space-y-4">
                  {[...courses].sort((a, b) => (b.enrollment_count ?? 0) - (a.enrollment_count ?? 0)).map((c) => (
                    <div key={c.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 font-medium line-clamp-1 max-w-[70%]">{c.title}</span>
                        <span className="text-gray-900 font-bold flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                          {c.enrollment_count ?? 0}
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                          style={{ width: `${Math.max(((c.enrollment_count ?? 0) / maxEnrollments) * 100, 2)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50">
                  <h2 className="font-bold text-gray-900">Détail par cours</h2>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/80">
                    <tr>
                      {["Cours", "Étudiants", "Note", "Revenu estimé", "Statut"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {courses.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                              <BookOpen className="h-4 w-4 text-white/80" />
                            </div>
                            <span className="font-semibold text-gray-900 line-clamp-1 max-w-[180px]">{c.title}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-700 font-semibold">{c.enrollment_count ?? 0}</td>
                        <td className="px-5 py-4">
                          {c.avg_rating ? (
                            <span className="flex items-center gap-1 text-amber-600 font-semibold">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {c.avg_rating.toFixed(1)}
                            </span>
                          ) : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-5 py-4 text-gray-700 font-semibold">
                          {c.is_free ? <span className="text-emerald-600">Gratuit</span> : `${(Number(c.price) * (c.enrollment_count ?? 0)).toFixed(0)} €`}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.is_published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                            {c.is_published ? "Publié" : "Brouillon"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
