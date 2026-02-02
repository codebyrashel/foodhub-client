"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { readCart, removeFromCart, updateCartQty } from "@/lib/cart";
import { apiFetch } from "@/lib/api";
import { formatMoney } from "@/lib/money";

type MealLite = {
  id: string;
  name: string;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
  provider: { id: string; name: string; providerProfile: any | null };
};

const fallbackImg =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80";

export default function CartPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cart, setCart] = useState(() => readCart());
  const [meals, setMeals] = useState<Record<string, MealLite>>({});

  useEffect(() => {
    setCart(readCart());
  }, []);

  useEffect(() => {
    (async () => {
      setError(null);
      setLoading(true);
      try {
        const ids = readCart().map((i) => i.mealId);
        const unique = Array.from(new Set(ids));
        const fetched = await Promise.all(
          unique.map((id) => apiFetch<MealLite>(`/api/meals/${id}`, { method: "GET" })),
        );
        const map: Record<string, MealLite> = {};
        for (const m of fetched) map[m.id] = m;
        setMeals(map);
      } catch (e: any) {
        setError(e?.message || "Failed to load cart items");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const items = useMemo(() => {
    return cart
      .map((ci) => ({ ...ci, meal: meals[ci.mealId] }))
      .filter((x) => x.meal);
  }, [cart, meals]);

  const total = useMemo(() => {
    return items.reduce((sum, it) => sum + Number(it.meal.price) * it.quantity, 0);
  }, [items]);

  const providerId = useMemo(() => {
    const ids = new Set(items.map((it) => it.meal.provider.id));
    return ids.size === 1 ? items[0]?.meal.provider.id : null;
  }, [items]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="h-6 w-32 animate-pulse rounded bg-slate-100" />
        <div className="mt-6 space-y-3">
          <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-base font-semibold text-slate-900">Your cart is empty</p>
        <p className="mt-2 text-sm text-slate-600">Browse meals and add your favorites.</p>
        <div className="mt-6">
          <Link
            href="/meals"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Browse meals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Your cart</h1>
          <p className="mt-1 text-sm text-slate-600">
            Orders must be from a single provider.
          </p>
        </div>

        {providerId === null && (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
            Your cart contains items from multiple providers. Please keep items from a single provider to checkout.
          </div>
        )}

        {items.map((it) => (
          <div key={it.mealId} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="flex gap-4 p-4">
              <div
                className="h-20 w-24 shrink-0 rounded-2xl bg-cover bg-center"
                style={{ backgroundImage: `url(${it.meal.imageUrl || fallbackImg})` }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{it.meal.name}</p>
                <p className="mt-1 text-xs text-slate-600">{formatMoney(it.meal.price)}</p>

                {!it.meal.isAvailable && (
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    This meal is currently unavailable.
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    className="h-9 w-9 rounded-xl border border-slate-200 hover:bg-slate-50"
                    onClick={() => {
                      const next = updateCartQty(it.mealId, it.quantity - 1);
                      setCart(next);
                    }}
                    aria-label="Decrease"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold">Qty: {it.quantity}</span>
                  <button
                    className="h-9 w-9 rounded-xl border border-slate-200 hover:bg-slate-50"
                    onClick={() => {
                      const next = updateCartQty(it.mealId, it.quantity + 1);
                      setCart(next);
                    }}
                    aria-label="Increase"
                  >
                    +
                  </button>

                  <button
                    className="ml-auto rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => {
                      const next = removeFromCart(it.mealId);
                      setCart(next);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-base font-semibold text-slate-900">Summary</p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600">Items</span>
            <span className="font-semibold text-slate-900">{items.length}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-slate-600">Total</span>
            <span className="font-bold text-slate-900">{formatMoney(total)}</span>
          </div>

          <div className="mt-5 space-y-2">
            <Link
              href={providerId ? "/checkout" : "#"}
              aria-disabled={providerId ? undefined : true}
              className={`inline-flex h-11 w-full items-center justify-center rounded-2xl px-5 text-sm font-semibold ${
                providerId
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "cursor-not-allowed bg-slate-200 text-slate-500"
              }`}
            >
              Proceed to checkout
            </Link>

            <Link
              href="/meals"
              className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Continue shopping
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Cash on Delivery only. Provider will update order status after placement.
          </p>
        </div>
      </div>
    </div>
  );
}