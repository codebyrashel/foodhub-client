"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/money";
import { updateOrderStatus } from "@/lib/provider-api";

function badgeClass(status: string) {
  const map: Record<string, string> = {
    placed: "bg-slate-100 text-slate-700",
    preparing: "bg-amber-50 text-amber-700",
    ready: "bg-blue-50 text-blue-700",
    delivered: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-700",
  };
  return map[status] || "bg-slate-100 text-slate-700";
}

export default function ProviderOrderCard({ order }: { order: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actions: Array<{ label: string; status: "preparing" | "ready" | "delivered"; show: boolean }> =
    [
      { label: "Mark preparing", status: "preparing", show: order.status === "placed" },
      { label: "Mark ready", status: "ready", show: order.status === "preparing" },
      { label: "Mark delivered", status: "delivered", show: order.status === "ready" },
    ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Order #{order.id.slice(0, 8)}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {new Date(order.createdAt).toLocaleString()} • {order.items.length} items
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Customer: <span className="font-semibold">{order.customer?.name}</span> • {order.customer?.email}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(order.status)}`}>
            {order.status}
          </span>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            {formatMoney(order.totalAmount)}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold text-slate-700">Delivery address</p>
        <p className="mt-1 text-sm text-slate-800">{order.deliveryAddress}</p>
      </div>

      {error && (
        <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {actions.filter((a) => a.show).map((a) => (
          <Button
            key={a.status}
            loading={loading}
            onClick={async () => {
              setError(null);
              setLoading(true);
              try {
                await updateOrderStatus(order.id, a.status);
                router.refresh();
              } catch (e: any) {
                setError(e?.message || "Failed to update status");
              } finally {
                setLoading(false);
              }
            }}
          >
            {a.label}
          </Button>
        ))}

        {actions.every((a) => !a.show) && (
          <p className="text-sm font-semibold text-slate-600">
            No actions available for this status.
          </p>
        )}
      </div>
    </div>
  );
}