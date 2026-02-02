import Link from "next/link";
import { requireRole } from "@/lib/guards";
import { getMe } from "@/lib/me";
import { getMeals, Meal } from "@/lib/meals";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function ProviderMenuPage() {
  const me = await requireRole(["provider"]);

  let meals: Meal[] = [];
  let error: string | null = null;

  try {
    meals = await getMeals({ providerId: me.id });
  } catch (e: unknown) {
    error = (e as { message?: string }).message || "Failed to load menu";
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-3xl border border-slate-200 bg-white p-6 md:p-8'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
              Menu
            </h1>
            <p className='mt-1 text-sm text-slate-600'>
              Create, edit, and remove items from your menu.
            </p>
          </div>

          <Link
            href='/provider/menu/new'
            className='inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-semibold text-white hover:bg-orange-600'>
            Add new meal
          </Link>
        </div>
      </div>

      {error ? (
        <div className='rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700'>
          {error}
        </div>
      ) : meals.length === 0 ? (
        <div className='rounded-3xl border border-slate-200 bg-white p-10 text-center'>
          <p className='text-base font-semibold text-slate-900'>No meals yet</p>
          <p className='mt-2 text-sm text-slate-600'>
            Add your first menu item to start receiving orders.
          </p>
        </div>
      ) : (
        <div className='grid gap-4'>
          {meals.map((m: Meal) => (
            <div
              key={m.id}
              className='rounded-3xl border border-slate-200 bg-white p-5'>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                <div className='min-w-0'>
                  <p className='truncate text-sm font-semibold text-slate-900'>
                    {m.name}
                  </p>
                  <p className='mt-1 text-xs text-slate-600'>
                    {m.category?.name} • {formatMoney(m.price)} •{" "}
                    <span
                      className={
                        m.isAvailable ? "text-emerald-700" : "text-slate-500"
                      }>
                      {m.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </p>
                </div>

                <div className='flex flex-wrap gap-2'>
                  <Link
                    href={`/provider/menu/${m.id}/edit`}
                    className='inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold hover:bg-slate-50'>
                    Edit
                  </Link>
                  <Link
                    href={`/meals/${m.id}`}
                    className='inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold hover:bg-slate-50'>
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
