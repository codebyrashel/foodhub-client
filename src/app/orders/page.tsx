import { requireRole } from "@/lib/guards";

export default async function OrdersPage() {
  await requireRole(["customer"]);
  return <div className="rounded-2xl border border-slate-200 bg-white p-6">My Orders (protected)</div>;
}