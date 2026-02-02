"use client";

import { useMemo, useState } from "react";
import type { Category } from "@/lib/categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { adminCreateCategory, adminDeleteCategory, adminUpdateCategory } from "@/lib/admin-api";

export default function CategoriesAdminClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const sorted = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  async function create() {
    setError(null);
    setLoading(true);
    try {
      const created: any = await adminCreateCategory({
        name,
        imageUrl: imageUrl ? imageUrl : null,
      });
      setCategories((prev) => [created, ...prev]);
      setName("");
      setImageUrl("");
    } catch (e: any) {
      setError(e?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  }

  async function rename(id: string, nextName: string) {
    setError(null);
    setLoading(true);
    try {
      const updated: any = await adminUpdateCategory(id, { name: nextName });
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (e: any) {
      setError(e?.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    const ok = confirm("Delete this category? This cannot be undone.");
    if (!ok) return;
    setError(null);
    setLoading(true);
    try {
      await adminDeleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (e: any) {
      setError(e?.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Categories</h1>
        <p className="mt-1 text-sm text-slate-600">Create and manage cuisine categories.</p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="md:col-span-1 space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Bangla" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label>Image URL (optional)</Label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="md:col-span-3">
            <Button loading={loading} onClick={create} disabled={name.trim().length < 2}>
              Create category
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {sorted.map((c) => (
          <CategoryRow key={c.id} c={c} loading={loading} onRename={rename} onRemove={remove} />
        ))}
      </div>
    </div>
  );
}

function CategoryRow({
  c,
  loading,
  onRename,
  onRemove,
}: {
  c: Category;
  loading: boolean;
  onRename: (id: string, nextName: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [nextName, setNextName] = useState(c.name);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {!editing ? (
            <p className="truncate text-sm font-semibold text-slate-900">{c.name}</p>
          ) : (
            <input
              className="h-11 w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
              value={nextName}
              onChange={(e) => setNextName(e.target.value)}
            />
          )}
          <p className="mt-1 text-xs text-slate-600">{c.id}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {!editing ? (
            <Button variant="secondary" disabled={loading} onClick={() => setEditing(true)}>
              Rename
            </Button>
          ) : (
            <Button
              disabled={loading || nextName.trim().length < 2}
              loading={loading}
              onClick={async () => {
                await onRename(c.id, nextName.trim());
                setEditing(false);
              }}
            >
              Save
            </Button>
          )}

          <Button variant="secondary" disabled={loading} onClick={() => onRemove(c.id)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}