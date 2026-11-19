"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { DROPS, PRODUCTS, speciesLabel } from "@/lib/catalog";
import {
  FARMER_STATUSES,
  FULFILLMENT_LABEL,
  RESERVATION_STATUSES,
  type Farmer,
  type Reservation,
} from "@/lib/orders";
import { CLOCK } from "@/lib/timing";

type DeskData = { reservations: Reservation[]; farmers: Farmer[] };

async function deskPost(body: Record<string, unknown>) {
  const res = await fetch("/api/desk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.ok) throw new Error(json.message || "Desk action failed.");
  return json;
}

export default function DeskPage() {
  const [data, setData] = useState<DeskData | null>(null);
  const [signedOut, setSignedOut] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/desk", { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    if (res.status === 401) {
      setSignedOut(true);
      setData(null);
      return;
    }
    if (!json.ok) {
      setError(json.message || "Could not load the desk.");
      return;
    }
    setSignedOut(false);
    setData({ reservations: json.reservations || [], farmers: json.farmers || [] });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      await deskPost({ action: "login", password: new FormData(e.currentTarget).get("password") });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    }
  }

  async function update(kind: "reservation" | "farmer", id: string, status: string, note: string) {
    setError("");
    try {
      await deskPost({ action: "update", kind, id, status, note });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    }
  }

  async function changePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    try {
      const json = await deskPost({ action: "password", password: new FormData(form).get("password") });
      setNotice(json.message || "Password changed.");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change the password.");
    }
  }

  async function logout() {
    await deskPost({ action: "logout" }).catch(() => null);
    setData(null);
    setSignedOut(true);
  }

  const orders = useMemo(() => (data?.reservations || []).filter((o) => o.status !== "cancelled"), [data]);
  const [price, setPrice] = useState(199);
  const [animal, setAnimal] = useState(2200);
  const [process, setProcess] = useState(650);
  const [yieldLb, setYieldLb] = useState(465);
  const [storeWeeks, setStoreWeeks] = useState(2);
  const [stops, setStops] = useState(0);

  const econ = useMemo(() => {
    const storage = storeWeeks * CLOCK.storagePerWeek;
    const delivery = stops * CLOCK.deliveryPerStop;
    const landed = animal + process + storage + delivery;
    const costLb = yieldLb ? landed / yieldLb : 0;
    const boxes = Math.floor(yieldLb / 22);
    const revenue = boxes * price;
    return { landed, costLb, boxes, revenue, profit: revenue - landed, storage, delivery };
  }, [animal, process, yieldLb, price, storeWeeks, stops]);

  if (signedOut) {
    return (
      <main className="section">
        <p className="eyebrow">Operator desk</p>
        <h1>Sign in.</h1>
        <form onSubmit={login} className="card" style={{ maxWidth: 420 }}>
          <label>Desk password<input name="password" type="password" autoComplete="current-password" required /></label>
          {error && <p className="notice" role="alert">{error}</p>}
          <button className="btn" type="submit" style={{ marginTop: 12 }}>Open the desk</button>
        </form>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="section">
        <p className="eyebrow">Operator desk</p>
        <p className="muted">{error || "Loading…"}</p>
      </main>
    );
  }

  const waitlist = orders.filter((o) => !o.drop_id);
  const waitBySpecies = waitlist.reduce<Record<string, number>>((m, o) => ({ ...m, [o.species]: (m[o.species] || 0) + 1 }), {});
  const emails = Array.from(new Set(orders.map((o) => o.email))).join(", ");

  return (
    <main className="section">
      <p className="eyebrow">Operator desk</p>
      <h1>One animal at a time.</h1>
      <div className="row" style={{ marginTop: 0, marginBottom: 20 }}>
        <button className="btn ghost" type="button" onClick={load}>Refresh</button>
        <button className="btn ghost" type="button" onClick={() => navigator.clipboard?.writeText(emails)}>Copy {orders.length ? "all buyer emails" : "emails"}</button>
        <button className="btn ghost" type="button" onClick={logout}>Sign out</button>
      </div>
      {error && <p className="notice" role="alert">{error}</p>}
      {notice && <p className="notice">{notice}</p>}
      <div className="grid">
        {DROPS.map((drop) => {
          const mine = orders.filter((o) => o.drop_id === drop.id);
          const lb = Math.round(drop.committedLb + mine.reduce((n, o) => n + Number(o.est_lb || 0), 0));
          const full = lb >= drop.fillFloorLb;
          return (
            <article className="card" key={drop.id}>
              <h3>{drop.title}</h3>
              <p>
                <span className={`dot ${full ? "green" : "yellow"}`} />
                {mine.length} reservation{mine.length === 1 ? "" : "s"} · {lb} lb of {drop.packagedLb} lb packaged
              </p>
              <p>
                Floor {drop.fillFloorLb} lb. Committed {lb} lb.
                {full ? " Clock can start." : ` Do not harvest yet. ${drop.fillFloorLb - lb} lb to go.`}
              </p>
              <div className="meter" aria-hidden="true"><span style={{ width: `${Math.min(100, Math.round((lb / drop.fillFloorLb) * 100))}%` }} /></div>
              <p className="muted">Age {drop.ageDays}d + cut {drop.cutPackDays}d after fill. Ready date is an estimate until then.</p>
            </article>
          );
        })}
        <article className="card">
          <h3>Interest lists</h3>
          {Object.keys(waitBySpecies).length ? (
            Object.entries(waitBySpecies).map(([sp, n]) => <p key={sp}>{speciesLabel(sp)}: {n} waiting for a drop</p>)
          ) : (
            <p className="muted">Nobody waiting without a drop yet.</p>
          )}
          <p className="muted">{data.farmers.filter((f) => f.status !== "declined").length} farm sign-ups to work.</p>
        </article>
        <article className="card">
          <h3>What if Family Boxes are ${price}?</h3>
          <label>Family box price<input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} /></label>
          <label>Animal cost<input type="number" value={animal} onChange={(e) => setAnimal(Number(e.target.value))} /></label>
          <label>Kill + cut + pack<input type="number" value={process} onChange={(e) => setProcess(Number(e.target.value))} /></label>
          <label>Packaged pounds<input type="number" value={yieldLb} onChange={(e) => setYieldLb(Number(e.target.value))} /></label>
          <label>Weeks in plant storage<input type="number" value={storeWeeks} onChange={(e) => setStoreWeeks(Number(e.target.value))} /></label>
          <label>Delivery stops<input type="number" value={stops} onChange={(e) => setStops(Number(e.target.value))} /></label>
          <p>Storage ${econ.storage} · delivery ${econ.delivery}</p>
          <p>Landed ${econ.landed.toFixed(0)} · ${econ.costLb.toFixed(2)}/lb</p>
          <p>~{econ.boxes} family boxes · revenue ${econ.revenue.toFixed(0)} · profit ${econ.profit.toFixed(0)}</p>
        </article>
      </div>
      <section className="section">
        <h2>Reservations</h2>
        {!data.reservations.length ? (
          <p className="muted">None yet. Share the site and they will land here.</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Ticket</th><th>Who</th><th>What</th><th>How</th><th>Status</th></tr>
            </thead>
            <tbody>
              {data.reservations.map((o) => {
                const p = PRODUCTS.find((x) => x.id === o.product_id);
                const drop = DROPS.find((d) => d.id === o.drop_id);
                return (
                  <tr key={o.id} style={o.status === "cancelled" ? { opacity: 0.5 } : undefined}>
                    <td>{o.id}<br /><span className="muted">{new Date(o.created_at).toLocaleDateString()}</span></td>
                    <td>
                      {o.name}<br />
                      <span className="muted">{o.role} · <a href={`mailto:${o.email}`}>{o.email}</a> · <a href={`tel:${o.phone}`}>{o.phone}</a></span>
                    </td>
                    <td>
                      {p?.name || o.product_id} × {o.qty}{o.standing ? ` · standing (${o.standing_cadence || "every drop"})` : ""}
                      <br /><span className="muted">~{Math.round(Number(o.est_lb))} lb · {drop ? drop.title : `${speciesLabel(o.species)} list`}</span>
                      {o.gift_to && <><br /><span className="muted">Gift to {o.gift_to}</span></>}
                      {o.notes && <><br /><span className="muted">{o.notes}</span></>}
                    </td>
                    <td>{FULFILLMENT_LABEL[o.fulfillment] || o.fulfillment}</td>
                    <td>
                      <select defaultValue={o.status} onChange={(e) => update("reservation", o.id, e.target.value, o.desk_note || "")}>
                        {RESERVATION_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                      </select>
                      <input
                        defaultValue={o.desk_note || ""}
                        placeholder="Desk note"
                        style={{ marginTop: 6 }}
                        onBlur={(e) => e.target.value !== (o.desk_note || "") && update("reservation", o.id, o.status, e.target.value)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
      <section className="section">
        <h2>Farms that want to sell</h2>
        {!data.farmers.length ? (
          <p className="muted">None yet. Point ranchers to /sell.</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Farm</th><th>Raises</th><th>Practices / processor</th><th>Available</th><th>Status</th></tr>
            </thead>
            <tbody>
              {data.farmers.map((f) => (
                <tr key={f.id}>
                  <td>
                    {f.farm_name || f.name}<br />
                    <span className="muted">{f.name} · <a href={`tel:${f.phone}`}>{f.phone}</a>{f.email ? <> · <a href={`mailto:${f.email}`}>{f.email}</a></> : null}{f.area ? ` · ${f.area}` : ""}</span>
                  </td>
                  <td>{f.species.map(speciesLabel).join(", ")}</td>
                  <td>{f.practices}<br /><span className="muted">{f.processor}</span></td>
                  <td>{f.available}{f.notes && <><br /><span className="muted">{f.notes}</span></>}</td>
                  <td>
                    <select defaultValue={f.status} onChange={(e) => update("farmer", f.id, e.target.value, f.desk_note || "")}>
                      {FARMER_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                    </select>
                    <input
                      defaultValue={f.desk_note || ""}
                      placeholder="Desk note"
                      style={{ marginTop: 6 }}
                      onBlur={(e) => e.target.value !== (f.desk_note || "") && update("farmer", f.id, f.status, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <section className="section">
        <form onSubmit={changePassword} className="card" style={{ maxWidth: 420 }}>
          <h3>Change the desk password</h3>
          <label>New password<input name="password" type="password" minLength={10} autoComplete="new-password" required /></label>
          <button className="btn ghost" type="submit" style={{ marginTop: 12 }}>Change it</button>
        </form>
      </section>
    </main>
  );
}
