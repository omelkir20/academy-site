"use client";
import { useEffect, useState } from "react";
import {
  BookOpen, Plus, Edit, Eye, Trash2,
  CheckCircle, XCircle, Loader2, Search
} from "lucide-react";
import { instructorApi, type Course } from "@/lib/api";
import { formatPrice, levelLabel } from "@/lib/utils";
import Link from "next/link";

const LEVEL_COLORS: Record<string, string> = {
  beginner:     "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced:     "bg-rose-100 text-rose-700",
};

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    instructorApi.getMyCourses().then(setCourses).catch(() => null).finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Supprimer ce cours définitivement ?")) return;
    setDeleting(id);
    try {
      await instructorApi.deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch { /* silent */ }
    finally { setDeleting(null); }
  }

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Mes cours</h1>
          <p className="text-sm text-gray-500 mt-0.5">{courses.length} cours créés</p>
        </div>
        <Link href="/instructor/courses/new"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-bold text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md shadow-emerald-200"
        >
          <Plus className="h-4 w-4" /> Nouveau cours
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-emerald-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-200" />
            <p className="text-gray-500 mb-4">Aucun cours trouvé</p>
            <Link href="/instructor/courses/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md"
            >
              <Plus className="h-4 w-4" /> Créer votre premier cours
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80">
              <tr>
                {["Cours", "Niveau", "Prix", "Étudiants", "Statut", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <BookOpen className="h-4 w-4 text-white/80" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 line-clamp-1 max-w-[200px]">{c.title}</p>
                        <p className="text-xs text-gray-400">{c.category?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEVEL_COLORS[c.level] ?? "bg-gray-100 text-gray-600"}`}>
                      {levelLabel(c.level)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-semibold ${c.is_free ? "text-emerald-600" : "text-gray-900"}`}>
                      {formatPrice(Number(c.price), c.is_free)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600 font-medium">{c.enrollment_count ?? 0}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.is_published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                      {c.is_published ? <><CheckCircle className="h-3 w-3" /> Publié</> : <><XCircle className="h-3 w-3" /> Brouillon</>}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/courses/${c.id}`}
                        className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                        title="Aperçu"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link href={`/instructor/courses/${c.id}/edit`}
                        className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Link>
                      <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                        className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
                        title="Supprimer"
                      >
                        {deleting === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
