import { SPECIES } from "@/lib/catalog";
import { fail, ok, readJson, str } from "@/lib/api";
import { rpc } from "@/lib/db";
import { alertRecipients, publicUrl, sendEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return fail("Send the form again.");
  if (str(body.company)) return ok({});

  const allowed = SPECIES.map((s) => s.id as string);
  const species = (Array.isArray(body.species) ? body.species : []).map((s) => str(s)).filter((s) => allowed.includes(s));
  if (!species.length) return fail("Tick at least one animal you raise.");

  const payload = {
    name: str(body.name),
    farmName: str(body.farmName),
    email: str(body.email),
    phone: str(body.phone),
    area: str(body.area),
    species,
    practices: str(body.practices),
    processor: str(body.processor),
    available: str(body.available),
    notes: str(body.notes),
  };

  try {
    await rpc<string>("lbc_farmer_apply", { p: payload });
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Could not save that.", 422);
  }

  if (payload.email) {
    await sendEmail({
      to: [payload.email],
      subject: "Local Beef Club got your farm's note",
      text: [
        `Hi ${payload.name},`,
        "",
        "Thank you for telling us about your farm. Someone from Local Beef Club will call you to talk through what you raise, how you raise it, who processes it, and what price works for you.",
        "",
        "Nothing about your farm goes on the site until you have said it is right.",
        "",
        `Local Beef Club · ${publicUrl()}`,
      ].join("\n"),
    });
  }

  const alerts = alertRecipients();
  if (alerts.length) {
    await sendEmail({
      to: alerts,
      replyTo: payload.email || undefined,
      subject: `New farm: ${payload.farmName || payload.name} (${species.join(", ")})`,
      text: `${payload.name} · ${payload.phone} · ${payload.email}\n${payload.farmName} · ${payload.area}\nRaises: ${species.join(", ")}\nPractices: ${payload.practices}\nProcessor: ${payload.processor}\nAvailable: ${payload.available}\n${payload.notes}\n\nDesk: ${publicUrl()}/desk`,
    });
  }

  return ok({});
}
