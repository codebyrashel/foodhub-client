import { apiFetch } from "./api";

export type Provider = {
  id: string;
  name: string;
  image: string | null;
  providerProfile: null | {
    id: string;
    userId: string;
    restaurantName: string;
    cuisineType: string;
    address: string;
    coverImageUrl: string | null;
  };
};

export type ProviderDetails = Provider & {
  meals: Array<{
    id: string;
    name: string;
    description: string | null;
    price: string;
    imageUrl: string | null;
    isAvailable: boolean;
    category: { id: string; name: string; imageUrl: string | null };
  }>;
};

export function getProviders() {
  return apiFetch<Provider[]>("/api/providers", { method: "GET" });
}

export function getProvider(id: string) {
  return apiFetch<ProviderDetails>(`/api/providers/${id}`, { method: "GET" });
}