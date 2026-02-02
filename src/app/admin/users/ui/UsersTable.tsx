"use client";

import { useMemo, useState } from "react";
import { adminUpdateUserStatus, type AdminUser } from "@/lib/admin-api";
import { Button } from "@/components/ui/Button";

export default function UsersTable({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter(
      (u) => u.email.toLowerCase().includes(s) || u.name.toLowerCase().includes(s),
    );
  }, [users, q]);

  async function toggleStatus(u: AdminUser) {
    setError(null);
    setLoadingId(u.id);
    try {
      const nextStatus = u.status === "active" ? "suspended" : "active";
      const updated = await adminUpdateUserStatus(u.id, nextStatus);
      setUsers((prev) => prev.map((x) => (x.id === updated.id ? { ...x, status: updated.status } : x)));
    } catch (e: any) {
      setError(e?.message || "Failed to update user");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Users</h1>
        <p className="mt-1 text-sm text-slate-600">Suspend or activate customer/provider accounts.</p>

        <div className="mt-5">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or email..."
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
          />
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Verified</th>
                <th className="px-5 py-4">Created</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-slate-200/70">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{u.name}</p>
                    <p className="text-xs text-slate-600">{u.email}</p>
                    {u.providerProfile?.restaurantName && (
                      <p className="mt-1 text-xs text-slate-500">
                        Provider: {u.providerProfile.restaurantName}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{u.role}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        u.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold ${u.emailVerified ? "text-emerald-700" : "text-slate-500"}`}>
                      {u.emailVerified ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-600">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {u.role === "admin" ? (
                      <span className="text-xs font-semibold text-slate-500">Protected</span>
                    ) : (
                      <Button
                        loading={loadingId === u.id}
                        variant="secondary"
                        onClick={() => toggleStatus(u)}
                      >
                        {u.status === "active" ? "Suspend" : "Activate"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}