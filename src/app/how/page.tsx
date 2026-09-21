import { CLOCK, readyCopy } from "@/lib/timing";

export default function HowPage() {
  return (
    <main className="section">
      <p className="eyebrow">The clock, said plainly</p>
      <h1>We do not harvest a steer for one eighth.</h1>
      <p className="lede">{readyCopy()}</p>
      <ol className="lede">
        <li>You reserve a box. No harvest yet.</li>
        <li>The drop fills to {CLOCK.fillFloorLb} reserved pounds — families, kitchens, and grocery together — or we buy the rest.</li>
        <li>Harvest date is set. You get word: the clock started.</li>
        <li>About {CLOCK.ageDays} days aging, then {CLOCK.cutPackFreezeDays} days to cut, pack, freeze.</li>
        <li>Ready at McLemore’s. Pickup, hold ({CLOCK.holdGraceDays} days grace), or a short local run.</li>
      </ol>
      <div className="grid" style={{ marginTop: 28 }}>
        <article className="card">
          <h3>If it is slow to fill</h3>
          <p>The pickup date slides. You can wait, switch drops, or cancel. Better that than harvest an unsold animal.</p>
        </article>
        <article className="card">
          <h3>Storage is a cost</h3>
          <p>After the grace window, plant storage is about ${CLOCK.storagePerWeek}/week until McLemore’s gives a real number. Delivery is about ${CLOCK.deliveryPerStop} a stop in town.</p>
        </article>
        <article className="card">
          <h3>Grocery stores</h3>
          <p>State-inspected beef can go to Georgia stores. A cooler case taking ground and stew is how an eighth becomes a full steer. Interstate shelves need USDA — later.</p>
        </article>
      </div>
    </main>
  );
}
