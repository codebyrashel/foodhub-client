import { apiFetch } from "./api";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "provider" | "admin";
  status: "active" | "suspended";
  emailVerified: boolean;
  createdAt: string;
  providerProfile: null | {
    restaurantName: string;
    cuisineType: string;
    address: string;
    coverImageUrl: string | null;
  };
};

export type AdminOrderStatus = "placed" | "preparing" | "ready" | "delivered" | "cancelled";

export type AdminOrder = {
  id: string;
  status: AdminOrderStatus;
  totalAmount: string;
  deliveryAddress: string;
  createdAt: string;
  items: Array<{ id: string; quantity: number; priceAtTime: string; meal: any }>;
  customer: { id: string; name: string; email: string };
  provider: { id: string; name: string; email: string; providerProfile: any | null };
};

export function adminGetUsers() {
  return apiFetch<AdminUser[]>("/api/admin/users", { method: "GET" });
}

export function adminUpdateUserStatus(userId: string, status: "active" | "suspended") {
  return apiFetch<Pick<AdminUser, "id" | "name" | "email" | "role" | "status">>(
    `/api/admin/users/${userId}`,
    { method: "PATCH", body: JSON.stringify({ status }) },
  );
}

export function adminGetOrders(status?: AdminOrderStatus) {
  const qs = status ? `?status=${status}` : "";
  return apiFetch<AdminOrder[]>(`/api/admin/orders${qs}`, { method: "GET" });
}

export function adminCreateCategory(input: { name: string; imageUrl?: string | null }) {
  return apiFetch(`/api/admin/categories`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function adminUpdateCategory(id: string, input: { name?: string; imageUrl?: string | null }) {
  return apiFetch(`/api/admin/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function adminDeleteCategory(id: string) {
  return apiFetch(`/api/admin/categories/${id}`, { method: "DELETE" });
}