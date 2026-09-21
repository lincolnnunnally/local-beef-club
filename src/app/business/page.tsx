import Link from "next/link";

export default function BusinessPage() {
  return (
    <main className="section">
      <p className="eyebrow">Kitchens, banquets, venues</p>
      <h1>Buy the cuts you need. Help finish the animal.</h1>
      <p className="lede">
        A restaurant taking $800 of ground and steaks makes the Family Boxes possible. Tell us the event date. We hold product at the plant.
      </p>
      <div className="grid">
        <article className="card"><h3>Restaurant</h3><p>Weekly ground. Friday steaks. Say the pounds.</p></article>
        <article className="card"><h3>Catering</h3><p>One banquet, one count, one pickup window.</p></article>
        <article className="card"><h3>Wedding / venue</h3><p>Rehearsal dinner or reception. We plan backward from your date.</p></article>
        <article className="card"><h3>Grocery</h3><p>Georgia stores can take inspected ground and stew and help finish the steer. USDA is only if we cross a state line.</p></article>
      </div>
      <div className="row">
        <Link className="btn" href="/order?product=bulk">Request a kitchen quote</Link>
      </div>
    </main>
  );
}
