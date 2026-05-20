"use client";
import { useEffect, useState } from "react";
import {
  Users, BookOpen, TrendingUp, DollarSign,
  Activity, Sparkles, ArrowRight, BarChart3, Shield
} from "lucide-react";
import { adminApi } from "@/lib/api";

interface Stats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  revenue: number;
  newUsersThisMonth?: number;
  activeUsers?: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.stats()
      .then((s) => setStats({
        totalUsers: s.total,
        totalCourses: 0,
        totalEnrollments: 0,
        revenue: 0,
        activeUsers: s.active,
        newUsersThisMonth: undefined,
      }))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const STATS_CARDS = stats ? [
    { icon: Users,        label: "Total utilisateurs",   value: stats.totalUsers,       gradient: "from-sky-400 to-cyan-500",     shadow: "shadow-sky-100",     sub: stats.newUsersThisMonth ? `+${stats.newUsersThisMonth} ce mois` : undefined },
    { icon: BookOpen,     label: "Total cours",          value: stats.totalCourses,     gradient: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-100", sub: "Dans le catalogue" },
    { icon: TrendingUp,   label: "Inscriptions",         value: stats.totalEnrollments, gradient: "from-violet-400 to-purple-500", shadow: "shadow-violet-100", sub: "Total des inscriptions" },
    { icon: DollarSign,   label: "Revenus",              value: `${stats.revenue.toFixed(0)} €`, gradient: "from-amber-400 to-orange-500", shadow: "shadow-amber-100", sub: "Cumul total" },
  ] : [];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-0.5 text-sm flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            Vue d'ensemble de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          <Shield className="h-4 w-4" /> Administrateur
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS_CARDS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-lg hover:shadow-gray-200/60 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} shadow-md ${s.shadow}`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full font-medium">{s.sub}</span>
              </div>
              <p className="text-3xl font-black text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {[
          { href: "/admin/courses",   icon: BookOpen,  title: "Gérer les cours",       desc: "Créer, modifier ou supprimer des cours", gradient: "from-emerald-400 to-teal-500" },
          { href: "/admin/users",     icon: Users,     title: "Gérer les utilisateurs", desc: "Voir et modérer les comptes",            gradient: "from-sky-400 to-cyan-500" },
          { href: "/admin/analytics", icon: BarChart3, title: "Voir les analytiques",  desc: "Trafic, inscriptions, revenus",          gradient: "from-violet-400 to-purple-500" },
        ].map((a) => (
          <a key={a.href} href={a.href}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all group cursor-pointer"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${a.gradient} flex-shrink-0 shadow-md group-hover:-translate-y-0.5 transition-transform`}>
              <a.icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm">{a.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{a.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
