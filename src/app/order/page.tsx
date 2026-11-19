"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { PRODUCTS, SPECIES, dropsFor, productById, speciesLabel } from "@/lib/catalog";

function OrderForm() {
  const params = useSearchParams();
  const [done, setDone] = useState<{ ticket: string; emailed: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [productId, setProductId] = useState(productById(params.get("product") || "")?.id || "family");
  const product = productById(productId) || PRODUCTS[0];
  const drops = dropsFor(product.species);
  const wantedDrop = params.get("drop") || "";
  const defaultDrop = drops.some((d) => d.id === wantedDrop) ? wantedDrop : drops[0]?.id || "";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      role: data.get("role"),
      productId,
      dropId: data.get("dropId") || "",
      qty: Number(data.get("qty") || 1),
      bulkLb: Number(data.get("bulkLb") || 0),
      fulfillment: data.get("fulfillment"),
      standing: data.get("standing") === "on",
      standingCadence: data.get("standingCadence"),
      giftTo: data.get("giftTo"),
      notes: data.get("notes"),
      waitOk: data.get("waitOk") === "on",
      company: data.get("company"),
    };
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Could not save that. Try again.");
      setDone({ ticket: json.ticket, emailed: Boolean(json.emailed) });
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <main className="section">
        <p className="eyebrow">Reserved</p>
        <h1>You are on the list. Ticket {done.ticket}.</h1>
        <p className="lede">
          Nothing is charged today. We will contact you when the drop fills with the real ready date and final price, before you pay anything.
          {done.emailed ? " A copy is on its way to your email." : " Keep this ticket number."}
        </p>
        <div className="row">
          <a className="btn ghost" href="/drops">See the drops</a>
          <a className="btn ghost" href="/shop">Back to the boxes</a>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <p className="eyebrow">One form. We handle the rest.</p>
      <h1>Reserve local meat.</h1>
      <p className="notice">No charge today. You are claiming a slot. Harvest waits until the drop fills, then aging and packing take about three weeks. Pork, chicken, and lamb are interest lists until a local farm signs on.</p>
      <form onSubmit={onSubmit} className="card" style={{ marginTop: 20 }}>
        <label>Name<input name="name" required placeholder="Your name" /></label>
        <label>Email<input name="email" type="email" required /></label>
        <label>Phone<input name="phone" required /></label>
        <label>
          I am
          <select name="role" defaultValue="family">
            <option value="family">A family</option>
            <option value="individual">Buying for myself</option>
            <option value="restaurant">A restaurant</option>
            <option value="catering">Catering</option>
            <option value="venue">Wedding / venue</option>
            <option value="gift">Sending a gift</option>
            <option value="grocery">A grocery store</option>
          </select>
        </label>
        <label>
          What I want
          <select name="productId" value={productId} onChange={(e) => setProductId(e.target.value)}>
            {SPECIES.map((sp) => (
              <optgroup key={sp.id} label={sp.label}>
                {PRODUCTS.filter((p) => p.species === sp.id).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}{p.price ? ` · $${p.price}` : p.estLb ? " · interest list" : " · quoted"}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <label>
          Which drop
          <select name="dropId" key={product.species} defaultValue={defaultDrop}>
            {drops.map((d) => (
              <option key={d.id} value={d.id}>{d.title} · target {d.pickupOn}</option>
            ))}
            <option value="">{drops.length ? "Whichever drop is next" : `No ${speciesLabel(product.species).toLowerCase()} drop yet. Put me on the list`}</option>
          </select>
        </label>
        <label>How many boxes / shares<input name="qty" type="number" min={1} defaultValue={1} /></label>
        {!product.estLb && (
          <label>About how many pounds<input name="bulkLb" type="number" min={0} placeholder="e.g. 80" /></label>
        )}
        <label>
          How I get it
          <select name="fulfillment" defaultValue="processor-pickup">
            <option value="processor-pickup">{product.species === "beef" ? "Pick up at McLemore’s when ready" : "Pick up at the processor when ready"}</option>
            <option value="processor-hold">Hold frozen at the processor</option>
            <option value="local-delivery">Ask for a short Vidalia-area run</option>
          </select>
        </label>
        <label className="muted">
          <input name="standing" type="checkbox" style={{ width: "auto", marginRight: 8 }} />
          Standing order — keep this coming
        </label>
        <label>
          Standing cadence
          <select name="standingCadence" defaultValue="every-drop">
            <option value="every-drop">Every drop</option>
            <option value="monthly">About once a month</option>
          </select>
        </label>
        <label>If this is a gift, who is it for<input name="giftTo" placeholder="Optional" /></label>
        <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} />
        <label>Notes<textarea name="notes" placeholder="Cuts you care about, banquet date, allergies" /></label>
        <label className="muted">
          <input name="waitOk" type="checkbox" required style={{ width: "auto", marginRight: 8 }} />
          I understand we do not harvest until this drop fills, then aging and packing take about three more weeks. The ready date can slide.
        </label>
        {error && <p className="notice" role="alert">{error}</p>}
        <button className="btn" type="submit" disabled={busy} style={{ marginTop: 16 }}>{busy ? "Saving…" : drops.length ? "Reserve this drop" : "Put me on the list"}</button>
      </form>
    </main>
  );
}

export default function OrderPage() {
  return (
    <Suspense>
      <OrderForm />
    </Suspense>
  );
}
