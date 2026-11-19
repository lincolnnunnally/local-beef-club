// Server-only access to the shared Life Produces Life Supabase.
// The app holds only the publishable key. Tables are locked (RLS, no grants);
// everything goes through the lbc_* SECURITY DEFINER functions in
// db/migrations/20261119_lbc_core.sql.

function baseUrl() {
  return (process.env.SUPABASE_URL || "").replace(/\/$/, "");
}

function apiKey() {
  return process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "";
}

export function hasDatabase() {
  return Boolean(baseUrl() && apiKey());
}

export async function rpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
  if (!hasDatabase()) throw new Error("The reservation database is not connected on this host.");
  const res = await fetch(`${baseUrl()}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: apiKey(), "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const message = (body && typeof body === "object" && "message" in body && String(body.message)) || `Database ${res.status}`;
    throw new Error(message);
  }
  return body as T;
}

export type PublicCounts = {
  drops: Record<string, { lb: number; reservations: number }>;
  species: Record<string, number>;
  farmers: number;
};

const EMPTY: PublicCounts = { drops: {}, species: {}, farmers: 0 };

/** Aggregate counts with no personal data. Never throws: a page still renders if the database is down. */
export async function publicCounts(): Promise<PublicCounts> {
  try {
    const c = await rpc<PublicCounts>("lbc_public_counts");
    return { ...EMPTY, ...c };
  } catch {
    return EMPTY;
  }
}
