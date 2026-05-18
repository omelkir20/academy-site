"use client";
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { coursesApi, type Course, type Category } from "@/lib/api";
import { CourseCard } from "@/components/course/CourseCard";

const LEVELS = [
  { value: "", label: "Tous les niveaux" },
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [isFree, setIsFree] = useState<boolean | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesApi.categories().then(setCategories).catch(() => null);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      coursesApi
        .list({ search: search || undefined, level: level || undefined, category_id: categoryId, is_free: isFree })
        .then(setCourses)
        .catch(() => null)
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search, level, categoryId, isFree]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Catalogue de cours</h1>
        <p className="text-gray-500">Découvrez nos formations et commencez à apprendre dès maintenant.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un cours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>

        <select
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
          className="rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <button
          onClick={() => setIsFree(isFree === true ? undefined : true)}
          className={`flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
            isFree === true ? "bg-green-50 border-green-400 text-green-700" : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Filter className="h-4 w-4" /> Gratuits uniquement
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-white overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg">Aucun cours trouvé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      )}
    </div>
  );
}
