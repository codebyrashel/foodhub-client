import { requireRole } from "@/lib/guards";
import MealForm from "../../ui/MealForm";

export default async function EditMealPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["provider"]);
  const { id } = await params;
  return <MealForm mode="edit" mealId={id} />;
}