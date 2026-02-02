"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { getMe, type Me } from "@/lib/me";
import { apiFetch } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getMe();
        if (data.status === "suspended") {
          router.replace("/suspended");
          return;
        }
        setMe(data);
        setName(data.name || "");
        setImage(data.image || "");
      } catch {
        router.replace("/login");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function save() {
    setError(null);
    setSaving(true);
    try {
      await apiFetch("/api/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: name.trim().length ? name.trim() : undefined,
          image: image.trim().length ? image.trim() : null,
        }),
      });
      router.refresh();
      const updated = await getMe();
      setMe(updated);
    } catch (e: any) {
      setError(e?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-100" />
        <div className="mt-6 space-y-3">
          <div className="h-11 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-11 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!me) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My profile</h1>
        <p className="mt-1 text-sm text-slate-600">
          Role: <span className="font-semibold">{me.role}</span>
        </p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} minLength={2} />
          </div>

          <div className="space-y-2">
            <Label>Profile image URL (optional)</Label>
            <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
          </div>

          <Button loading={saving} onClick={save}>
            Save changes
          </Button>
        </div>
      </div>

      {/* Provider shortcut */}
      {me.role === "provider" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold text-slate-900">Provider profile</p>
          <p className="mt-1 text-sm text-slate-600">Update restaurant details and cover image.</p>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => router.push("/provider/profile")}>
              Manage provider profile
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}