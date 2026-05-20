"use client";
import { useEffect, useState } from "react";
import { analyticsApi, type DashboardStats } from "@/lib/api";
import { BarChart2, Eye, MessageSquare, TrendingUp } from "lucide-react";

export default function InstructorAnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    analyticsApi.dashboard().then(setStats).catch(() => null);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          { icon: Eye,           label: "Vues totales",  value: stats?.total_views ?? 0,     color: "bg-blue-50 text-blue-600" },
          { icon: TrendingUp,    label: "Événements",    value: stats?.total_events ?? 0,    color: "bg-green-50 text-green-600" },
          { icon: MessageSquare, label: "Feedbacks",     value: stats?.total_feedbacks ?? 0, color: "bg-purple-50 text-purple-600" },
        ].map((s) => (
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
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
          <BarChart2 className="h-4 w-4 text-blue-600" /> Vues quotidiennes (7j)
        </div>
        <div className="space-y-3">
          {(stats?.views_last_7_days ?? []).map((d) => {
            const max = Math.max(...(stats?.views_last_7_days.map((x) => x.count) ?? [1]), 1);
            return (
              <div key={d.day} className="flex items-center gap-3 text-sm">
                <span className="w-24 text-gray-400 text-xs">{new Date(d.day).toLocaleDateString("fr-FR")}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(d.count / max) * 100}%` }} />
                </div>
                <span className="w-6 text-right font-bold text-gray-700">{d.count}</span>
              </div>
            );
          })}
          {!stats?.views_last_7_days?.length && <p className="text-center text-sm text-gray-400 py-4">Aucune donnée</p>}
        </div>
      </div>
    </div>
  );
}
