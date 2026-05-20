"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen, Loader2, Save, ArrowLeft, Plus, Trash2,
  Globe, Lock, CheckCircle, GripVertical, Edit3
} from "lucide-react";
import { instructorApi, coursesApi, type CourseDetail, type Lesson, type Category } from "@/lib/api";
import Link from "next/link";

const LEVELS = [
  { value: "beginner",     label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced",     label: "Avancé" },
];

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [course, setCourse]       = useState<CourseDetail | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [saved, setSaved]         = useState(false);
  const [newLesson, setNewLesson] = useState({ title: "", duration: 30, is_preview: false, content: "" });
  const [addingLesson, setAddingLesson] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);

  useEffect(() => {
    Promise.all([
      instructorApi.getCourse(Number(id)),
      coursesApi.categories(),
    ]).then(([c, cats]) => { setCourse(c); setCategories(cats); })
      .catch(() => router.push("/instructor/courses"))
      .finally(() => setLoading(false));
  }, [id, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!course) return;
    setError(""); setSaving(true); setSaved(false);
    try {
      const updated = await instructorApi.updateCourse(Number(id), {
        title: course.title,
        description: course.description,
        level: course.level,
        category_id: course.category?.id,
        price: Number(course.price),
        is_free: course.is_free,
        is_published: course.is_published,
        thumbnail_url: course.thumbnail_url,
      });
      setCourse((prev) => prev ? { ...prev, ...updated } : prev);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddLesson() {
    if (!newLesson.title.trim()) return;
    setAddingLesson(true);
    try {
      const lesson = await instructorApi.addLesson(Number(id), newLesson);
      setCourse((prev) => prev ? { ...prev, lessons: [...prev.lessons, lesson] } : prev);
      setNewLesson({ title: "", duration: 30, is_preview: false, content: "" });
      setShowLessonForm(false);
    } catch { /* silent */ }
    finally { setAddingLesson(false); }
  }

  async function handleDeleteLesson(lessonId: number) {
    if (!confirm("Supprimer cette leçon ?")) return;
    try {
      await instructorApi.deleteLesson(Number(id), lessonId);
      setCourse((prev) => prev ? { ...prev, lessons: prev.lessons.filter((l) => l.id !== lessonId) } : prev);
    } catch { /* silent */ }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }
  if (!course) return null;

  return (
    <div className="p-8 max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/instructor/courses" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> Retour aux cours
        </Link>
        <Link href={`/courses/${course.id}`}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all"
        >
          <Globe className="h-3.5 w-3.5" /> Voir l'aperçu
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-black text-gray-900 line-clamp-2">{course.title}</h1>
        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
          <Edit3 className="h-3.5 w-3.5" /> Modifier le cours
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${course.is_published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
            {course.is_published ? "Publié" : "Brouillon"}
          </span>
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          <span className="mt-0.5 flex-shrink-0 h-4 w-4 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">!</span>
          {error}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle className="h-4 w-4" /> Modifications enregistrées !
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-900 text-sm">Informations générales</h2>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Titre</label>
            <input type="text" required value={course.title}
              onChange={(e) => setCourse((c) => c ? { ...c, title: e.target.value } : c)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea rows={4} value={course.description ?? ""}
              onChange={(e) => setCourse((c) => c ? { ...c, description: e.target.value } : c)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Niveau</label>
              <select value={course.level}
                onChange={(e) => setCourse((c) => c ? { ...c, level: e.target.value } : c)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Catégorie</label>
              <select value={course.category?.id ?? ""}
                onChange={(e) => {
                  const cat = categories.find((c) => c.id === Number(e.target.value));
                  setCourse((c) => c ? { ...c, category: cat } : c);
                }}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">Sans catégorie</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-900 text-sm">Tarification</h2>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Gratuit", value: true, icon: Globe },
              { label: "Payant",  value: false, icon: Lock },
            ].map((opt) => {
              const Icon = opt.icon;
              const active = course.is_free === opt.value;
              return (
                <button type="button" key={String(opt.value)}
                  onClick={() => setCourse((c) => c ? { ...c, is_free: opt.value, price: opt.value ? 0 : c.price } : c)}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${active ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <Icon className={`h-5 w-5 mb-1 ${active ? "text-emerald-600" : "text-gray-400"}`} />
                  <span className={`text-sm font-bold ${active ? "text-emerald-700" : "text-gray-700"}`}>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {!course.is_free && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Prix (€)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">€</span>
                <input type="number" min="0" step="0.01" value={Number(course.price)}
                  onChange={(e) => setCourse((c) => c ? { ...c, price: Number(e.target.value) } : c)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/80 pl-9 pr-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button type="button"
              onClick={() => setCourse((c) => c ? { ...c, is_published: !c.is_published } : c)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${course.is_published ? "bg-emerald-500" : "bg-gray-200"}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${course.is_published ? "translate-x-5" : "translate-x-0"}`} />
            </button>
            <span className="text-sm font-semibold text-gray-700">{course.is_published ? "Publié" : "Brouillon"}</span>
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white hover:from-emerald-600 hover:to-teal-600 disabled:opacity-60 transition-all shadow-lg shadow-emerald-200"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </form>

      {/* Lessons */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">Leçons</h2>
            <p className="text-xs text-gray-400">{course.lessons.length} leçon(s)</p>
          </div>
          <button type="button" onClick={() => setShowLessonForm((v) => !v)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-bold text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md shadow-emerald-200"
          >
            <Plus className="h-4 w-4" /> Ajouter une leçon
          </button>
        </div>

        {showLessonForm && (
          <div className="border-b border-gray-50 bg-emerald-50/50 p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-800">Nouvelle leçon</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Titre</label>
                <input type="text" value={newLesson.title}
                  onChange={(e) => setNewLesson((l) => ({ ...l, title: e.target.value }))}
                  placeholder="ex: Variables et types Python"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Durée (minutes)</label>
                <input type="number" min="1" value={newLesson.duration}
                  onChange={(e) => setNewLesson((l) => ({ ...l, duration: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Contenu</label>
              <textarea rows={4} value={newLesson.content}
                onChange={(e) => setNewLesson((l) => ({ ...l, content: e.target.value }))}
                placeholder="Contenu textuel de la leçon…"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={newLesson.is_preview}
                  onChange={(e) => setNewLesson((l) => ({ ...l, is_preview: e.target.checked }))}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-400"
                />
                <span className="font-medium">Aperçu gratuit</span>
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={handleAddLesson} disabled={addingLesson || !newLesson.title.trim()}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                >
                  {addingLesson ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  Ajouter
                </button>
                <button type="button" onClick={() => setShowLessonForm(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {course.lessons.length === 0 ? (
          <div className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-200" />
            <p className="text-gray-500 text-sm">Aucune leçon — cliquez sur "Ajouter une leçon"</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {course.lessons.map((lesson, idx) => (
              <li key={lesson.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors group">
                <GripVertical className="h-4 w-4 text-gray-300 flex-shrink-0 cursor-grab" />
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-700 flex-shrink-0">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm line-clamp-1">{lesson.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{lesson.duration} min</span>
                    {lesson.is_preview && (
                      <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-1.5 rounded">Aperçu</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteLesson(lesson.id)}
                  className="opacity-0 group-hover:opacity-100 rounded-xl border border-gray-200 p-2 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all"
                  title="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
