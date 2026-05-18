"use client";
import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Pencil, Trash2, Loader2, UserCheck, UserX } from "lucide-react";
import { adminApi, type User } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";

const ROLE_VARIANT: Record<string, "info" | "success" | "danger"> = {
  student: "info", instructor: "success", admin: "danger",
};
const ROLE_LABEL: Record<string, string> = {
  student: "Apprenant", instructor: "Instructeur", admin: "Admin",
};

const EMPTY_FORM = { email: "", password: "", firstName: "", lastName: "", role: "student" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [selected, setSelected] = useState<User | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    adminApi.listUsers({ page, search: search || undefined })
      .then((data) => { setUsers(data.users); setTotal(data.total); setPages(data.pages); })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setSelected(null);
    setForm(EMPTY_FORM);
    setError("");
    setModal("create");
  }

  function openEdit(u: User) {
    setSelected(u);
    setForm({ email: u.email, password: "", firstName: u.firstName, lastName: u.lastName, role: u.role });
    setError("");
    setModal("edit");
  }

  async function handleSave() {
    setError(""); setSaving(true);
    try {
      if (modal === "create") {
        await adminApi.createUser(form as { email: string; password: string; firstName: string; lastName: string; role: string });
      } else if (selected) {
        const id = selected._id || selected.id || "";
        await adminApi.updateUser(id, { firstName: form.firstName, lastName: form.lastName, role: form.role as User["role"] });
      }
      setModal(null);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(u: User) {
    const id = u._id || u.id || "";
    await adminApi.updateUser(id, { isActive: !u.isActive }).catch(() => null);
    load();
  }

  async function handleDelete(u: User) {
    if (!confirm(`Désactiver le compte de ${u.firstName} ${u.lastName} ?`)) return;
    const id = u._id || u.id || "";
    await adminApi.deleteUser(id).catch(() => null);
    load();
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} utilisateur{total !== 1 ? "s" : ""} au total</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" /> Créer un compte
        </button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Rechercher par nom ou email..."
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full rounded-lg border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Utilisateur", "Email", "Rôle", "Statut", "Créé le", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={6} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-blue-400 mx-auto" /></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-gray-400">Aucun utilisateur trouvé</td></tr>
            ) : users.map((u) => (
              <tr key={u._id || u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-xs flex-shrink-0">
                      {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-900">{u.firstName} {u.lastName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={ROLE_VARIANT[u.role]}>{ROLE_LABEL[u.role]}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={u.isActive !== false ? "success" : "danger"}>
                    {u.isActive !== false ? "Actif" : "Inactif"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString("fr-FR") : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(u)} title="Modifier"
                      className="rounded-lg p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleToggleActive(u)} title={u.isActive !== false ? "Désactiver" : "Activer"}
                      className="rounded-lg p-1.5 hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors">
                      {u.isActive !== false ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </button>
                    <button onClick={() => handleDelete(u)} title="Supprimer"
                      className="rounded-lg p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pages > 1 && (
          <div className="border-t px-4 py-3 flex items-center justify-between text-sm text-gray-500">
            <span>Page {page} sur {pages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border px-3 py-1.5 hover:bg-gray-50 disabled:opacity-40 transition-colors">Précédent</button>
              <button disabled={page === pages} onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border px-3 py-1.5 hover:bg-gray-50 disabled:opacity-40 transition-colors">Suivant</button>
            </div>
          </div>
        )}
      </div>

      <Modal open={modal !== null} onClose={() => setModal(null)}
        title={modal === "create" ? "Créer un compte" : "Modifier l'utilisateur"}>
        <div className="space-y-4">
          {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Prénom</label>
              <input type="text" value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nom</label>
              <input type="text" value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          {modal === "create" && (
            <>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Mot de passe</label>
                <input type="password" value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Rôle</label>
            <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="student">Apprenant</option>
              <option value="instructor">Instructeur</option>
              <option value="admin">Admin</option>
            </select>
          </div>
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
