"use client";
import { useEffect, useState } from "react";
import { BookOpen, Users, Eye, TrendingUp, Presentation } from "lucide-react";
import { coursesApi, type Course } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, levelLabel } from "@/lib/utils";
import Link from "next/link";

export default function InstructorDashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const id = user._id || user.id || "";
    coursesApi.listByInstructor(id)
      .then(setCourses)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [user]);

  const totalEnroll = 0;
  const published = courses.filter((c) => c.is_published).length;
  const drafts = courses.filter((c) => !c.is_published).length;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <Presentation className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Instructeur</h1>
          <p className="text-sm text-gray-500">Bonjour, {user?.firstName} !</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { icon: BookOpen,   label: "Total cours",   value: courses.length, color: "bg-blue-50 text-blue-600" },
          { icon: Eye,        label: "Publiés",       value: published,      color: "bg-green-50 text-green-600" },
          { icon: TrendingUp, label: "Brouillons",    value: drafts,         color: "bg-yellow-50 text-yellow-600" },
        ].map((c) => (
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

      <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <span className="font-semibold text-gray-900">Mes cours récents</span>
          <Link href="/instructor/courses" className="text-sm text-blue-600 hover:underline">Voir tout</Link>
        </div>
        {loading ? (
          <div className="py-12 flex justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" /></div>
        ) : courses.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>Aucun cours créé.</p>
            <Link href="/instructor/courses/new" className="mt-3 inline-block text-sm text-blue-600 hover:underline">Créer votre premier cours →</Link>
          </div>
        ) : (
          <ul className="divide-y">
            {courses.slice(0, 5).map((c) => (
              <li key={c.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 flex-shrink-0">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 line-clamp-1">{c.title}</p>
                    <p className="text-xs text-gray-400">{levelLabel(c.level)} · {formatPrice(Number(c.price), c.is_free)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={c.is_published ? "success" : "warning"}>
                    {c.is_published ? "Publié" : "Brouillon"}
                  </Badge>
                  <Link href={`/instructor/courses/${c.id}/edit`} className="text-xs text-blue-600 hover:underline">Modifier</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
