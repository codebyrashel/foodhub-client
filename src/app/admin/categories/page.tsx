import { requireRole } from "@/lib/guards";
import { getCategories } from "@/lib/categories";
import CategoriesAdminClient from "./ui/CategoriesAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await requireRole(["admin"]);

  try {
    const categories = await getCategories();
    return <CategoriesAdminClient initialCategories={categories} />;
  } catch (e: any) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {e?.message || "Failed to load categories"}
      </div>
    );
  }
}