"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart2, Eye, MessageSquare, TrendingUp } from "lucide-react";
import { analyticsApi, type DashboardStats } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }
    if (user) {
      analyticsApi.dashboard()
        .then(setStats)
        .catch(() => null)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-gray-200 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { icon: Eye,          label: "Vues totales",      value: stats?.total_views ?? 0,     color: "text-blue-600 bg-blue-50" },
    { icon: TrendingUp,   label: "Événements",         value: stats?.total_events ?? 0,    color: "text-green-600 bg-green-50" },
    { icon: MessageSquare,label: "Feedbacks",          value: stats?.total_feedbacks ?? 0, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Bienvenue, {user?.firstName} !</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value.toLocaleString("fr-FR")}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-white overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b font-semibold text-gray-900">
            <BarChart2 className="h-4 w-4 text-blue-600" />
            Activité récente
          </div>
          <ul className="divide-y">
            {stats?.recent_events.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-gray-400">Aucune activité récente</li>
            )}
            {stats?.recent_events.slice(0, 8).map((e) => (
              <li key={e.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-gray-700 font-medium">{e.type}</span>
                <span className="text-gray-400 text-xs">{new Date(e.created_at).toLocaleString("fr-FR")}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border bg-white overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b font-semibold text-gray-900">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Vues des 7 derniers jours
          </div>
          <div className="p-4 space-y-2">
            {stats?.views_last_7_days.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-4">Aucune donnée</p>
            )}
            {stats?.views_last_7_days.map((d) => (
              <div key={d.day} className="flex items-center gap-3 text-sm">
                <span className="w-24 text-gray-500 text-xs">{new Date(d.day).toLocaleDateString("fr-FR")}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.min(100, (d.count / (Math.max(...(stats?.views_last_7_days.map((x) => x.count) ?? [1])) || 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-gray-700 font-medium w-6 text-right">{d.count}</span>
              </div>
            ))}
          </div>
          <div className="border-t px-4 py-3">
            <Link href="/courses" className="text-sm text-blue-600 hover:underline">Explorer les cours →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
