import { requireRole } from "@/lib/guards";

export default async function ProviderDashboardPage() {
  await requireRole(["provider"]);
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
      <h1 className="text-2xl font-bold">Provider dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">
        Next: menu management, incoming orders, and status updates.
      </p>
    </div>
  );
}