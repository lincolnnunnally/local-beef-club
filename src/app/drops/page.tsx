import Link from "next/link";
import { DROPS, SPECIES, farmById, processorById } from "@/lib/catalog";
import { publicCounts } from "@/lib/db";
import { CLOCK, readyCopy } from "@/lib/timing";

export const revalidate = 30;

export default async function DropsPage() {
  const counts = await publicCounts();
  const openSpecies = new Set(DROPS.filter((d) => d.status !== "closed").map((d) => d.species));
  return (
    <main className="section">
      <p className="eyebrow">Fill first. Then the clock.</p>
      <h1>Upcoming beef drops.</h1>
      <p className="lede">{readyCopy()}</p>
      {DROPS.map((d) => {
        const farm = farmById(d.farmId);
        const proc = processorById(d.processorId);
        const live = counts.drops[d.id];
        const committed = Math.round(d.committedLb + (live?.lb || 0));
        const fillPct = Math.min(100, Math.round((committed / d.fillFloorLb) * 100));
        const harvestReady = committed >= d.fillFloorLb;
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
              {committed} of {d.fillFloorLb} lb reserved ({fillPct}%){live ? ` across ${live.reservations} reservation${live.reservations === 1 ? "" : "s"}` : ""}. Harvest clock starts at {d.fillFloorLb} lb.
            </p>
            <div className="meter" aria-hidden="true"><span style={{ width: `${fillPct}%` }} /></div>
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
      <section className="section">
        <p className="eyebrow">Next up, when a farm signs on</p>
        <div className="grid">
          {SPECIES.filter((sp) => !openSpecies.has(sp.id)).map((sp) => {
            const waiting = counts.species[sp.id] || 0;
            return (
              <article className="card" key={sp.id}>
                <h3>{sp.label}</h3>
                <p className="muted">{sp.note}</p>
                <p>{waiting ? `${waiting} neighbor${waiting === 1 ? "" : "s"} on the list.` : "Be the first on the list."}</p>
                <div className="row">
                  <Link className="btn" href={`/shop?species=${sp.id}`}>Join the {sp.label.toLowerCase()} list</Link>
                  <Link className="btn ghost" href="/sell">Raise {sp.label.toLowerCase()}?</Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
