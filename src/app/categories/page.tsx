import Link from "next/link";
import { getCategories, Category } from "@/lib/categories";

export const dynamic = "force-dynamic";

const fallbackImg =
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80";

export default async function CategoriesPage() {
  let categories: Category[] = [];
  let error: string | null = null;

  try {
    categories = await getCategories();
  } catch (e: unknown) {
    error = (e as { message?: string }).message || "Failed to load categories";
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-3xl border border-slate-200 bg-white p-6 md:p-8'>
        <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
          Categories
        </h1>
        <p className='mt-1 text-sm text-slate-600'>
          Browse cuisine types and discover meals by category.
        </p>
      </div>

      {error ? (
        <div className='rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700'>
          {error}
        </div>
      ) : categories.length === 0 ? (
        <div className='rounded-3xl border border-slate-200 bg-white p-10 text-center'>
          <p className='text-base font-semibold text-slate-900'>
            No categories found
          </p>
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {categories.map((c: Category) => (
            <Link
              key={c.id}
              href={`/meals?categoryId=${c.id}`}
              className='group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:shadow-sm'>
              <div
                className='h-36 bg-cover bg-center transition group-hover:scale-[1.02]'
                style={{ backgroundImage: `url(${c.imageUrl || fallbackImg})` }}
              />
              <div className='p-4'>
                <p className='text-sm font-semibold text-slate-900'>{c.name}</p>
                <p className='mt-1 text-xs text-slate-600'>View meals →</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
