"use client";

import { useState } from "react";
import { addToCart, readCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";

export default function AddProviderMealToCart({
  providerId,
  mealId,
}: {
  providerId: string;
  mealId: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  async function handleAdd() {
    setError(null);
    setAdded(false);

    // If cart has items, ensure all are from same provider
    const cart = readCart();
    if (cart.length > 0) {
      try {
        // check first cart item provider by fetching its meal
        const first = await apiFetch<any>(`/api/meals/${cart[0].mealId}`, { method: "GET" });
        if (first.provider?.id !== providerId) {
          setError("Your cart has items from another provider. Please checkout or clear cart first.");
          return;
        }
      } catch {
        // if fetch fails, still allow adding (fallback)
      }
    }

    addToCart(mealId, 1);
    setAdded(true);
  }

  return (
    <div className="text-right">
      <Button variant="secondary" onClick={handleAdd} className="h-9 px-4 text-xs">
        Add
      </Button>
      {added && <p className="mt-1 text-[11px] font-semibold text-emerald-700">Added</p>}
      {error && <p className="mt-1 text-[11px] font-semibold text-red-700">{error}</p>}
    </div>
  );
}