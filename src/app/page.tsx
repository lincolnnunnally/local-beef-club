import Link from "next/link";
import { DROPS, FARMS, PRODUCTS } from "@/lib/catalog";

export default function Home() {
  const drop = DROPS[0];
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">Vidalia · Swainsboro · South Georgia</p>
        <h1>Local beef, without learning how to buy a cow.</h1>
        <p className="lede">
          Choose a box. Meet the farm. Pick it up frozen at the processor —
          or leave it there until a short delivery run. Inspected meat. Scheduled drops.
          No dumpster food. That door is Plenty.
        </p>
        <div className="row">
          <Link className="btn" href="/order">Reserve a box</Link>
          <Link className="btn ghost" href="/how">See how a drop works</Link>
        </div>
      </section>
      <section className="section">
        <p className="eyebrow">Who is this for</p>
        <div className="grid">
          <Link className="card" href="/shop"><h3>A family</h3><p className="muted">A mixed box that actually gets cooked.</p></Link>
          <Link className="card" href="/shop"><h3>Prime cuts</h3><p className="muted">Steaks when the animal has them.</p></Link>
          <Link className="card" href="/shop"><h3>Just ground beef</h3><p className="muted">Weeknight food. No extra story required.</p></Link>
          <Link className="card" href="/business"><h3>Restaurant or banquet</h3><p className="muted">Quote the cuts. Help finish the animal.</p></Link>
          <Link className="card" href="/gift"><h3>A gift</h3><p className="muted">They pick it up ready. You don’t ship ice.</p></Link>
          <Link className="card" href="/shop"><h3>A quarter or half</h3><p className="muted">When the freezer is the plan.</p></Link>
        </div>
      </section>
      <section className="section">
        <p className="eyebrow">Next drop</p>
        <div className="card">
          <h2>{drop.title}</h2>
          <p>Order by {drop.orderBy}. Pickup {drop.pickupOn} at McLemore’s, Vidalia — or hold frozen there.</p>
          <p className="muted">{drop.remainingBoxes} family-box slots sketched. Numbers go live after the first steer is confirmed.</p>
          <div className="row">
            <Link className="btn" href="/drops">Open this drop</Link>
            <Link className="btn ghost" href="/farms">{FARMS[0].name}</Link>
          </div>
        </div>
      </section>
      <section className="section">
        <p className="eyebrow">Boxes</p>
        <div className="grid">
          {PRODUCTS.filter((p) => ["family", "ground", "steak", "bulk"].includes(p.kind)).map((p) => (
            <article className="card" key={p.id}>
              <h3>{p.name}</h3>
              <p>{p.price ? `$${p.price}` : "Quoted"} · {p.pounds}</p>
              <p className="muted">{p.blurb}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
