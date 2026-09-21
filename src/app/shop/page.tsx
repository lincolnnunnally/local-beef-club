"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PRODUCTS } from "@/lib/catalog";

export default function ShopPage() {
  const [kind, setKind] = useState("all");
  const [audience, setAudience] = useState("all");
  const items = useMemo(
    () =>
      PRODUCTS.filter((p) => (kind === "all" ? true : p.kind === kind)).filter((p) =>
        audience === "all" ? true : p.audience.includes(audience as never)
      ),
    [kind, audience]
  );

  return (
    <main className="section">
      <p className="eyebrow">Choose what you actually cook</p>
      <h1>Boxes, shares, and bulk.</h1>
      <p className="lede">Prices are targets until the first animal math is real. Inventory will not sell more ribeyes than one steer has.</p>
      <div className="grid" style={{ margin: "20px 0" }}>
        <label>
          What kind
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="all">All</option>
            <option value="family">Family mix</option>
            <option value="ground">Ground</option>
            <option value="steak">Steaks / prime</option>
            <option value="grill">Grill</option>
            <option value="freezer">Freezer</option>
            <option value="gift">Gift</option>
            <option value="share">Quarter / half / whole</option>
            <option value="bulk">Restaurant / banquet</option>
          </select>
        </label>
        <label>
          Who is it for
          <select value={audience} onChange={(e) => setAudience(e.target.value)}>
            <option value="all">Anyone</option>
            <option value="family">Family</option>
            <option value="individual">Just me</option>
            <option value="gift">A gift</option>
            <option value="restaurant">Restaurant</option>
            <option value="catering">Catering</option>
            <option value="venue">Wedding / venue</option>
          </select>
        </label>
      </div>
      <div className="grid">
        {items.map((p) => (
          <article className="card" key={p.id}>
            <h3>{p.name}</h3>
            <p>{p.price ? `$${p.price}` : "Quoted"} · {p.pounds}</p>
            <p className="muted">{p.blurb}</p>
            <p>{p.contents.join(" · ")}</p>
            <p className="muted">{p.priceNote}</p>
            <Link className="btn" href={`/order?product=${p.id}`}>Reserve</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
