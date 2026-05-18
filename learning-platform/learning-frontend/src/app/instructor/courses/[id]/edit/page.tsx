"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Eye, EyeOff, Save, ArrowLeft } from "lucide-react";
import { coursesApi, type CourseDetail, type Category, type Lesson } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { formatDuration } from "@/lib/utils";
import Link from "next/link";

const EMPTY_LESSON = { title: "", content: "", duration: 0, is_preview: false };

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ title: "", description: "", level: "beginner", price: "0", is_free: true, category_id: "", thumbnail_url: "" });
  const [saving, setSaving] = useState(false);
  const [lessonModal, setLessonModal] = useState(false);
  const [lessonForm, setLessonForm] = useState(EMPTY_LESSON);
  const [savingLesson, setSavingLesson] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    Promise.all([coursesApi.get(Number(id)), coursesApi.categories()]).then(([c, cats]) => {
      setCourse(c);
      setCategories(cats);
      setForm({
        title: c.title, description: c.description || "",
        level: c.level, price: String(c.price),
        is_free: c.is_free, category_id: String(c.category?.id || ""),
        thumbnail_url: c.thumbnail_url || "",
      });
    }).catch(() => router.push("/instructor/courses"));
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      const updated = await coursesApi.update(Number(id), {
        title: form.title, description: form.description,
        level: form.level, price: parseFloat(form.price) || 0,
        is_free: form.is_free, thumbnail_url: form.thumbnail_url || undefined,
      });
      setCourse((c) => c ? { ...c, ...updated } : c);
      setSuccess("Cours sauvegardé !");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish() {
    const updated = await coursesApi.togglePublish(Number(id)).catch(() => null);
    if (updated) setCourse((c) => c ? { ...c, is_published: updated.is_published } : c);
  }

  async function handleAddLesson() {
    setSavingLesson(true);
    try {
      const lesson = await coursesApi.addLesson(Number(id), lessonForm);
      setCourse((c) => c ? { ...c, lessons: [...c.lessons, lesson] } : c);
      setLessonForm(EMPTY_LESSON);
      setLessonModal(false);
    } catch {
      /* ignore */
    } finally {
      setSavingLesson(false);
    }
  }

  async function handleDeleteLesson(lesson: Lesson) {
    if (!confirm(`Supprimer la leçon "${lesson.title}" ?`)) return;
    await coursesApi.deleteLesson(Number(id), lesson.id).catch(() => null);
    setCourse((c) => c ? { ...c, lessons: c.lessons.filter((l) => l.id !== lesson.id) } : c);
  }

  if (!course) return <div className="p-8 flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>;

  const sortedLessons = [...course.lessons].sort((a, b) => a.position - b.position);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/instructor/courses" className="rounded-lg p-2 hover:bg-gray-200 transition-colors">
            <ArrowLeft className="h-4 w-4 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 line-clamp-1">{course.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant={course.is_published ? "success" : "warning"}>
                {course.is_published ? "Publié" : "Brouillon"}
              </Badge>
            </div>
          </div>
        </div>
        <button onClick={handleTogglePublish}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
            course.is_published
              ? "bg-yellow-50 border border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}>
          {course.is_published ? <><EyeOff className="h-4 w-4" /> Dépublier</> : <><Eye className="h-4 w-4" /> Publier</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Course form */}
        <form onSubmit={handleSave} className="lg:col-span-3 bg-white rounded-xl border shadow-sm p-6 space-y-5 h-fit">
          <h2 className="font-semibold text-gray-900">Informations du cours</h2>
          {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>}
          {success && <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">{success}</div>}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Titre *</label>
            <input type="text" required value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea rows={4} value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Niveau</label>
              <select value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
                className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Catégorie</label>
              <select value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sans catégorie</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.is_free}
              onChange={(e) => setForm((f) => ({ ...f, is_free: e.target.checked, price: e.target.checked ? "0" : f.price }))}
              className="rounded" />
            Cours gratuit
          </label>
          {!form.is_free && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Prix (€)</label>
              <input type="number" min="0.01" step="0.01" value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          )}

          <button type="submit" disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Sauvegarder
          </button>
        </form>

        {/* Lessons */}
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm overflow-hidden h-fit">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <span className="font-semibold text-gray-900">Leçons ({sortedLessons.length})</span>
            <button onClick={() => setLessonModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Ajouter
            </button>
          </div>
          {sortedLessons.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">Aucune leçon ajoutée</div>
          ) : (
            <ul className="divide-y">
              {sortedLessons.map((l, i) => (
                <li key={l.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500 flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{l.title}</p>
                    <p className="text-xs text-gray-400">
                      {formatDuration(l.duration)}
                      {l.is_preview && <span className="ml-2 text-blue-500">· Aperçu</span>}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteLesson(l)}
                    className="rounded-lg p-1 hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Modal open={lessonModal} onClose={() => setLessonModal(false)} title="Ajouter une leçon" size="md">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Titre *</label>
            <input type="text" value={lessonForm.title}
              onChange={(e) => setLessonForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Contenu</label>
            <textarea rows={4} value={lessonForm.content}
              onChange={(e) => setLessonForm((f) => ({ ...f, content: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Durée (secondes)</label>
              <input type="number" min="0" value={lessonForm.duration}
                onChange={(e) => setLessonForm((f) => ({ ...f, duration: parseInt(e.target.value) || 0 }))}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={lessonForm.is_preview}
                  onChange={(e) => setLessonForm((f) => ({ ...f, is_preview: e.target.checked }))}
                  className="rounded" />
                Aperçu gratuit
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setLessonModal(false)}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button onClick={handleAddLesson} disabled={savingLesson || !lessonForm.title}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {savingLesson && <Loader2 className="h-4 w-4 animate-spin" />}
              Ajouter la leçon
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
