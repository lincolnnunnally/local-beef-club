export type Practice = {
  grassFed: boolean;
  grassFinished: boolean;
  pastureRaised: boolean;
  rotationalGrazing: boolean;
  organicCertified: boolean;
  noRoutineAntibiotics: boolean;
  noHormones: boolean;
};

export type Farm = {
  id: string;
  name: string;
  area: string;
  milesFromVidalia: number;
  story: string;
  practices: Practice;
  animals: string[];
  processorId: string;
  confirmed: boolean;
};

export type Processor = {
  id: string;
  name: string;
  city: string;
  inspection: string;
  species: string[];
  pickup: boolean;
  holdFrozen: boolean;
  notes: string;
  confirmed: boolean;
};

export type Species = "beef" | "pork" | "chicken" | "lamb";

export const SPECIES: Array<{ id: Species; label: string; note: string }> = [
  { id: "beef", label: "Beef", note: "First farm and processor in conversation now." },
  { id: "pork", label: "Pork", note: "Interest list. Opens as a drop when a local hog farm signs on." },
  { id: "chicken", label: "Chicken", note: "Interest list. Opens as a drop when a pastured-poultry farm signs on." },
  { id: "lamb", label: "Lamb", note: "Interest list. Opens as a drop when a local sheep farm signs on." },
];

export type Product = {
  id: string;
  name: string;
  species: Species;
  /** Rough packaged pounds per unit, used only for the drop fill meter. 0 = quoted. */
  estLb: number;
  kind: "family" | "steak" | "grill" | "ground" | "freezer" | "premium" | "share" | "bulk" | "gift";
  audience: Array<"family" | "individual" | "restaurant" | "catering" | "venue" | "gift" | "grocery">;
  pounds: string;
  price: number;
  priceNote: string;
  blurb: string;
  contents: string[];
};

export type Drop = {
  id: string;
  title: string;
  species: Species;
  farmId: string;
  processorId: string;
  orderBy: string;
  pickupOn: string;
  pickupIsEstimate: boolean;
  packagedLb: number;
  committedLb: number;
  fillFloorLb: number;
  familyBoxesSold: number;
  restaurantLb: number;
  groceryLb: number;
  status: "open" | "filling" | "harvest-set" | "aging" | "ready" | "closed";
  remainingBoxes: number;
  ageDays: number;
  cutPackDays: number;
};

export const PROCESSORS: Processor[] = [
  {
    id: "mclemore",
    name: "McLemore’s Abattoir",
    city: "Vidalia, Georgia",
    inspection: "Georgia state-inspected (to confirm on the call)",
    species: ["Cattle"],
    pickup: true,
    holdFrozen: true,
    notes:
      "Preferred first processor so meat stays on their freezer floor until you pick it up or a short local delivery run. Pricing, labels, and hold fees still need a direct conversation.",
    confirmed: false,
  },
];

