"use client";
import { useState, useEffect } from "react";
import { Search, Filter, X, BookOpen, SlidersHorizontal, Sparkles } from "lucide-react";
import { coursesApi, type Course, type Category } from "@/lib/api";
import { CourseCard } from "@/components/course/CourseCard";

const LEVELS = [
  { value: "",             label: "Tous les niveaux" },
  { value: "beginner",     label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced",     label: "Avancé" },
];

export default function CoursesPage() {
  const [courses, setCourses]       = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch]         = useState("");
  const [level, setLevel]           = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [isFree, setIsFree]         = useState<boolean | undefined>();
  const [loading, setLoading]       = useState(true);

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

  const hasFilters = !!(level || categoryId || isFree !== undefined);

  function clearFilters() {
    setLevel("");
    setCategoryId(undefined);
    setIsFree(undefined);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-25" />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]" />
        <div className="container mx-auto px-4 py-14 relative">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-4">
            <Sparkles className="h-3 w-3" /> Catalogue complet
          </span>
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            Catalogue de cours
          </h1>
          <p className="text-gray-400">
            {loading ? "Chargement…" : `${courses.length} cours disponibles`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8 sticky top-16 z-10">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un cours…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-gray-700"
            >
              {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>

            <select
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-gray-700"
            >
              <option value="">Toutes catégories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <button
              onClick={() => setIsFree(isFree === true ? undefined : true)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                isFree === true
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-white hover:border-gray-300"
              }`}
            >
              <Filter className="h-4 w-4" />
              Gratuits uniquement
            </button>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-100 transition-colors"
              >
                <X className="h-4 w-4" /> Effacer
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border bg-white overflow-hidden">
                <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-100 rounded-full w-1/4" />
                  <div className="h-4 bg-gray-100 rounded-full" />
                  <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="h-20 w-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
              <BookOpen className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Aucun cours trouvé</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-sm">
              Essayez d'ajuster vos filtres ou de chercher avec d'autres mots-clés.
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md shadow-emerald-200"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-5 font-medium">
              {courses.length} cours {hasFilters ? "correspondent à votre recherche" : "disponibles"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
