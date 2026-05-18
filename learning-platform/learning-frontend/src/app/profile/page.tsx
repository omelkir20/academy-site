"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Save, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user, login, loading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) { router.push("/auth/login"); return; }
    if (user) setForm({ firstName: user.firstName, lastName: user.lastName, bio: user.bio || "" });
  }, [user, authLoading]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const updated = await authApi.me();
      login(token, { ...updated, ...form });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de mise à jour");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) return null;

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
          <p className="text-gray-500">{user?.email} — <span className="capitalize">{user?.role}</span></p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border shadow-sm p-8 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Modifier mon profil</h2>

        {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>}
        {saved && <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">Profil mis à jour !</div>}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Prénom</label>
            <input type="text" value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Nom</label>
            <input type="text" value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Biographie</label>
          <textarea rows={4} value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="Parlez-nous de vous..."
            className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button type="submit" disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </button>
      </form>
    </div>
  );
}
