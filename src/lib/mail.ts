// Same Resend call Plenty uses (plenty/src/lib/notify.ts sendNoticeEmail), trimmed to what this app needs.

export function mailReady() {
  return Boolean(process.env.RESEND_API_KEY);
}

function from() {
  return process.env.RESEND_FROM || "Local Beef Club <beef@emails.unitedundergod.org>";
}

function escape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function sendEmail(input: { to: string[]; subject: string; text: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = input.to.map((e) => e.trim()).filter(Boolean);
  if (!key || !to.length) return { ok: false, error: key ? "No recipient." : "Email is not configured." };
  const html = `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.5;white-space:pre-wrap">${escape(input.text)}</div>`;
  const body: Record<string, unknown> = { from: from(), to, subject: input.subject, text: input.text, html };
  if (input.replyTo) body.reply_to = input.replyTo;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return { ok: false, error: `Resend ${res.status}` };
    return { ok: true, error: "" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Email failed." };
  }
}

/** Optional: comma-separated addresses that hear about every new reservation and farmer sign-up. */
export function alertRecipients() {
  return (process.env.LBC_ALERT_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);
}

export function publicUrl() {
  return (process.env.APP_PUBLIC_URL || "https://beef.unitedundergod.org").replace(/\/$/, "");
}
