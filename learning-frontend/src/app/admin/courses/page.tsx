"use client";
import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Pencil, Trash2, Eye, EyeOff, Loader2, BookOpen } from "lucide-react";
import { adminApi, coursesApi, type Course } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, levelLabel } from "@/lib/utils";
import Link from "next/link";

const EMPTY_FORM = { title: "", description: "", level: "beginner", price: "0", is_free: true, category_id: "" };

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [selected, setSelected] = useState<Course | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    adminApi.listAllCourses({ search: search || undefined })
      .then(setCourses)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setSelected(null);
    setForm(EMPTY_FORM);
    setError("");
    setModal("create");
  }

  function openEdit(c: Course) {
    setSelected(c);
    setForm({
      title: c.title, description: c.description || "",
      level: c.level, price: String(c.price),
      is_free: c.is_free, category_id: String(c.category?.id || ""),
    });
    setError("");
    setModal("edit");
  }

  async function handleSave() {
    setError(""); setSaving(true);
    try {
      const data = {
        title: form.title, description: form.description,
        level: form.level, price: parseFloat(form.price) || 0,
        is_free: form.is_free,
        category_id: form.category_id ? parseInt(form.category_id) : undefined,
      };
      if (modal === "create") await coursesApi.create(data);
      else if (selected) await coursesApi.update(selected.id, data);
      setModal(null);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(c: Course) {
    await coursesApi.togglePublish(c.id).catch(() => null);
    load();
  }

  async function handleDelete(c: Course) {
    if (!confirm(`Supprimer définitivement "${c.title}" ?`)) return;
    await coursesApi.delete(c.id).catch(() => null);
    load();
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des cours</h1>
          <p className="text-sm text-gray-500 mt-0.5">{courses.length} cours au total</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" /> Nouveau cours
        </button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Rechercher un cours..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Cours", "Niveau", "Prix", "Statut", "Instructeur", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={6} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-blue-400 mx-auto" /></td></tr>
            ) : courses.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-gray-400">Aucun cours trouvé</td></tr>
            ) : courses.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 flex-shrink-0">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <Link href={`/courses/${c.id}`} className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1">
                        {c.title}
                      </Link>
                      <p className="text-xs text-gray-400">{c.category?.name || "Sans catégorie"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant="default">{levelLabel(c.level)}</Badge></td>
                <td className="px-4 py-3 font-medium">{formatPrice(Number(c.price), c.is_free)}</td>
                <td className="px-4 py-3">
                  <Badge variant={c.is_published ? "success" : "warning"}>
                    {c.is_published ? "Publié" : "Brouillon"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs font-mono">{c.instructor_id.slice(-8)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(c)} title="Modifier"
                      className="rounded-lg p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleTogglePublish(c)} title={c.is_published ? "Dépublier" : "Publier"}
                      className="rounded-lg p-1.5 hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors">
                      {c.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button onClick={() => handleDelete(c)} title="Supprimer"
                      className="rounded-lg p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal !== null} onClose={() => setModal(null)}
        title={modal === "create" ? "Créer un cours" : "Modifier le cours"}>
        <div className="space-y-4">
          {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Titre</label>
            <input type="text" value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea rows={3} value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Niveau</label>
              <select value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Prix (€)</label>
              <input type="number" min="0" step="0.01" value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value, is_free: parseFloat(e.target.value) === 0 }))}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.is_free}
              onChange={(e) => setForm((f) => ({ ...f, is_free: e.target.checked, price: e.target.checked ? "0" : f.price }))}
              className="rounded" />
            Cours gratuit
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(null)}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {modal === "create" ? "Créer" : "Enregistrer"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
