import { apiFetch } from "./api";

export type OrderStatus = "placed" | "preparing" | "ready" | "delivered" | "cancelled";

export type OrderItem = {
  id: string;
  quantity: number;
  priceAtTime: string;
  meal: {
    id: string;
    name: string;
    imageUrl: string | null;
    price: string;
    category?: { id: string; name: string };
  };
};

export type Order = {
  id: string;
  deliveryAddress: string;
  totalAmount: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  provider?: {
    id: string;
    name: string;
    image: string | null;
    providerProfile: any | null;
  };
};

export function createOrder(input: {
  deliveryAddress: string;
  items: Array<{ mealId: string; quantity: number }>;
}) {
  return apiFetch<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getMyOrders() {
  return apiFetch<Order[]>("/api/orders", { method: "GET" });
}

export function getOrder(id: string) {
  return apiFetch<Order>(`/api/orders/${id}`, { method: "GET" });
}

export function cancelOrder(id: string) {
  return apiFetch<Order>(`/api/orders/${id}/cancel`, { method: "PATCH" });
}