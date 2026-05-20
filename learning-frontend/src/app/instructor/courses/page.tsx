"use client";
import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, BookOpen } from "lucide-react";
import { coursesApi, type Course } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, levelLabel } from "@/lib/utils";
import Link from "next/link";

export default function InstructorCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!user) return;
    const id = user._id || user.id || "";
    setLoading(true);
    coursesApi.listByInstructor(id).then(setCourses).catch(() => null).finally(() => setLoading(false));
  }, [user]);

  useEffect(() => { load(); }, [load]);

  async function handleToggle(c: Course) {
    await coursesApi.togglePublish(c.id).catch(() => null);
    load();
  }

  async function handleDelete(c: Course) {
    if (!confirm(`Supprimer "${c.title}" définitivement ?`)) return;
    await coursesApi.delete(c.id).catch(() => null);
    load();
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes cours</h1>
          <p className="text-sm text-gray-500 mt-0.5">{courses.length} cours</p>
        </div>
        <Link href="/instructor/courses/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" /> Nouveau cours
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>
      ) : courses.length === 0 ? (
        <div className="rounded-xl border bg-white py-20 text-center text-gray-400">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg">Aucun cours créé</p>
          <Link href="/instructor/courses/new" className="mt-4 inline-block text-sm text-blue-600 hover:underline">Créer votre premier cours →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((c) => (
            <div key={c.id} className="rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-white/50" />
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{c.title}</h3>
                  <Badge variant={c.is_published ? "success" : "warning"} className="flex-shrink-0">
                    {c.is_published ? "Publié" : "Brouillon"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{levelLabel(c.level)}</span>
                  <span>·</span>
                  <span className={c.is_free ? "text-green-600 font-medium" : "font-medium"}>
                    {formatPrice(Number(c.price), c.is_free)}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t">
                  <Link href={`/instructor/courses/${c.id}/edit`}
                    className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <Pencil className="h-3.5 w-3.5" /> Modifier
                  </Link>
                  <button onClick={() => handleToggle(c)}
                    className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    {c.is_published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {c.is_published ? "Dépublier" : "Publier"}
                  </button>
                  <button onClick={() => handleDelete(c)}
                    className="ml-auto rounded-lg p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