export const FARMS: Farm[] = [
  {
    id: "semiema",
    name: "Semiema Farms",
    area: "Swainsboro area",
    milesFromVidalia: 28,
    story:
      "First ranch on the board. We will only publish raising details the farmer stands behind. Until that conversation is written down, treat practices below as the standard we are asking for — not a finished claim.",
    practices: {
      grassFed: true,
      grassFinished: true,
      pastureRaised: true,
      rotationalGrazing: true,
      organicCertified: false,
      noRoutineAntibiotics: true,
      noHormones: true,
    },
    animals: ["Beef"],
    processorId: "mclemore",
    confirmed: false,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "family",
    species: "beef",
    estLb: 22,
    name: "Family Box",
    kind: "family",
    audience: ["family"],
    pounds: "About 22 lb",
    price: 199,
    priceNote: "Target. Final price set per drop after the animal math.",
    blurb: "The easy yes. Mixed beef for a household that cooks real meals.",
    contents: ["Ground beef", "Steaks", "A roast", "Stew or cube beef"],
  },
  {
    id: "ground",
    species: "beef",
    estLb: 20,
    name: "Ground Beef Box",
    kind: "ground",
    audience: ["family", "individual"],
    pounds: "About 20 lb",
    price: 159,
    priceNote: "Target.",
    blurb: "Tacos, chili, sloppy joes, meatloaf. No extra thinking.",
    contents: ["2 lb packs of ground beef"],
  },
  {
    id: "steak",
    species: "beef",
    estLb: 10,
    name: "Steak Box",
    kind: "steak",
    audience: ["individual", "family", "gift"],
    pounds: "About 10 lb",
    price: 189,
    priceNote: "Limited by how many steaks one animal actually has.",
    blurb: "Ribeyes, strips, and sirloins when the carcass has them.",
    contents: ["Ribeye", "Strip", "Sirloin"],
  },
  {
    id: "grill",
    species: "beef",
    estLb: 16,
    name: "Grill Box",
    kind: "grill",
    audience: ["family", "gift"],
    pounds: "About 16 lb",
    price: 179,
    priceNote: "Target.",
    blurb: "Saturday afternoon food. Burgers and steaks together.",
    contents: ["Ground beef", "Steaks", "Kabob or stew cubes"],
  },
  {
    id: "freezer",
    species: "beef",
    estLb: 40,
    name: "Freezer Box",
    kind: "freezer",
    audience: ["family"],
    pounds: "About 40 lb",
    price: 349,
    priceNote: "Target.",
    blurb: "Fill the chest freezer without buying a quarter.",
    contents: ["Ground", "Roasts", "Steaks", "Stew"],
  },
  {
    id: "premium",
    species: "beef",
    estLb: 8,
    name: "Premium Box",
    kind: "premium",
    audience: ["gift", "individual"],
    pounds: "About 8 lb",
    price: 165,
    priceNote: "Target.",
    blurb: "A smaller box of the cuts people talk about.",
    contents: ["Ribeye", "Tenderloin when available"],
  },
  {
    id: "gift",
    species: "beef",
    estLb: 10,
    name: "Gift Box",
    kind: "gift",
    audience: ["gift"],
    pounds: "About 10 lb",
    price: 149,
    priceNote: "Ships as a pickup ticket the recipient can use.",
    blurb: "Send someone a ready date at the processor, not a melting box.",
    contents: ["Mixed steaks and ground", "A note from you"],
  },
  {
    id: "quarter",
    species: "beef",
    estLb: 110,
    name: "Quarter Beef",
    kind: "share",
    audience: ["family"],
    pounds: "About 100–120 lb",
    price: 875,
    priceNote: "Deposit now, balance before pickup.",
    blurb: "A real share of one animal. You get the mix that quarter produces.",
    contents: ["Assorted cuts from one quarter"],
  },
  {
    id: "half",
    species: "beef",
    estLb: 220,
    name: "Half Beef",
    kind: "share",
    audience: ["family"],
    pounds: "About 200–240 lb",
    price: 1650,
    priceNote: "Deposit now, balance before pickup.",
    blurb: "Serious freezer space. Best price per pound on the board.",
    contents: ["Assorted cuts from one half"],
  },
  {
    id: "whole",
    species: "beef",
    estLb: 450,
    name: "Whole Beef",
    kind: "share",
    audience: ["family", "venue"],
    pounds: "About 430–475 lb packaged",
    price: 3100,
    priceNote: "Quoted per animal.",
    blurb: "You take the steer. We still coordinate the processor.",
    contents: ["The animal"],
  },
  {
    id: "bulk",
    species: "beef",
    estLb: 0,
    name: "Restaurant / Banquet Order",
    kind: "bulk",
    audience: ["restaurant", "catering", "venue", "grocery"],
    pounds: "You name the pounds and cuts",
    price: 0,
    priceNote: "Quoted. Complements family boxes so the whole animal sells.",
    blurb: "Ground for the line, steaks for Friday, brisket for a rehearsal dinner.",
    contents: ["Ground", "Ribeye", "Strip", "Brisket", "Roasts", "Custom"],
  },
  {
    id: "pork-box",
    species: "pork",
    estLb: 15,
    name: "Pork Box",
    kind: "family",
    audience: ["family", "individual"],
    pounds: "About 15 lb",
    price: 0,
    priceNote: "Price set when a hog farm signs on. Joining the list costs nothing.",
    blurb: "Chops, bacon, sausage, and a roast from a hog raised nearby.",
    contents: ["Chops", "Bacon", "Sausage", "A roast"],
  },
  {
    id: "half-hog",
    species: "pork",
    estLb: 90,
    name: "Half Hog",
    kind: "share",
    audience: ["family"],
    pounds: "About 80–100 lb",
    price: 0,
    priceNote: "Price set when a hog farm signs on.",
    blurb: "Half an animal, cut the way your family cooks.",
    contents: ["Assorted cuts from one half"],
  },
  {
    id: "chicken-five",
    species: "chicken",
    estLb: 20,
    name: "Pasture Chicken, 5 Birds",
    kind: "family",
    audience: ["family", "individual"],
    pounds: "About 20 lb",
    price: 0,
    priceNote: "Price set when a poultry farm signs on. We will say how each batch is processed.",
    blurb: "Five whole birds for the freezer. Roast one, stock the rest.",
    contents: ["5 whole chickens"],
  },
  {
    id: "lamb-box",
    species: "lamb",
    estLb: 12,
    name: "Lamb Box",
    kind: "family",
    audience: ["family", "individual", "gift"],
    pounds: "About 12 lb",
    price: 0,
    priceNote: "Price set when a sheep farm signs on.",
    blurb: "Chops, a leg, and ground lamb.",
    contents: ["Chops", "Leg", "Ground lamb"],
  },
  {
    id: "half-lamb",
    species: "lamb",
    estLb: 22,
    name: "Half Lamb",
    kind: "share",
    audience: ["family", "restaurant", "venue"],
    pounds: "About 20–25 lb",
    price: 0,
    priceNote: "Price set when a sheep farm signs on.",
    blurb: "A whole half, for a family table or an event menu.",
    contents: ["Assorted cuts from one half"],
  },
];

