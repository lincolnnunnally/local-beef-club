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

export type Product = {
  id: string;
  name: string;
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
    name: "Restaurant / Banquet Order",
    kind: "bulk",
    audience: ["restaurant", "catering", "venue", "grocery"],
    pounds: "You name the pounds and cuts",
    price: 0,
    priceNote: "Quoted. Complements family boxes so the whole animal sells.",
    blurb: "Ground for the line, steaks for Friday, brisket for a rehearsal dinner.",
    contents: ["Ground", "Ribeye", "Strip", "Brisket", "Roasts", "Custom"],
  },
];

export const DROPS: Drop[] = [
  {
    id: "oct-24",
    title: "Vidalia Local Beef Drop",
    farmId: "semiema",
    processorId: "mclemore",
    orderBy: "2026-10-10",
    pickupOn: "2026-10-24",
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
