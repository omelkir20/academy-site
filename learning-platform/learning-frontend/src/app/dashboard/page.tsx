"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, CheckCircle, GraduationCap, TrendingUp } from "lucide-react";
import { coursesApi, type Course } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { CourseCard } from "@/components/course/CourseCard";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, levelLabel } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading: authLoading, isAdmin, isInstructor } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Course[]>([]);
  const [recommended, setRecommended] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/auth/login"); return; }
    if (!authLoading && isAdmin) { router.replace("/admin/dashboard"); return; }
    if (!authLoading && isInstructor) { router.replace("/instructor/dashboard"); return; }
  }, [user, authLoading, isAdmin, isInstructor, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      coursesApi.myEnrollments(),
      coursesApi.list({ page: 1 }),
    ]).then(([enrolled, all]) => {
      setEnrollments(enrolled);
      const enrolledIds = new Set(enrolled.map((c) => c.id));
      setRecommended(all.filter((c) => !enrolledIds.has(c.id)).slice(0, 4));
    }).catch(() => null).finally(() => setLoading(false));
  }, [user]);

  if (authLoading || loading) return (
    <div className="container mx-auto px-4 py-10">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="grid grid-cols-3 gap-4">{[1,2,3].map((i) => <div key={i} className="h-28 bg-gray-200 rounded-xl" />)}</div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mon tableau de bord</h1>
        <p className="text-gray-500 mt-1">Bonjour, {user?.firstName} ! Continuez votre apprentissage.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          { icon: BookOpen,      label: "Cours suivis",   value: enrollments.length,                           color: "bg-blue-50 text-blue-600" },
          { icon: CheckCircle,   label: "Terminés",       value: 0,                                            color: "bg-green-50 text-green-600" },
          { icon: TrendingUp,    label: "En cours",       value: enrollments.length,                           color: "bg-purple-50 text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-white p-5 shadow-sm flex items-center gap-4">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* My courses */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Mes cours</h2>
          <Link href="/courses" className="text-sm text-blue-600 hover:underline">Explorer →</Link>
        </div>
        {enrollments.length === 0 ? (
          <div className="rounded-xl border bg-white py-16 text-center text-gray-400">
            <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg mb-2">Aucun cours suivi pour l'instant</p>
            <Link href="/courses" className="text-sm text-blue-600 hover:underline">Découvrir le catalogue</Link>
          </div>
        ) : (
          <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
            <ul className="divide-y">
              {enrollments.map((c) => (
                <li key={c.id}>
                  <Link href={`/courses/${c.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 line-clamp-1">{c.title}</p>
                      <p className="text-xs text-gray-400">{levelLabel(c.level)} · {c.category?.name || "Général"}</p>
                    </div>
                    <Badge variant={c.is_free ? "success" : "info"}>
                      {formatPrice(Number(c.price), c.is_free)}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Recommended */}
      {recommended.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recommandés pour vous</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommended.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        </section>
      )}
    </div>
  );
}
