"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen, Loader2, Save, ArrowLeft, Globe, Lock,
  DollarSign, Tag, AlignLeft
} from "lucide-react";
import { instructorApi, coursesApi, type Category } from "@/lib/api";
import Link from "next/link";

const LEVELS = [
  { value: "beginner",     label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced",     label: "Avancé" },
];

export default function NewCoursePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "", description: "", level: "beginner",
    category_id: "", price: "0", is_free: true, is_published: false, thumbnail_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    coursesApi.categories().then(setCategories).catch(() => null);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Le titre est obligatoire."); return; }
    setError(""); setLoading(true);
    try {
      const course = await instructorApi.createCourse({
        title: form.title,
        description: form.description,
        level: form.level,
        price: Number(form.price),
        is_free: form.is_free,
        is_published: form.is_published,
        thumbnail_url: form.thumbnail_url,
        category_id: form.category_id ? Number(form.category_id) : undefined,
      });
      router.push(`/instructor/courses/${course.id}/edit`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  }

  const Field = ({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}{sub && <span className="text-gray-400 font-normal ml-1">{sub}</span>}</label>
      {children}
    </div>
  );

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/instructor/courses" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-colors group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> Retour aux cours
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Créer un nouveau cours</h1>
        <p className="text-sm text-gray-500 mt-0.5">Remplissez les informations de base. Vous pourrez ajouter les leçons ensuite.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
            <span className="mt-0.5 flex-shrink-0 h-4 w-4 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">!</span>
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
            <AlignLeft className="h-4 w-4 text-emerald-600" /> Informations générales
          </h2>

          <Field label="Titre du cours">
            <input type="text" required value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="ex: Introduction à Kubernetes"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
            />
          </Field>

          <Field label="Description" sub="(optionnel)">
            <textarea rows={4} value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Décrivez le contenu et les objectifs du cours…"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 resize-none"
            />
          </Field>

          <Field label="Image de couverture" sub="URL (optionnel)">
            <input type="url" value={form.thumbnail_url}
              onChange={(e) => setForm((f) => ({ ...f, thumbnail_url: e.target.value }))}
              placeholder="https://…"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
            />
          </Field>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
            <Tag className="h-4 w-4 text-emerald-600" /> Classification
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Niveau">
              <select value={form.level}
                onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              >
                {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </Field>

            <Field label="Catégorie">
              <select value={form.category_id}
                onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              >
                <option value="">Sans catégorie</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-emerald-600" /> Tarification & Publication
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Gratuit",  value: true,  icon: Globe, desc: "Accessible à tous" },
              { label: "Payant",   value: false, icon: DollarSign, desc: "Prix personnalisé" },
            ].map((opt) => {
              const Icon = opt.icon;
              const active = form.is_free === opt.value;
              return (
                <button type="button" key={String(opt.value)}
                  onClick={() => setForm((f) => ({ ...f, is_free: opt.value, price: opt.value ? "0" : f.price }))}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${active ? "border-emerald-400 bg-emerald-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}
                >
                  <Icon className={`h-5 w-5 mb-2 ${active ? "text-emerald-600" : "text-gray-400"}`} />
                  <span className={`text-sm font-bold block ${active ? "text-emerald-700" : "text-gray-700"}`}>{opt.label}</span>
                  <span className="text-xs text-gray-400">{opt.desc}</span>
                </button>
              );
            })}
          </div>

          {!form.is_free && (
            <Field label="Prix (€)">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">€</span>
                <input type="number" min="0" step="0.01" value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/80 pl-9 pr-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                />
              </div>
            </Field>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button type="button"
              onClick={() => setForm((f) => ({ ...f, is_published: !f.is_published }))}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${form.is_published ? "bg-emerald-500" : "bg-gray-200"}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${form.is_published ? "translate-x-5" : "translate-x-0"}`} />
            </button>
            <div>
              <span className="text-sm font-semibold text-gray-700">
                {form.is_published ? <><Globe className="inline h-3.5 w-3.5 text-emerald-600 mr-1" />Publié</> : <><Lock className="inline h-3.5 w-3.5 text-gray-400 mr-1" />Brouillon</>}
              </span>
              <p className="text-xs text-gray-400">{form.is_published ? "Visible pour tous les apprenants" : "Non visible publiquement"}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pb-8">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white hover:from-emerald-600 hover:to-teal-600 disabled:opacity-60 transition-all shadow-lg shadow-emerald-200"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {loading ? "Création…" : "Créer le cours"}
          </button>
          <Link href="/instructor/courses"
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
