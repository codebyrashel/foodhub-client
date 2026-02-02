"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { addToCart } from "@/lib/cart";

export default function AddToCartClient({
  mealId,
  disabled,
}: {
  mealId: string;
  disabled?: boolean;
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function dec() {
    setQty((q) => Math.max(1, q - 1));
    setAdded(false);
  }
  function inc() {
    setQty((q) => Math.min(20, q + 1));
    setAdded(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-2">
        <button
          type="button"
          onClick={dec}
          className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-sm font-bold hover:bg-slate-50"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <div className="text-sm font-semibold text-slate-900">Qty: {qty}</div>
        <button
          type="button"
          onClick={inc}
          className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-sm font-bold hover:bg-slate-50"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <Button
        disabled={disabled}
        className="w-full"
        onClick={() => {
          addToCart(mealId, qty);
          setAdded(true);
        }}
      >
        {disabled ? "Unavailable" : "Add to cart"}
      </Button>

      {added && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Added to cart.{" "}
          <Link href="/cart" className="font-semibold underline">
            View cart
          </Link>
        </div>
      )}
    </div>
  );
}