import Link from "next/link";
import { FARMS, PROCESSORS, practiceLabels } from "@/lib/catalog";

export default function FarmsPage() {
  return (
    <main className="section">
      <p className="eyebrow">Know the farm</p>
      <h1>Who raised it, and where it was cut.</h1>
      <p className="lede">Filters on the shop are only as honest as these profiles. Unconfirmed practices stay labeled that way.</p>
      <div className="grid">
        {FARMS.map((f) => (
          <article className="card" key={f.id}>
            <p className="eyebrow">{f.milesFromVidalia} miles from Vidalia</p>
            <h2>{f.name}</h2>
            <p>{f.area}</p>
            <p>{f.story}</p>
            <div>
              {practiceLabels(f.practices).map((t) => (
                <span className="tag" key={t}>{t}</span>
              ))}
            </div>
            {!f.confirmed && <p className="notice">Practices asked for. Farmer confirmation still open.</p>}
          </article>
        ))}
        {PROCESSORS.map((p) => (
          <article className="card" key={p.id}>
            <p className="eyebrow">Processor</p>
            <h2>{p.name}</h2>
            <p>{p.city}</p>
            <p>{p.inspection}</p>
            <p>Pickup at the plant: {p.pickup ? "yes" : "no"}. Hold frozen: {p.holdFrozen ? "yes" : "no"}.</p>
            <p className="muted">{p.notes}</p>
            <Link className="btn ghost" href="/how">Why we keep meat here</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