export const DROPS: Drop[] = [
  {
    id: "beef-1",
    title: "Vidalia Local Beef Drop",
    species: "beef",
    farmId: "semiema",
    processorId: "mclemore",
    orderBy: "2026-12-14",
    pickupOn: "2027-01-04",
    pickupIsEstimate: true,
    packagedLb: 465,
    committedLb: 0,
    fillFloorLb: 350,
    familyBoxesSold: 0,
    restaurantLb: 0,
    groceryLb: 0,
    status: "filling",
    remainingBoxes: 18,
    ageDays: 14,
    cutPackDays: 7,
  },
];

export function farmById(id: string) {
  return FARMS.find((f) => f.id === id);
}

export function processorById(id: string) {
  return PROCESSORS.find((p) => p.id === id);
}

export function priceLabel(p: Product) {
  if (p.price) return `$${p.price}`;
  return p.estLb ? "Interest list" : "Quoted";
}

export function speciesLabel(id: string) {
  return SPECIES.find((s) => s.id === id)?.label || id;
}

export function dropsFor(species: Species) {
  return DROPS.filter((d) => d.species === species && d.status !== "closed");
}

export function productById(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function practiceLabels(p: Practice) {
  const out: string[] = [];
  if (p.pastureRaised) out.push("Pasture raised");
  if (p.grassFed && p.grassFinished) out.push("Grass-fed and grass-finished");
  else if (p.grassFed) out.push("Grass-fed");
  if (p.rotationalGrazing) out.push("Rotational grazing");
  if (p.noHormones) out.push("No added hormones");
  if (p.noRoutineAntibiotics) out.push("No routine antibiotics");
  if (p.organicCertified) out.push("Organic certified");
  else out.push("Not organic-certified");
  return out;
}
