import Link from "next/link";
import { requireRole } from "@/lib/guards";
import { getMyOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    placed: "bg-slate-100 text-slate-700",
    preparing: "bg-amber-50 text-amber-700",
    ready: "bg-blue-50 text-blue-700",
    delivered: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-700",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${map[status] || "bg-slate-100"}`}>
      {status}
    </span>
  );
}

export default async function OrdersPage() {
  await requireRole(["customer"]);

  let orders = [];
  let error: string | null = null;

  try {
    orders = await getMyOrders();
  } catch (e: any) {
    error = e?.message || "Failed to load orders";
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">My orders</h1>
            <p className="mt-1 text-sm text-slate-600">Track your delivery status and order history.</p>
          </div>
          <Link className="text-sm font-semibold text-orange-600 hover:text-orange-700" href="/meals">
            Order more →
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-base font-semibold text-slate-900">No orders yet</p>
          <p className="mt-2 text-sm text-slate-600">Place your first order to start tracking.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((o: any) => (
            <Link
              key={o.id}
              href={`/orders/${o.id}`}
              className="rounded-3xl border border-slate-200 bg-white p-5 transition hover:shadow-sm"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Order #{o.id.slice(0, 8)}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge status={o.status} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="rounded-full border border-slate-200 px-3 py-1">
                  {o.items.length} items
                </span>
                {o.provider?.providerProfile?.restaurantName && (
                  <span className="rounded-full border border-slate-200 px-3 py-1">
                    {o.provider.providerProfile.restaurantName}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}