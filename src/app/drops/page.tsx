import Link from "next/link";
import { DROPS, farmById, processorById } from "@/lib/catalog";

export default function DropsPage() {
  return (
    <main className="section">
      <p className="eyebrow">Scheduled, not wait-for-a-cow</p>
      <h1>Upcoming beef drops.</h1>
      <p className="lede">You see the deadline, the pickup day, and what is left. We take the inventory risk. You do not sit on a maybe.</p>
      {DROPS.map((d) => {
        const farm = farmById(d.farmId);
        const proc = processorById(d.processorId);
        const left = d.packagedLb - d.committedLb;
        const tone = left > 120 ? "green" : "yellow";
        return (
          <article className="card" key={d.id} style={{ marginBottom: 16 }}>
            <p className="eyebrow">{d.status}</p>
            <h2>{d.title}</h2>
            <p>Raised at {farm?.name}. Cut and frozen at {proc?.name}.</p>
            <p>Order by <strong>{d.orderBy}</strong>. Ready <strong>{d.pickupOn}</strong>.</p>
            <p>
              <span className={`dot ${tone}`} />
              {d.packagedLb} lb expected · {d.committedLb} lb reserved · {left} lb open · {d.familyBoxesSold} family boxes
            </p>
            <div className="row">
              <Link className="btn" href={`/order?drop=${d.id}`}>Reserve this drop</Link>
              <Link className="btn ghost" href="/standing">Make it standing</Link>
            </div>
          </article>
        );
      })}
    </main>
  );
}
