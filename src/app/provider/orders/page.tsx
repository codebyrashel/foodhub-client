import { requireRole } from "@/lib/guards";
import { getProviderOrders } from "@/lib/provider-api";
import ProviderOrderCard from "./ui/ProviderOrderCard";

export const dynamic = "force-dynamic";

export default async function ProviderOrdersPage() {
  await requireRole(["provider"]);

  let orders = [];
  let error: string | null = null;

  try {
    orders = await getProviderOrders();
  } catch (e: any) {
    error = e?.message || "Failed to load orders";
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Incoming orders</h1>
        <p className="mt-1 text-sm text-slate-600">
          Update order status to keep customers informed.
        </p>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-base font-semibold text-slate-900">No incoming orders</p>
          <p className="mt-2 text-sm text-slate-600">When customers order, you’ll see them here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((o: any) => (
            <ProviderOrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}