export function formatMoney(value: string | number) {
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return "৳0.00";
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(n);
}