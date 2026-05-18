"use client";
import { useEffect, useState } from "react";
import { Users, BookOpen, BarChart2, TrendingUp, ShieldCheck, UserCheck, UserX, GraduationCap } from "lucide-react";
import { adminApi, analyticsApi, type AdminStats, type DashboardStats } from "@/lib/api";

export default function AdminDashboardPage() {
  const [userStats, setUserStats] = useState<AdminStats | null>(null);
  const [analytics, setAnalytics] = useState<DashboardStats | null>(null);

  useEffect(() => {
    adminApi.stats().then(setUserStats).catch(() => null);
    analyticsApi.dashboard().then(setAnalytics).catch(() => null);
  }, []);

  const cards = [
    { label: "Utilisateurs totaux",  value: userStats?.total ?? "-",       icon: Users,       color: "bg-blue-50 text-blue-600" },
    { label: "Apprenants",           value: userStats?.students ?? "-",     icon: GraduationCap, color: "bg-purple-50 text-purple-600" },
    { label: "Instructeurs",         value: userStats?.instructors ?? "-",  icon: UserCheck,   color: "bg-green-50 text-green-600" },
    { label: "Comptes inactifs",     value: userStats?.inactive ?? "-",     icon: UserX,       color: "bg-red-50 text-red-600" },
    { label: "Vues de pages",        value: analytics?.total_views ?? "-",  icon: BarChart2,   color: "bg-indigo-50 text-indigo-600" },
    { label: "Feedbacks reçus",      value: analytics?.total_feedbacks ?? "-", icon: TrendingUp, color: "bg-yellow-50 text-yellow-600" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Admin</h1>
          <p className="text-sm text-gray-500">Vue d'ensemble de la plateforme</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border bg-white p-5 shadow-sm flex items-center gap-4">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.color}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{c.label}</p>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activité récente */}
        <div className="rounded-xl border bg-white overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b">
            <BarChart2 className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-gray-900">Activité récente</span>
          </div>
          <ul className="divide-y">
            {(analytics?.recent_events ?? []).slice(0, 8).map((e) => (
              <li key={e.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="font-medium text-gray-700 capitalize">{e.type.replace("_", " ")}</span>
                <span className="text-gray-400 text-xs">{new Date(e.created_at).toLocaleString("fr-FR")}</span>
              </li>
            ))}
            {!analytics?.recent_events?.length && (
              <li className="px-5 py-8 text-center text-sm text-gray-400">Aucune activité récente</li>
            )}
          </ul>
        </div>

        {/* Vues par jour */}
        <div className="rounded-xl border bg-white overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-gray-900">Vues — 7 derniers jours</span>
          </div>
          <div className="p-5 space-y-3">
            {(analytics?.views_last_7_days ?? []).map((d) => {
              const max = Math.max(...(analytics?.views_last_7_days.map((x) => x.count) ?? [1]), 1);
              return (
                <div key={d.day} className="flex items-center gap-3 text-sm">
                  <span className="w-20 text-gray-400 text-xs">{new Date(d.day).toLocaleDateString("fr-FR")}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(d.count / max) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right font-medium text-gray-700">{d.count}</span>
                </div>
              );
            })}
            {!analytics?.views_last_7_days?.length && (
              <p className="text-center text-sm text-gray-400 py-4">Aucune donnée</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
