import Link from "next/link";

export default function StandingPage() {
  return (
    <main className="section">
      <p className="eyebrow">Set it once</p>
      <h1>Standing orders.</h1>
      <p className="lede">
        Same box, every drop or about once a month. We skip you if a drop is short. You can pause any time.
      </p>
      <div className="card">
        <p>Most households start with a Family Box or Ground Beef Box on every drop.</p>
        <Link className="btn" href="/order">Start a standing reserve</Link>
      </div>
    </main>
  );
}
