"use client";
import { useState, useEffect } from "react";
import { Search, Filter, X, BookOpen, SlidersHorizontal } from "lucide-react";
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
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  const activeFilters = [level, categoryId, isFree !== undefined ? "gratuit" : ""].filter(Boolean);
  const hasFilters = activeFilters.length > 0;

  function clearFilters() {
    setLevel("");
    setCategoryId(undefined);
    setIsFree(undefined);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Catalogue de cours
          </h1>
          <p className="text-gray-500">
            {loading ? "Chargement…" : `${courses.length} cours disponibles`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter bar */}
        <div className="bg-white rounded-2xl border shadow-sm p-4 mb-8">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un cours…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Level */}
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>

            {/* Category */}
            <select
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Toutes catégories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            {/* Free toggle */}
            <button
              onClick={() => setIsFree(isFree === true ? undefined : true)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                isFree === true
                  ? "border-green-400 bg-green-50 text-green-700 shadow-sm"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-white"
              }`}
            >
              <Filter className="h-4 w-4" />
              Gratuits uniquement
            </button>

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
              >
                <X className="h-4 w-4" /> Effacer les filtres
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border bg-white overflow-hidden">
                <div className="h-44 bg-gradient-to-br from-gray-200 to-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-200 rounded-full w-1/4" />
                  <div className="h-4 bg-gray-200 rounded-full" />
                  <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-20 w-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <BookOpen className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Aucun cours trouvé</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-sm">
              Essayez d'ajuster vos filtres ou de chercher avec d'autres mots-clés.
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4 font-medium">
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
