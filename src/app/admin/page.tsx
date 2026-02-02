import { requireRole } from "@/lib/guards";

export default async function AdminPage() {
  await requireRole(["admin"]);
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
      <h1 className="text-2xl font-bold">Admin dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">
        Next: users management, categories CRUD, and orders overview.
      </p>
    </div>
  );
}