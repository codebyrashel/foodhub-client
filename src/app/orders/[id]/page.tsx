import CancelOrderClient from "./ui/CencelOrderClient";
import Link from "next/link";
import { requireRole } from "@/lib/guards";
import { getOrder } from "@/lib/orders";
import { formatMoney } from "@/lib/money";
import ReviewMealClient from "./ui/ReviewMealClient";

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

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["customer"]);
  const { id } = await params;

  let order;
  try {
    order = await getOrder(id);
  } catch (e: any) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {e?.message || "Failed to load order"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="font-semibold text-orange-600 hover:text-orange-700" href="/orders">
          ← Back to orders
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Order #{order.id.slice(0, 8)}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <Badge status={order.status} />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">Delivery address</p>
            <p className="mt-2 text-sm text-slate-700">{order.deliveryAddress}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">Total</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{formatMoney(order.totalAmount)}</p>
            <p className="mt-1 text-xs text-slate-500">Cash on Delivery</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-slate-900">Items</p>
          <div className="mt-3 space-y-3">
            {order.items.map((it) => (
              <div key={it.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{it.meal.name}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      Qty: {it.quantity} • Price: {formatMoney(it.priceAtTime)}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {formatMoney(Number(it.priceAtTime) * it.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {order.status === "delivered" && (
          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Leave a review</p>
            <p className="text-xs text-slate-600">
              You can review each meal once. Duplicate reviews will be blocked.
            </p>

            {order.items.map((it) => (
              <ReviewMealClient key={it.id} mealId={it.meal.id} mealName={it.meal.name} />
            ))}
          </div>
        )}

        <div className="mt-6">
          <CancelOrderClient orderId={order.id} status={order.status} />
        </div>
      </div>
    </div>
  );
}