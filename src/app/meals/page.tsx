import Link from "next/link";
import MealCard from "@/components/MealCard";
import { getMeals } from "@/lib/meals";
import { getCategories } from "@/lib/categories";

export const dynamic = "force-dynamic";

function SkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="h-44 animate-pulse bg-slate-100" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function MealsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const search = typeof sp.search === "string" ? sp.search : undefined;
  const categoryId = typeof sp.categoryId === "string" ? sp.categoryId : undefined;
  const minPrice = typeof sp.minPrice === "string" ? Number(sp.minPrice) : undefined;
  const maxPrice = typeof sp.maxPrice === "string" ? Number(sp.maxPrice) : undefined;
  const isAvailable =
    typeof sp.isAvailable === "string" ? sp.isAvailable === "true" : undefined;

  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let meals: Awaited<ReturnType<typeof getMeals>> = [];
  let error: string | null = null;

  try {
    [categories, meals] = await Promise.all([
      getCategories(),
      getMeals({ search, categoryId, minPrice, maxPrice, isAvailable }),
    ]);
  } catch (e: any) {
    error = e?.message || "Failed to load meals";
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Browse meals</h1>
            <p className="mt-1 text-sm text-slate-600">
              Filter by category, price, availability, and search by name.
            </p>
          </div>

          <Link
            href="/providers"
            className="text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            Explore providers →
          </Link>
        </div>

        {/* Filters (GET-based via URL) */}
        <form className="mt-6 grid gap-3 md:grid-cols-12" action="/meals">
          <input
            name="search"
            defaultValue={search || ""}
            placeholder="Search meals..."
            className="md:col-span-4 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
          />

          <select
            name="categoryId"
            defaultValue={categoryId || ""}
            className="md:col-span-3 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            name="minPrice"
            defaultValue={minPrice ?? ""}
            type="number"
            min={0}
            placeholder="Min price"
            className="md:col-span-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
          />
          <input
            name="maxPrice"
            defaultValue={maxPrice ?? ""}
            type="number"
            min={0}
            placeholder="Max price"
            className="md:col-span-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
          />

          <select
            name="isAvailable"
            defaultValue={isAvailable === undefined ? "" : String(isAvailable)}
            className="md:col-span-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
          >
            <option value="">All</option>
            <option value="true">Avail</option>
            <option value="false">Off</option>
          </select>

          <button
            type="submit"
            className="md:col-span-12 inline-flex h-11 items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Apply filters
          </button>
        </form>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <>
          {meals.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
              <p className="text-base font-semibold text-slate-900">No meals found</p>
              <p className="mt-2 text-sm text-slate-600">
                Try removing filters or searching with a different keyword.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}