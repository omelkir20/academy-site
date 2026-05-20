"use client";
import { useEffect, useState } from "react";
import {
  BarChart3, TrendingUp, Users, BookOpen, DollarSign,
  ArrowUpRight, Loader2, Activity
} from "lucide-react";
import { adminApi } from "@/lib/api";

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  topCourses: { course_id: number; title: string; views: number; enrollments: number }[];
  enrollmentsByDay: { date: string; count: number }[];
  revenueByMonth: { month: string; amount: number }[];
  userGrowth: { month: string; count: number }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAnalytics().then(setData).catch(() => null).finally(() => setLoading(false));
  }, []);

  const KPI_CARDS = data ? [
    { icon: Activity,    label: "Pages vues",       value: data.pageViews.toLocaleString("fr"),        gradient: "from-sky-400 to-cyan-500",      shadow: "shadow-sky-100" },
    { icon: Users,       label: "Visiteurs uniques", value: data.uniqueVisitors.toLocaleString("fr"),   gradient: "from-emerald-400 to-teal-500",  shadow: "shadow-emerald-100" },
    { icon: TrendingUp,  label: "Inscriptions (30j)", value: data.enrollmentsByDay.reduce((s,d) => s+d.count, 0).toString(), gradient: "from-violet-400 to-purple-500", shadow: "shadow-violet-100" },
    { icon: DollarSign,  label: "Revenu (ce mois)", value: `${(data.revenueByMonth.at(-1)?.amount ?? 0).toFixed(0)} €`, gradient: "from-amber-400 to-orange-500", shadow: "shadow-amber-100" },
  ] : [];

  const maxEnrollments = Math.max(...(data?.enrollmentsByDay.map(d => d.count) ?? [1]), 1);
  const maxRevenue = Math.max(...(data?.revenueByMonth.map(d => d.amount) ?? [1]), 1);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Analytiques</h1>
        <p className="text-sm text-gray-500 mt-0.5">Statistiques de la plateforme en temps réel</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-emerald-400" /></div>
      ) : !data ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-200" />
          <p className="text-gray-500">Aucune donnée analytique disponible</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {KPI_CARDS.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} shadow-md ${s.shadow} mb-4`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-3xl font-black text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-1">Inscriptions (30 derniers jours)</h2>
              <p className="text-xs text-gray-400 mb-5">Nouveaux inscrits par jour</p>
              <div className="h-40 flex items-end gap-1">
                {data.enrollmentsByDay.slice(-30).map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-teal-400 opacity-80 group-hover:opacity-100 transition-all"
                      style={{ height: `${Math.max((d.count / maxEnrollments) * 100, 4)}%` }}
                      title={`${d.date}: ${d.count}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-1">Revenus mensuels</h2>
              <p className="text-xs text-gray-400 mb-5">En euros — 12 derniers mois</p>
              <div className="h-40 flex items-end gap-2">
                {data.revenueByMonth.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-amber-500 to-orange-400 opacity-80 group-hover:opacity-100 transition-all"
                      style={{ height: `${Math.max((m.amount / maxRevenue) * 100, 4)}%` }}
                      title={`${m.month}: ${m.amount.toFixed(0)} €`}
                    />
                    <span className="text-[10px] text-gray-400 group-hover:text-gray-600 transition-colors">{m.month.slice(0,3)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {data.topCourses.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="font-bold text-gray-900">Top cours</h2>
                <p className="text-xs text-gray-400">Par vues et inscriptions</p>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50/80">
                  <tr>
                    {["#", "Cours", "Vues", "Inscriptions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.topCourses.slice(0, 10).map((c, i) => (
                    <tr key={c.course_id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 text-gray-400 font-bold text-xs">#{i+1}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-900">{c.title}</td>
                      <td className="px-5 py-3.5 text-gray-600">{c.views.toLocaleString("fr")}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-0.5 text-xs">
                          <ArrowUpRight className="h-3 w-3" /> {c.enrollments}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
