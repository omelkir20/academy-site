"use client";
import { useEffect, useState } from "react";
import { analyticsApi, type DashboardStats } from "@/lib/api";
import { BarChart2, Eye, MessageSquare, TrendingUp, Loader2 } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.dashboard().then(setStats).catch(() => null).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8 flex items-center justify-center h-96">
      <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
    </div>
  );

  const statCards = [
    { icon: Eye,           label: "Vues totales",  value: stats?.total_views ?? 0,     color: "bg-blue-50 text-blue-600" },
    { icon: TrendingUp,    label: "Événements",    value: stats?.total_events ?? 0,    color: "bg-green-50 text-green-600" },
    { icon: MessageSquare, label: "Feedbacks",     value: stats?.total_feedbacks ?? 0, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <BarChart2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500">Suivi de la plateforme en temps réel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl border bg-white p-5 shadow-sm flex items-center gap-4">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value.toLocaleString("fr-FR")}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-white overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b font-semibold text-gray-900">
            <TrendingUp className="h-4 w-4 text-green-600" /> Vues quotidiennes (7j)
          </div>
          <div className="p-5 space-y-3">
            {(stats?.views_last_7_days ?? []).map((d) => {
              const max = Math.max(...(stats?.views_last_7_days.map((x) => x.count) ?? [1]), 1);
              return (
                <div key={d.day} className="flex items-center gap-3 text-sm">
                  <span className="w-24 text-gray-400 text-xs">{new Date(d.day).toLocaleDateString("fr-FR")}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" style={{ width: `${(d.count / max) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right font-bold text-gray-700">{d.count}</span>
                </div>
              );
            })}
            {!stats?.views_last_7_days?.length && <p className="text-center text-sm text-gray-400 py-4">Aucune donnée</p>}
          </div>
        </div>

        <div className="rounded-xl border bg-white overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b font-semibold text-gray-900">
            <BarChart2 className="h-4 w-4 text-blue-600" /> Événements récents
          </div>
          <ul className="divide-y max-h-80 overflow-y-auto">
            {(stats?.recent_events ?? []).map((e) => (
              <li key={e.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700 capitalize">{e.type.replace(/_/g, " ")}</span>
                  {e.user_id && <span className="text-xs text-gray-400 ml-2">— {e.user_id.slice(-6)}</span>}
                </div>
                <span className="text-gray-400 text-xs">{new Date(e.created_at).toLocaleString("fr-FR")}</span>
              </li>
            ))}
            {!stats?.recent_events?.length && (
              <li className="px-5 py-8 text-center text-sm text-gray-400">Aucun événement</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
