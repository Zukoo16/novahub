import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { userById, type UserRow } from "./db";

const COOKIE = "nh_session";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 дней

function secret(): string {
  return process.env.SESSION_SECRET ?? "dev-only-insecure-secret";
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString("base64url");
}

/** Подписанный токен сессии: base64url(payload) + "." + hmac */
export function signSessionToken(userId: number): string {
  const payload = b64url(JSON.stringify({ uid: userId, exp: Date.now() + TTL_MS }));
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): number | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", secret()).update(payload).digest();
  const got = Buffer.from(sig, "base64url");
  if (expected.length !== got.length || !timingSafeEqual(expected, got)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      uid: number;
      exp: number;
    };
    if (typeof data.uid !== "number" || Date.now() > data.exp) return null;
    return data.uid;
  } catch {
    return null;
  }
}

/** Текущий пользователь из куки (null, если не авторизован) */
export async function getSessionUser(): Promise<UserRow | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  const uid = verifySessionToken(token);
  if (uid === null) return null;
  return userById(uid) ?? null;
}

/**
 * Гвард для admin-API: возвращает 401/403 ответ, если не авторизован/не админ.
 * Иначе — null (продолжайте обработку).
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }
  if (!user.is_admin) {
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
  }
  return null;
}

/** Кука-пары для ответа: установить сессию */
export function sessionCookie(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_MS / 1000,
  };
}

/** Кука-пары для выхода */
export function clearSessionCookie() {
  return { name: COOKIE, value: "", httpOnly: true, path: "/", maxAge: 0 };
}

/** Утилита: новый случайный секрет (для генерации .env) */
export function generateSecret(): string {
  return randomBytes(32).toString("hex");
}

/** Приватный UserRow → публичный ответ API */
export function publicUser(u: { id: number; name: string; email: string | null; is_admin: number }): PublicUser {
  return { id: u.id, name: u.name, email: u.email, isAdmin: Boolean(u.is_admin) };
}

export interface PublicUser {
  id: number;
  name: string;
  email: string | null;
  isAdmin: boolean;
}

/** Проверка прав администратора: env ADMIN_EMAILS (через запятую) или dev-домен @admin.local */
export function isAdminEmail(email: string | null): boolean {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (list.includes(email.toLowerCase())) return true;
  if (process.env.NODE_ENV !== "production" && email.toLowerCase().endsWith("@admin.local")) {
    return true;
  }
  return false;
}
