// Reservations used to live in each visitor's localStorage, so the desk only saw
// orders typed on the same browser. They now go to the shared lbc_reservations
// table through /api/reserve; these are the shapes the desk reads back.

export type Role = "family" | "individual" | "restaurant" | "catering" | "venue" | "gift" | "grocery";
export type Fulfillment = "processor-pickup" | "processor-hold" | "local-delivery";
export type ReservationStatus = "reserved" | "confirmed" | "ready" | "picked-up" | "cancelled";
export type FarmerStatus = "new" | "talking" | "confirmed" | "declined";

export const RESERVATION_STATUSES: ReservationStatus[] = ["reserved", "confirmed", "ready", "picked-up", "cancelled"];
export const FARMER_STATUSES: FarmerStatus[] = ["new", "talking", "confirmed", "declined"];

export const FULFILLMENT_LABEL: Record<Fulfillment, string> = {
  "processor-pickup": "Pickup at processor",
  "processor-hold": "Hold frozen at processor",
  "local-delivery": "Short local run",
};

/** Row as stored in lbc_reservations. */
export type Reservation = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  product_id: string;
  species: string;
  drop_id: string | null;
  qty: number;
  est_lb: number;
  fulfillment: Fulfillment;
  standing: boolean;
  standing_cadence: string | null;
  gift_to: string | null;
  notes: string | null;
  status: ReservationStatus;
  desk_note: string | null;
};

/** Row as stored in lbc_farmers. */
export type Farmer = {
  id: string;
  created_at: string;
  name: string;
  farm_name: string | null;
  email: string | null;
  phone: string;
  area: string | null;
  species: string[];
  practices: string | null;
  processor: string | null;
  available: string | null;
  notes: string | null;
  status: FarmerStatus;
  desk_note: string | null;
};
