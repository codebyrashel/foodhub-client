"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { apiFetch } from "@/lib/api";
import { getCategories, type Category } from "@/lib/categories";

type Mode = "create" | "edit";

type MealFormData = {
  categoryId: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  isAvailable: boolean;
};

export default function MealForm({ mode, mealId }: { mode: Mode; mealId?: string }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<MealFormData>({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    isAvailable: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);

        if (mode === "edit" && mealId) {
          const meal = await apiFetch<any>(`/api/meals/${mealId}`, { method: "GET" });
          setForm({
            categoryId: meal.category?.id || "",
            name: meal.name || "",
            description: meal.description || "",
            price: String(meal.price ?? ""),
            imageUrl: meal.imageUrl || "",
            isAvailable: Boolean(meal.isAvailable),
          });
        } else {
          // preselect first category if available
          if (cats[0]) setForm((f) => ({ ...f, categoryId: cats[0].id }));
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load form data");
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, mealId]);

  const canSave = useMemo(() => {
    return (
      form.categoryId &&
      form.name.trim().length >= 2 &&
      Number(form.price) > 0
    );
  }, [form]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const payload = {
        categoryId: form.categoryId,
        name: form.name,
        description: form.description ? form.description : null,
        price: Number(form.price),
        imageUrl: form.imageUrl ? form.imageUrl : null,
        isAvailable: form.isAvailable,
      };

      if (mode === "create") {
        await apiFetch("/api/provider/meals", { method: "POST", body: JSON.stringify(payload) });
      } else {
        await apiFetch(`/api/provider/meals/${mealId}`, { method: "PUT", body: JSON.stringify(payload) });
      }

      router.push("/provider/menu");
      router.refresh();
    } catch (e: any) {
      setError(e?.message || "Failed to save meal");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!mealId) return;
    const ok = confirm("Delete this meal? This cannot be undone.");
    if (!ok) return;

    setError(null);
    setSaving(true);
    try {
      await apiFetch(`/api/provider/meals/${mealId}`, { method: "DELETE" });
      router.push("/provider/menu");
      router.refresh();
    } catch (e: any) {
      setError(e?.message || "Failed to delete meal");
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
          <div className="h-11 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        {mode === "create" ? "Add new meal" : "Edit meal"}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Keep your menu fresh—availability and price affect ordering.
      </p>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSave} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Meal name</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g., Chicken Biryani"
            required
            minLength={2}
            maxLength={80}
          />
        </div>

        <div className="space-y-2">
          <Label>Description (optional)</Label>
          <Input
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Short description (max 500 chars)"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Price</Label>
            <Input
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              type="number"
              min={1}
              step="0.01"
              placeholder="e.g., 250"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Image URL (optional)</Label>
            <Input
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://..."
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))}
          />
          Available for ordering
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button loading={saving} disabled={!canSave} type="submit">
            {mode === "create" ? "Create meal" : "Save changes"}
          </Button>

          {mode === "edit" ? (
            <Button loading={saving} type="button" variant="secondary" onClick={onDelete}>
              Delete meal
            </Button>
          ) : (
            <Button type="button" variant="secondary" onClick={() => router.push("/provider/menu")}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}