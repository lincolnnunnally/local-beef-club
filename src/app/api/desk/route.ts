import { cookies } from "next/headers";
import { DESK_COOKIE, deskToken, fail, ok, readJson, str } from "@/lib/api";
import { rpc } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET: everything the desk shows. POST { action }: login | logout | update | password.

export async function GET() {
  const tok = await deskToken();
  if (!tok) return fail("Sign in to the desk.", 401);
  try {
    const data = await rpc<{ reservations: unknown[]; farmers: unknown[] }>("lbc_desk_data", { tok });
    return ok(data);
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Could not load the desk.", 401);
  }
}

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return fail("Send a JSON body.");
  const action = str(body.action);
  const jar = await cookies();

  if (action === "login") {
    const tok = await rpc<string | null>("lbc_desk_login", { pw: str(body.password) }).catch(() => null);
    if (!tok) return fail("That password did not match.", 401);
    jar.set(DESK_COOKIE, tok, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return ok();
  }

  const tok = await deskToken();
  if (!tok) return fail("Sign in to the desk.", 401);

  try {
    if (action === "logout") {
      await rpc("lbc_desk_logout", { tok }).catch(() => null);
      jar.delete(DESK_COOKIE);
      return ok();
    }
    if (action === "update") {
      await rpc("lbc_desk_update", {
        tok,
        kind: str(body.kind),
        row_id: str(body.id),
        new_status: str(body.status),
        note: str(body.note),
      });
      return ok();
    }
    if (action === "password") {
      await rpc("lbc_desk_set_password", { tok, new_pw: str(body.password) });
      return ok({ message: "Password changed. Other desk sessions were signed out." });
    }
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Desk action failed.", 400);
  }
  return fail("Unknown desk action.");
}
