import { DROPS, productById, speciesLabel } from "@/lib/catalog";
import { fail, ok, readJson, str } from "@/lib/api";
import { rpc } from "@/lib/db";
import { alertRecipients, publicUrl, sendEmail } from "@/lib/mail";
import { FULFILLMENT_LABEL, type Fulfillment } from "@/lib/orders";

export const dynamic = "force-dynamic";

const ROLES = ["family", "individual", "restaurant", "catering", "venue", "gift", "grocery"];
const FULFILL = ["processor-pickup", "processor-hold", "local-delivery"];

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return fail("Send the form again.");

  // Hidden field a person never fills; bots usually do.
  if (str(body.company)) return ok({ ticket: "LBC-THANKS" });

  const product = productById(str(body.productId));
  if (!product) return fail("Choose what you want.");

  // A drop has to be for the same animal. Blank means "the next one" (interest list).
  const dropId = str(body.dropId);
  const drop = dropId ? DROPS.find((d) => d.id === dropId && d.species === product.species) : undefined;
  if (dropId && !drop) return fail("That drop is not for this product. Pick another drop or the interest list.");

  const qty = Math.max(1, Math.min(500, Math.floor(Number(body.qty) || 1)));
  const bulkLb = Math.max(0, Math.min(20000, Number(body.bulkLb) || 0));
  const estLb = product.estLb ? product.estLb * qty : bulkLb;
  const role = ROLES.includes(str(body.role)) ? str(body.role) : "family";
  const fulfillment = (FULFILL.includes(str(body.fulfillment)) ? str(body.fulfillment) : "processor-pickup") as Fulfillment;

  const payload = {
    name: str(body.name),
    email: str(body.email),
    phone: str(body.phone),
    role,
    productId: product.id,
    species: product.species,
    dropId: drop?.id || "",
    qty,
    estLb,
    fulfillment,
    standing: Boolean(body.standing),
    standingCadence: body.standing ? str(body.standingCadence) || "every-drop" : "",
    giftTo: str(body.giftTo),
    notes: [str(body.notes), !product.estLb && bulkLb ? `About ${bulkLb} lb requested.` : ""].filter(Boolean).join("\n"),
    waitOk: Boolean(body.waitOk),
  };

  let ticket: string;
  try {
    ticket = await rpc<string>("lbc_reserve", { p: payload });
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Could not save your reservation.", 422);
  }

  const what = `${product.name}${qty > 1 ? ` × ${qty}` : ""}`;
  const where = drop
    ? `${drop.title}. Target ready date ${drop.pickupOn}, an estimate until the drop fills.`
    : `The ${speciesLabel(product.species).toLowerCase()} interest list. We will write when a farm and a drop date are set.`;

  const mail = await sendEmail({
    to: [payload.email],
    subject: `You're on the list: ${what} (${ticket})`,
    text: [
      `Hi ${payload.name},`,
      "",
      `You reserved ${what} with Local Beef Club. Ticket ${ticket}.`,
      "",
      `Drop: ${where}`,
      `How you get it: ${FULFILLMENT_LABEL[fulfillment]}.`,
      "",
      "Nothing is charged today. We do not harvest until a drop fills. After that, aging and packing take about three weeks, and we will tell you the real ready date and the final price before you pay anything.",
      "",
      "To change or cancel, just reply to this email.",
      "",
      `Local Beef Club · ${publicUrl()}`,
    ].join("\n"),
  });

  const alerts = alertRecipients();
  if (alerts.length) {
    await sendEmail({
      to: alerts,
      replyTo: payload.email,
      subject: `New reservation ${ticket}: ${what}`,
      text: `${payload.name} (${role}) · ${payload.phone} · ${payload.email}\n${what}, about ${estLb} lb\n${where}\n${FULFILLMENT_LABEL[fulfillment]}${payload.standing ? " · standing" : ""}\n${payload.notes}\n\nDesk: ${publicUrl()}/desk`,
    });
  }

  return ok({ ticket, emailed: mail.ok });
}
