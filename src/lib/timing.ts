/** Honest clock from first reserve to a frozen box. Days are defaults until McLemore’s gives real ones. */

export const CLOCK = {
  fillFloorLb: 350,
  fillFloorNote: "We do not harvest on one eighth. The steer moves when reserved pounds hit the floor — or we buy the rest ourselves.",
  ageDays: 14,
  cutPackFreezeDays: 7,
  holdGraceDays: 10,
  storagePerWeek: 15,
  deliveryPerStop: 12,
};

export function daysAfterFill(age = CLOCK.ageDays, cut = CLOCK.cutPackFreezeDays) {
  return age + cut;
}

export function readyCopy() {
  const days = daysAfterFill();
  return `After the drop fills, plan about ${CLOCK.ageDays} days of aging plus ${CLOCK.cutPackFreezeDays} days to cut, pack, and freeze — about ${days} days until pickup. If it is not full yet, the clock has not started.`;
}
