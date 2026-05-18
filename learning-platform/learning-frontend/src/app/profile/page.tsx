"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Save, Loader2, Mail, ShieldCheck, GraduationCap, Presentation } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/Badge";

const ROLE_INFO: Record<string, { label: string; icon: typeof User; variant: "info" | "success" | "danger" }> = {
  student:    { label: "Apprenant",    icon: GraduationCap, variant: "info" },
  instructor: { label: "Instructeur",  icon: Presentation,  variant: "success" },
  admin:      { label: "Administrateur", icon: ShieldCheck, variant: "danger" },
};

export default function ProfilePage() {
  const { user, login, loading: authLoading, updateUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) { router.push("/auth/login"); return; }
    if (user) setForm({ firstName: user.firstName, lastName: user.lastName, bio: user.bio || "" });
  }, [user, authLoading, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const updated = await authApi.updateProfile({ firstName: form.firstName, lastName: form.lastName, bio: form.bio });
      updateUser({ ...user!, ...updated });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de mise à jour");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || !user) return null;

  const role = ROLE_INFO[user.role] || ROLE_INFO.student;
  const RoleIcon = role.icon;
  const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`;

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      {/* Profile header */}
      <div className="rounded-2xl border bg-gradient-to-br from-blue-600 to-indigo-700 p-6 mb-6 text-white">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="h-3.5 w-3.5 opacity-70" />
              <span className="text-sm opacity-80">{user.email}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <RoleIcon className="h-3.5 w-3.5 opacity-70" />
              <Badge variant={role.variant} className="text-xs">{role.label}</Badge>
            </div>
          </div>
        </div>
        {user.bio && <p className="mt-4 text-sm text-white/70 italic">"{user.bio}"</p>}
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" /> Modifier mon profil
        </h2>

        {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>}
        {saved && <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">Profil mis à jour avec succès !</div>}

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
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={user.email} disabled
            className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Biographie</label>
          <textarea rows={4} value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="Parlez-nous de vous, vos compétences, vos objectifs..."
            className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Rôle</label>
          <div className="flex items-center gap-2 rounded-lg border bg-gray-50 px-4 py-2.5">
            <RoleIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">{role.label}</span>
            <span className="text-xs text-gray-400 ml-auto">Non modifiable</span>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
