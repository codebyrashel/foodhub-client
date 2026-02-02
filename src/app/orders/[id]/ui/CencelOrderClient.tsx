"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cancelOrder } from "@/lib/orders";

export default function CancelOrderClient({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status !== "placed") return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Need to cancel?</p>
          <p className="mt-1 text-xs text-slate-600">
            Only orders in <span className="font-semibold">placed</span> status can be cancelled.
          </p>
          {error && <p className="mt-2 text-xs font-semibold text-red-700">{error}</p>}
        </div>

        <Button
          loading={loading}
          variant="secondary"
          onClick={async () => {
            setError(null);
            setLoading(true);
            try {
              await cancelOrder(orderId);
              router.refresh();
            } catch (e: any) {
              setError(e?.message || "Failed to cancel order");
            } finally {
              setLoading(false);
            }
          }}
        >
          Cancel order
        </Button>
      </div>
    </div>
  );
}