"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { DROPS, PRODUCTS } from "@/lib/catalog";
import { newId, saveOrder } from "@/lib/orders";

function OrderForm() {
  const params = useSearchParams();
  const [done, setDone] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const id = newId();
    saveOrder({
      id,
      createdAt: new Date().toISOString(),
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      role: String(data.get("role") || "family") as never,
      productId: String(data.get("productId")),
      dropId: String(data.get("dropId")),
      qty: Number(data.get("qty") || 1),
      fulfillment: String(data.get("fulfillment") || "processor-pickup") as never,
      standing: data.get("standing") === "on",
      standingCadence: String(data.get("standingCadence") || "every-drop") as never,
      giftTo: String(data.get("giftTo") || ""),
      notes: String(data.get("notes") || ""),
      status: "reserved",
    });
    setDone(id);
  }

  if (done) {
    return (
      <main className="section">
        <p className="eyebrow">Reserved on this device</p>
        <h1>You are on the list. Ticket {done}.</h1>
        <p className="lede">
          Card payment is not live yet — that needs Stripe. This reservation is saved in your browser and on the desk page so we can call you when the first steer is real.
        </p>
      </main>
    );
  }

  return (
    <main className="section">
      <p className="eyebrow">One form. We handle the rest.</p>
      <h1>Reserve local beef.</h1>
      <p className="notice">No charge today. You are claiming a slot on the next drop.</p>
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
          </select>
        </label>
        <label>
          What I want
          <select name="productId" defaultValue={params.get("product") || "family"}>
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}{p.price ? ` · $${p.price}` : ""}</option>
            ))}
          </select>
        </label>
        <label>
          Which drop
          <select name="dropId" defaultValue={params.get("drop") || DROPS[0].id}>
            {DROPS.map((d) => (
              <option key={d.id} value={d.id}>{d.title} · ready {d.pickupOn}</option>
            ))}
          </select>
        </label>
        <label>How many boxes / shares<input name="qty" type="number" min={1} defaultValue={1} /></label>
        <label>
          How I get it
          <select name="fulfillment" defaultValue="processor-pickup">
            <option value="processor-pickup">Pick up at McLemore’s when ready</option>
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
        <label>Notes<textarea name="notes" placeholder="Cuts you care about, banquet date, allergies" /></label>
        <button className="btn" type="submit" style={{ marginTop: 16 }}>Reserve this drop</button>
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
