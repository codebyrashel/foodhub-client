import { apiFetch } from "./api";

export type ProviderProfile = {
  id: string;
  userId: string;
  restaurantName: string;
  cuisineType: string;
  address: string;
  coverImageUrl: string | null;
};

export function onboardProvider(input: {
  restaurantName: string;
  cuisineType: string;
  address: string;
  coverImageUrl?: string | null;
}) {
  return apiFetch<ProviderProfile>("/api/onboarding/provider", {
    method: "POST",
    body: JSON.stringify(input),
  });
}