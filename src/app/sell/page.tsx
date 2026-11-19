"use client";

import { FormEvent, useState } from "react";
import { SPECIES } from "@/lib/catalog";

export default function SellPage() {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    const payload = {
      name: data.get("name"),
      farmName: data.get("farmName"),
      email: data.get("email"),
      phone: data.get("phone"),
      area: data.get("area"),
      species: data.getAll("species"),
      practices: data.get("practices"),
      processor: data.get("processor"),
      available: data.get("available"),
      notes: data.get("notes"),
      company: data.get("company"),
    };
    try {
      const res = await fetch("/api/farmers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Could not save that. Try again.");
      setDone(true);
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
        <p className="eyebrow">Got it</p>
        <h1>Thank you. We will call you.</h1>
        <p className="lede">
          We will talk through what you raise, how you raise it, who processes it, and the price that works for you.
          Nothing about your farm goes on this site until you have said it is right.
        </p>
      </main>
    );
  }

  return (
    <main className="section">
      <p className="eyebrow">For farmers and ranchers</p>
      <h1>You raise it. Neighbors buy it.</h1>
      <p className="lede">
        Local Beef Club fills an animal with reservations from families, kitchens, and stores before it goes to the
        processor, so you are not left holding unsold meat. Beef, pork, chicken, and lamb from around Vidalia and South Georgia.
      </p>
      <div className="grid" style={{ marginTop: 20 }}>
        <article className="card"><h3>Sold before harvest</h3><p className="muted">A drop moves when reserved pounds hit the floor. Ground and stew go to kitchens and stores so the whole animal sells.</p></article>
        <article className="card"><h3>Your name on it</h3><p className="muted">Buyers see your farm and only the raising practices you have confirmed in writing.</p></article>
        <article className="card"><h3>Inspected processing</h3><p className="muted">Meat is processed under inspection (or the legal poultry exemption, said plainly) and picked up at the processor.</p></article>
      </div>
      <form onSubmit={onSubmit} className="card" style={{ marginTop: 20 }}>
        <label>Your name<input name="name" required /></label>
        <label>Farm name<input name="farmName" placeholder="Optional" /></label>
        <label>Phone<input name="phone" required /></label>
        <label>Email<input name="email" type="email" placeholder="Optional" /></label>
        <label>Where is the farm<input name="area" placeholder="Town or county" /></label>
        <fieldset style={{ border: 0, padding: 0, margin: "12px 0 6px" }}>
          <legend style={{ fontSize: ".9rem" }}>What do you raise</legend>
          <div className="row" style={{ marginTop: 8 }}>
            {SPECIES.map((s) => (
              <label key={s.id} className="tag" style={{ margin: 0, fontSize: ".95rem", padding: "8px 12px" }}>
                <input type="checkbox" name="species" value={s.id} defaultChecked={s.id === "beef"} style={{ width: "auto", marginRight: 8 }} />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>
        <label>How you raise them<textarea name="practices" placeholder="Pasture, grass-finished, feed, antibiotics, hormones. Whatever is true." /></label>
        <label>Who processes for you now<input name="processor" placeholder="Plant name and town, or 'need one'" /></label>
        <label>What you could have ready, and when<textarea name="available" placeholder="e.g. 2 steers in February, 6 hogs in spring" /></label>
        <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} />
        <label>Anything else<textarea name="notes" /></label>
        {error && <p className="notice" role="alert">{error}</p>}
        <button className="btn" type="submit" disabled={busy} style={{ marginTop: 16 }}>{busy ? "Sending…" : "Tell us about your farm"}</button>
      </form>
    </main>
  );
}
