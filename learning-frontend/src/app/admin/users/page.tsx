"use client";
import { useEffect, useState } from "react";
import { Users, Search, Shield, GraduationCap, Presentation, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { adminApi, type User } from "@/lib/api";

const ROLE_STYLES: Record<string, { label: string; cls: string; icon: typeof Shield }> = {
  admin:      { label: "Admin",       cls: "bg-rose-100 text-rose-700",    icon: Shield },
  instructor: { label: "Instructeur", cls: "bg-violet-100 text-violet-700", icon: Presentation },
  student:    { label: "Apprenant",   cls: "bg-emerald-100 text-emerald-700", icon: GraduationCap },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    adminApi.listUsers().then((res) => setUsers(res.users)).catch(() => null).finally(() => setLoading(false));
  }, []);

  async function toggleStatus(userId: string, current: boolean) {
    setToggling(userId);
    try {
      await adminApi.updateUser(userId, { isActive: !current });
      setUsers((prev) => prev.map((u) => (u._id ?? u.id) === userId ? { ...u, isActive: !current } : u));
    } catch { /* silent */ }
    finally { setToggling(null); }
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.email.toLowerCase().includes(q) || u.firstName?.toLowerCase().includes(q) || u.lastName?.toLowerCase().includes(q);
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Utilisateurs</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} comptes enregistrés</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un utilisateur…"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-gray-700"
          >
            <option value="">Tous les rôles</option>
            <option value="student">Apprenants</option>
            <option value="instructor">Instructeurs</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-200" />
            <p className="text-gray-500">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80">
              <tr>
                {["Utilisateur", "Rôle", "Date d'inscription", "Statut", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u) => {
                const role = ROLE_STYLES[u.role] ?? ROLE_STYLES.student;
                const RoleIcon = role.icon;
                const initials = `${u.firstName?.charAt(0) ?? ""}${u.lastName?.charAt(0) ?? ""}`.toUpperCase() || u.email.charAt(0).toUpperCase();
                return (
                  <tr key={u._id ?? u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${role.cls}`}>
                        <RoleIcon className="h-3 w-3" /> {role.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${u.isActive !== false ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {u.isActive !== false ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleStatus(u._id ?? u.id ?? "", u.isActive !== false)}
                        disabled={toggling === (u._id ?? u.id)}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                          u.isActive !== false
                            ? "border-red-200 text-red-500 hover:bg-red-50"
                            : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        } disabled:opacity-40`}
                      >
                        {toggling === (u._id ?? u.id) ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : u.isActive !== false ? (
                          <><ToggleRight className="h-3.5 w-3.5" /> Désactiver</>
                        ) : (
                          <><ToggleLeft className="h-3.5 w-3.5" /> Activer</>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
