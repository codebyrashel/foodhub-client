import { requireRole } from "@/lib/guards";
import MealForm from "../ui/MealForm";

export default async function NewMealPage() {
  await requireRole(["provider"]);
  return <MealForm mode="create" />;
}