import Link from "next/link";

export default function GiftPage() {
  return (
    <main className="section">
      <p className="eyebrow">No melting boxes in the mail</p>
      <h1>Give a pickup, not a problem.</h1>
      <p className="lede">
        They get a date at the processor and a box with your name on the note. You do not ship ice across Georgia.
      </p>
      <Link className="btn" href="/order?product=gift">Send a gift box</Link>
    </main>
  );
}
