import { apiFetch } from "./api";

export type Meal = {
  id: string;
  name: string;
  description: string | null;
  price: string; 
  imageUrl: string | null;
  isAvailable: boolean;
  createdAt: string;
  category: { id: string; name: string; imageUrl: string | null };
  provider: {
    id: string;
    name: string;
    image: string | null;
    providerProfile: null | {
      restaurantName: string;
      cuisineType: string;
      address: string;
      coverImageUrl: string | null;
    };
  };
};

export type MealsQuery = {
  categoryId?: string;
  providerId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
};

export function getMeals(query: MealsQuery = {}) {
  const params = new URLSearchParams();
  if (query.categoryId) params.set("categoryId", query.categoryId);
  if (query.providerId) params.set("providerId", query.providerId);
  if (query.search) params.set("search", query.search);
  if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
  if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
  if (query.isAvailable !== undefined) params.set("isAvailable", String(query.isAvailable));

  const qs = params.toString();
  return apiFetch<Meal[]>(`/api/meals${qs ? `?${qs}` : ""}`, { method: "GET" });
}

export type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  customer: { id: string; name: string; image: string | null };
};

export type MealDetails = Meal & {
  reviews: Review[];
};

export function getMeal(id: string) {
  return apiFetch<MealDetails>(`/api/meals/${id}`, { method: "GET" });
}