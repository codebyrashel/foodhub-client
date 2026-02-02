"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { readCart, clearCart } from "@/lib/cart";
import { createOrder } from "@/lib/orders";
import { getMe } from "@/lib/me";

export default function CheckoutPage() {
  const router = useRouter();

  const [loadingMe, setLoadingMe] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const cart = useMemo(() => readCart(), []);

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        if (me.status === "suspended") {
          router.replace("/suspended");
          return;
        }
        if (me.role !== "customer") {
          router.replace("/forbidden");
          return;
        }
      } catch {
        router.replace("/login");
        return;
      } finally {
        setLoadingMe(false);
      }
    })();
  }, [router]);

  const canPlace = deliveryAddress.trim().length >= 10 && cart.length > 0;

  async function onPlace() {
    setError(null);
    setPlacing(true);
    try {
      const order = await createOrder({
        deliveryAddress,
        items: cart.map((c) => ({ mealId: c.mealId, quantity: c.quantity })),
      });

      clearCart();
      router.push(`/orders/${order.id}`);
    } catch (e: any) {
      setError(e?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  }

  if (loadingMe) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="h-6 w-36 animate-pulse rounded bg-slate-100" />
        <div className="mt-6 h-11 animate-pulse rounded-2xl bg-slate-100" />
        <div className="mt-3 h-11 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-base font-semibold text-slate-900">Nothing to checkout</p>
        <p className="mt-2 text-sm text-slate-600">Your cart is empty.</p>
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
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Checkout</h1>
        <p className="mt-1 text-sm text-slate-600">
          Payment method: <span className="font-semibold">Cash on Delivery</span>
        </p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-2">
          <Label htmlFor="addr">Delivery address</Label>
          <Input
            id="addr"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="House, road, area, city (min 10 chars)"
            minLength={10}
            maxLength={300}
            required
          />
          <p className="text-xs text-slate-500">
            Make sure the address is detailed so the provider can deliver easily.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button loading={placing} disabled={!canPlace} onClick={onPlace}>
            Place order
          </Button>
          <Link
            href="/cart"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Back to cart
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold text-slate-900">Order items</p>
        <p className="mt-1 text-xs text-slate-600">{cart.length} items</p>
      </div>
    </div>
  );
}