import Link from "next/link";
import AddToCartClient from "./ui/AddToCartClient";
import { getMeal } from "@/lib/meals";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

const fallbackImg =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1400&q=80";

function stars(rating: number) {
  const full = Math.round(rating);
  return "★★★★★☆☆☆☆☆".slice(5 - full, 10 - full);
}

export default async function MealDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let meal;
  try {
    meal = await getMeal(id);
  } catch (e: any) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {e?.message || "Failed to load meal"}
      </div>
    );
  }

  const providerName = meal.provider.providerProfile?.restaurantName || meal.provider.name;

  return (
    <div className="space-y-6">
      <div className="text-sm text-slate-600">
        <Link className="font-semibold text-orange-600 hover:text-orange-700" href="/meals">
          ← Back to meals
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Main */}
        <div className="lg:col-span-3 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div
            className="h-72 bg-cover bg-center"
            style={{ backgroundImage: `url(${meal.imageUrl || fallbackImg})` }}
          />
          <div className="p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900">
                  {meal.name}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  {providerName} • <span className="font-semibold">{meal.category.name}</span>
                </p>
              </div>
              <div className="shrink-0 rounded-2xl bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
                {formatMoney(meal.price)}
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-700">
              {meal.description || "No description provided for this meal."}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  meal.isAvailable
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {meal.isAvailable ? "Available" : "Unavailable"}
              </span>
              <Link
                href={`/providers/${meal.provider.id}`}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                View provider →
              </Link>
            </div>
          </div>
        </div>

        {/* Cart box */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-base font-semibold text-slate-900">Add to cart</p>
            <p className="mt-1 text-sm text-slate-600">
              Cash on Delivery. Orders must be from a single provider.
            </p>

            <div className="mt-5">
              <AddToCartClient mealId={meal.id} disabled={!meal.isAvailable} />
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-base font-semibold text-slate-900">Reviews</p>
            <div className="mt-3 space-y-3">
              {meal.reviews.length === 0 ? (
                <p className="text-sm text-slate-600">No reviews yet.</p>
              ) : (
                meal.reviews.slice(0, 5).map((r) => (
                  <div key={r.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">{r.customer.name}</p>
                      <p className="text-xs font-semibold text-amber-600">{stars(r.rating)}</p>
                    </div>
                    {r.comment ? (
                      <p className="mt-2 text-sm text-slate-700">{r.comment}</p>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">No comment.</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}