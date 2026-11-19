import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Same small helpers Plenty uses (plenty/src/lib/api.ts).

export async function readJson(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export function ok(extra: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: true, ...extra });
}

export function str(value: unknown, fallback = "") {
  return String(value ?? fallback).trim();
}

export const DESK_COOKIE = "lbc_desk";

export async function deskToken() {
  const jar = await cookies();
  return jar.get(DESK_COOKIE)?.value || "";
}
