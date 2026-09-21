export type Order = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  role: "family" | "individual" | "restaurant" | "catering" | "venue" | "gift";
  productId: string;
  dropId: string;
  qty: number;
  fulfillment: "processor-pickup" | "processor-hold" | "local-delivery";
  standing: boolean;
  standingCadence?: "every-drop" | "monthly";
  giftTo?: string;
  notes: string;
  status: "reserved";
};

const KEY = "lbc-orders-v1";

export function loadOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveOrder(order: Order) {
  const all = loadOrders();
  all.unshift(order);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function newId() {
  return "LBC-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}
