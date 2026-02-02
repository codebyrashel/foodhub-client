import { apiFetch } from "./api";

export type Role = "customer" | "provider" | "admin";
export type UserStatus = "active" | "suspended";

export type Me = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
  providerProfile: null | {
    id: string;
    userId: string;
    restaurantName: string;
    cuisineType: string;
    address: string;
    coverImageUrl: string | null;
  };
};

export function getMe() {
  return apiFetch<Me>("/api/me", { method: "GET" });
}