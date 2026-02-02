import { apiFetch } from "./api";

export function createReview(input: { mealId: string; rating: number; comment?: string | null }) {
  return apiFetch("/api/reviews", {
    method: "POST",
    body: JSON.stringify(input),
  });
}