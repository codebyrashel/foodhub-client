"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { createReview } from "@/lib/reviews";

export default function ReviewMealClient({
  mealId,
  mealName,
}: {
  mealId: string;
  mealName: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submit() {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await createReview({
        mealId,
        rating,
        comment: comment.trim() ? comment.trim() : null,
      });

      setSuccess("Review submitted successfully.");
      setOpen(false);
      router.refresh();
    } catch (e: any) {
      setError(e?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Review: {mealName}</p>
          <p className="mt-1 text-xs text-slate-600">
            You can review only after a delivered order (backend enforced).
          </p>
        </div>

        <Button variant="secondary" onClick={() => setOpen((s) => !s)}>
          {open ? "Close" : "Write review"}
        </Button>
      </div>

      {error && (
        <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {open && (
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} star{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Comment (optional)</Label>
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience (max 500 chars)"
              maxLength={500}
            />
          </div>

          <Button loading={loading} onClick={submit}>
            Submit review
          </Button>
        </div>
      )}
    </div>
  );
}