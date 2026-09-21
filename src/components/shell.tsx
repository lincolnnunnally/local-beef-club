import Link from "next/link";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="wrap">
        <header className="nav">
          <Link className="brand" href="/">Local <span>Beef Club</span></Link>
          <nav className="nav-links">
            <Link href="/shop">Boxes</Link>
            <Link href="/drops">Drops</Link>
            <Link href="/farms">Farms</Link>
            <Link href="/business">Restaurants</Link>
            <Link href="/gift">Gifts</Link>
            <Link href="/standing">Standing</Link>
            <Link href="/how">How it works</Link>
            <Link href="/desk">Desk</Link>
          </nav>
          <Link className="btn" href="/order">Reserve</Link>
        </header>
        {children}
        <footer className="footer">
          Local Beef Club is the paid farm-to-table door. Plenty is the pantry.
          Meat stays at the inspected processor until pickup or a short local run —
          no club freezer truck required.
        </footer>
      </div>
    </>
  );
}
