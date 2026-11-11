import { NextResponse } from "next/server";
import { upsertUser } from "@/lib/db";
import { isAdminEmail, publicUser, sessionCookie, signSessionToken } from "@/lib/session";

/**
 * Демо-вход по имени и email (без пароля).
 * Права администратора: email из ADMIN_EMAILS (.env),
 * в dev-режиме дополнительно — домен @admin.local.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { name?: string; email?: string } | null;
  const name = (body?.name ?? "").trim();
  const email = (body?.email ?? "").trim().toLowerCase();

  if (name.length < 2) {
    return NextResponse.json({ error: "Введите имя (минимум 2 символа)" }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Введите корректный email" }, { status: 400 });
  }

  const user = upsertUser({ name, email, isAdmin: isAdminEmail(email) });
  const res = NextResponse.json({ ok: true, user: publicUser(user) });
  res.cookies.set(sessionCookie(signSessionToken(user.id)));
  return res;
}
