import { requireRole } from "@/lib/guards";
import { adminGetOrders } from "@/lib/admin-api";

export const dynamic = "force-dynamic";

const statuses = ["", "placed", "preparing", "ready", "delivered", "cancelled"] as const;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireRole(["admin"]);
  const sp = await searchParams;

  const status = typeof sp.status === "string" && sp.status ? (sp.status as any) : undefined;

  let orders;
  let error: any = null;

  try {
    orders = await adminGetOrders(status);
  } catch (e: any) {
    error = e;
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error?.message || "Failed to load orders"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">All orders</h1>
            <p className="mt-1 text-sm text-slate-600">Monitor platform orders by status.</p>
          </div>

          <form action="/admin/orders" className="flex items-center gap-2">
            <select
              name="status"
              defaultValue={status || ""}
              className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s ? s : "All statuses"}
                </option>
              ))}
            </select>
            <button className="h-11 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800">
              Filter
            </button>
          </form>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-base font-semibold text-slate-900">No orders found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Order #{o.id.slice(0, 8)} • {o.status}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {new Date(o.createdAt).toLocaleString()} • {o.items.length} items
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Customer: <span className="font-semibold">{o.customer.name}</span> ({o.customer.email})
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Provider:{" "}
                    <span className="font-semibold">
                      {o.provider.providerProfile?.restaurantName || o.provider.name}
                    </span>
                  </p>
                </div>

                <p className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                  ৳{Number(o.totalAmount).toFixed(2)}
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-700">Delivery address</p>
                <p className="mt-1 text-sm text-slate-800">{o.deliveryAddress}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}