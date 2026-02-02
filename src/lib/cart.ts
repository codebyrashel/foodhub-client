export type CartItem = {
  mealId: string;
  quantity: number;
};

const KEY = "foodhub_cart_v1";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i) => i && typeof i.mealId === "string")
      .map((i) => ({ mealId: i.mealId, quantity: Number(i.quantity) || 1 }));
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(mealId: string, quantity: number) {
  const items = readCart();
  const existing = items.find((i) => i.mealId === mealId);
  if (existing) existing.quantity = Math.min(20, existing.quantity + quantity);
  else items.push({ mealId, quantity: Math.min(20, Math.max(1, quantity)) });
  writeCart(items);
  return items;
}

export function updateCartQty(mealId: string, quantity: number) {
  const items = readCart();
  const item = items.find((i) => i.mealId === mealId);
  if (!item) return items;
  item.quantity = Math.min(20, Math.max(1, quantity));
  writeCart(items);
  return items;
}

export function removeFromCart(mealId: string) {
  const items = readCart().filter((i) => i.mealId !== mealId);
  writeCart(items);
  return items;
}

export function clearCart() {
  writeCart([]);
}