"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { getMe } from "@/lib/me";
import { onboardProvider } from "@/lib/provider";

export default function ProviderOnboardingPage() {
  const router = useRouter();

  const [loadingMe, setLoadingMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [restaurantName, setRestaurantName] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [address, setAddress] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  // Ensure user is logged in; if already provider with profile -> redirect
  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();

        if (me.status === "suspended") {
          router.replace("/suspended");
          return;
        }

        if (me.role === "provider" && me.providerProfile) {
          router.replace("/provider/dashboard");
          return;
        }

        // If admin tries to access, block
        if (me.role === "admin") {
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await onboardProvider({
        restaurantName,
        cuisineType,
        address,
        coverImageUrl: coverImageUrl ? coverImageUrl : null,
      });

      router.push("/provider/dashboard");
    } catch (err: any) {
      setError(err?.message || "Onboarding failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingMe) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 h-4 w-72 animate-pulse rounded bg-slate-100" />
        <div className="mt-8 space-y-3">
          <div className="h-11 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-11 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-11 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Become a provider</h1>
        <p className="mt-2 text-sm text-slate-600">
          Add your restaurant profile to start listing meals and receiving orders.
        </p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="restaurantName">Restaurant name</Label>
            <Input
              id="restaurantName"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="e.g., Spice & Sizzle"
              minLength={2}
              maxLength={80}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cuisineType">Cuisine type</Label>
            <Input
              id="cuisineType"
              value={cuisineType}
              onChange={(e) => setCuisineType(e.target.value)}
              placeholder="e.g., Bangla, Indian, Chinese"
              minLength={2}
              maxLength={50}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House, road, area, city"
              minLength={10}
              maxLength={200}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImageUrl">Cover image URL (optional)</Label>
            <Input
              id="coverImageUrl"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
            <p className="text-xs text-slate-500">
              Use a free image URL (Unsplash, Pexels, etc.). You can change later.
            </p>
          </div>

          <Button loading={submitting} type="submit" className="w-full">
            Complete onboarding
          </Button>
        </form>
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white lg:block">
        <div
          className="h-full min-h-[640px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1400&q=80)",
          }}
        />
      </div>
    </div>
  );
}