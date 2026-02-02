"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { getMe } from "@/lib/me";
import { getProviderProfile, updateProviderProfile } from "@/lib/provider-api";

export default function ProviderProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [restaurantName, setRestaurantName] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [address, setAddress] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        if (me.status === "suspended") {
          router.replace("/suspended");
          return;
        }
        if (me.role !== "provider") {
          router.replace("/forbidden");
          return;
        }

        const p = await getProviderProfile();
        setRestaurantName(p.restaurantName);
        setCuisineType(p.cuisineType);
        setAddress(p.address);
        setCoverImageUrl(p.coverImageUrl || "");
      } catch (e: any) {
        const msg = e?.message || "";
        if (msg.toLowerCase().includes("unauthorized")) router.replace("/login");
        else setError(e?.message || "Failed to load provider profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function save() {
    setError(null);
    setSaving(true);
    try {
      await updateProviderProfile({
        restaurantName: restaurantName.trim(),
        cuisineType: cuisineType.trim(),
        address: address.trim(),
        coverImageUrl: coverImageUrl.trim() ? coverImageUrl.trim() : null,
      });

      router.refresh();
      router.push("/provider/dashboard");
    } catch (e: any) {
      setError(e?.message || "Failed to update provider profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="h-6 w-56 animate-pulse rounded bg-slate-100" />
        <div className="mt-6 space-y-3">
          <div className="h-11 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-11 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-11 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Provider profile</h1>
      <p className="mt-2 text-sm text-slate-600">Update your restaurant details shown to customers.</p>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label>Restaurant name</Label>
          <Input value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Cuisine type</Label>
          <Input value={cuisineType} onChange={(e) => setCuisineType(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Address</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Cover image URL (optional)</Label>
          <Input value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} />
        </div>

        <Button loading={saving} onClick={save}>
          Save provider profile
        </Button>
      </div>
    </div>
  );
}