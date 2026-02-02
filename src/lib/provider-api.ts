import { apiFetch } from "./api";

export type ProviderProfile = {
  id: string;
  userId: string;
  restaurantName: string;
  cuisineType: string;
  address: string;
  coverImageUrl: string | null;
};

export type ProviderOrderStatus = "placed" | "preparing" | "ready" | "delivered" | "cancelled";

export type ProviderOrder = {
  id: string;
  customerId: string;
  providerId: string;
  deliveryAddress: string;
  totalAmount: string;
  status: ProviderOrderStatus;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    priceAtTime: string;
    meal: { id: string; name: string; imageUrl: string | null };
  }>;
  customer: { id: string; name: string; email: string; image: string | null };
};

export function getProviderProfile() {
  return apiFetch<ProviderProfile>("/api/provider/me/profile", { method: "GET" });
}

export function updateProviderProfile(input: Partial<{
  restaurantName: string;
  cuisineType: string;
  address: string;
  coverImageUrl: string | null;
}>) {
  return apiFetch<ProviderProfile>("/api/provider/me/profile", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function getProviderOrders() {
  return apiFetch<ProviderOrder[]>("/api/provider/orders", { method: "GET" });
}

export function updateOrderStatus(orderId: string, status: "preparing" | "ready" | "delivered") {
  return apiFetch<ProviderOrder>(`/api/provider/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}