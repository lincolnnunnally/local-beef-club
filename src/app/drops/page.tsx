import Link from "next/link";
import { DROPS, farmById, processorById } from "@/lib/catalog";
import { CLOCK, readyCopy } from "@/lib/timing";

export default function DropsPage() {
  return (
    <main className="section">
      <p className="eyebrow">Fill first. Then the clock.</p>
      <h1>Upcoming beef drops.</h1>
      <p className="lede">{readyCopy()}</p>
      {DROPS.map((d) => {
        const farm = farmById(d.farmId);
        const proc = processorById(d.processorId);
        const fillPct = Math.min(100, Math.round((d.committedLb / d.fillFloorLb) * 100));
        const harvestReady = d.committedLb >= d.fillFloorLb;
        return (
          <article className="card" key={d.id} style={{ marginBottom: 16 }}>
            <p className="eyebrow">{d.status}</p>
            <h2>{d.title}</h2>
            <p>Raised at {farm?.name}. Cut and frozen at {proc?.name}.</p>
            <p>
              Target ready date <strong>{d.pickupOn}</strong>
              {d.pickupIsEstimate ? " — estimate until the floor is hit." : "."}
            </p>
            <p>
              <span className={`dot ${harvestReady ? "green" : "yellow"}`} />
              {d.committedLb} of {d.fillFloorLb} lb reserved ({fillPct}%). Harvest clock starts at {d.fillFloorLb} lb.
            </p>
            <p className="muted">
              After fill: {d.ageDays} days age + {d.cutPackDays} days cut/pack. Hold at the plant {CLOCK.holdGraceDays} days.
            </p>
            <div className="row">
              <Link className="btn" href={`/order?drop=${d.id}`}>Reserve this drop</Link>
              <Link className="btn ghost" href="/how">Read the clock</Link>
            </div>
          </article>
        );
      })}
    </main>
  );
}
