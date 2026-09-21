"use client";

import { useEffect, useMemo, useState } from "react";
import { DROPS, PRODUCTS } from "@/lib/catalog";
import { loadOrders, type Order } from "@/lib/orders";
import { CLOCK } from "@/lib/timing";

export default function DeskPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [price, setPrice] = useState(199);
  const [animal, setAnimal] = useState(2200);
  const [process, setProcess] = useState(650);
  const [yieldLb, setYieldLb] = useState(465);
  const [storeWeeks, setStoreWeeks] = useState(2);
  const [stops, setStops] = useState(0);

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  const econ = useMemo(() => {
    const storage = storeWeeks * CLOCK.storagePerWeek;
    const delivery = stops * CLOCK.deliveryPerStop;
    const landed = animal + process + storage + delivery;
    const costLb = yieldLb ? landed / yieldLb : 0;
    const boxes = Math.floor(yieldLb / 22);
    const revenue = boxes * price;
    return { landed, costLb, boxes, revenue, profit: revenue - landed, storage, delivery };
  }, [animal, process, yieldLb, price, storeWeeks, stops]);

  const drop = DROPS[0];

  return (
    <main className="section">
      <p className="eyebrow">Operator desk</p>
      <h1>One animal at a time.</h1>
      <div className="grid">
        <article className="card">
          <h3>{drop.title}</h3>
          <p>
            <span className="dot yellow" />
            {drop.packagedLb} lb sketched · {orders.reduce((n, o) => n + o.qty, 0)} reservations on this browser
          </p>
          <p>
            Floor {drop.fillFloorLb} lb. Committed {drop.committedLb} lb.
            {drop.committedLb >= drop.fillFloorLb ? " Clock can start." : " Do not harvest yet."}
          </p>
          <p className="muted">Age {drop.ageDays}d + cut {drop.cutPackDays}d after fill. Ready date is an estimate until then.</p>
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
        {!orders.length ? (
          <p className="muted">None on this device yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Ticket</th><th>Who</th><th>What</th><th>How</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const p = PRODUCTS.find((x) => x.id === o.productId);
                return (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.name}<br /><span className="muted">{o.role} · {o.email}</span></td>
                    <td>{p?.name} × {o.qty}{o.standing ? " · standing" : ""}</td>
                    <td>{o.fulfillment}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
