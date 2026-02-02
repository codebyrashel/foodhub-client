import { apiFetch } from "./api";

export type Category = {
  id: string;
  name: string;
  imageUrl: string | null;
};

export function getCategories() {
  return apiFetch<Category[]>("/api/categories", { method: "GET" });
}