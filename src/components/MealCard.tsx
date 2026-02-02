import Link from "next/link";
import { formatMoney } from "@/lib/money";

type Props = {
  meal: {
    id: string;
    name: string;
    description: string | null;
    price: string;
    imageUrl: string | null;
    category: { name: string };
    provider: { id: string; name: string; providerProfile?: any };
  };
};

const fallbackImg =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80";

export default function MealCard({ meal }: Props) {
  const providerName = meal.provider.providerProfile?.restaurantName || meal.provider.name;

  return (
    <Link
      href={`/meals/${meal.id}`}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:shadow-sm"
    >
      <div
        className="h-44 bg-cover bg-center transition group-hover:scale-[1.02]"
        style={{ backgroundImage: `url(${meal.imageUrl || fallbackImg})` }}
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{meal.name}</p>
            <p className="mt-1 truncate text-xs text-slate-600">{providerName}</p>
          </div>
          <p className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            {formatMoney(meal.price)}
          </p>
        </div>

        {meal.description ? (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-600">
            {meal.description}
          </p>
        ) : (
          <p className="mt-3 text-xs text-slate-500">No description provided.</p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700">
            {meal.category.name}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-700">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}