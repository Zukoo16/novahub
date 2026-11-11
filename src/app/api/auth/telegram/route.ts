import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { upsertUser } from "@/lib/db";
import { publicUser, sessionCookie, signSessionToken } from "@/lib/session";

/**
 * Вход через официальный Telegram Login Widget.
 * Виджет шлёт POST с объектом data (id, first_name, username, hash, …).
 * Валидация: data-check-string + HMAC-SHA256, секрет = sha256(bot_token + "bot").
 */
export async function POST(req: Request) {
  const token = process.env.TG_BOT_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Telegram-вход не настроен. Задайте TG_BOT_TOKEN в .env" },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => null)) as { data?: Record<string, string> } | null;
  const data = body?.data;
  if (!data || typeof data !== "object" || !data.hash) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }

  const secret = createHash("sha256").update(token + "bot").digest();
  const { hash, ...rest } = data;

  const checkString = Object.keys(rest)
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join("\n");
  const expected = createHmac("sha256", secret).update(checkString).digest();
  const got = Buffer.from(hash, "hex");
  if (expected.length !== got.length || !timingSafeEqual(expected, got)) {
    return NextResponse.json({ error: "Подпись Telegram не совпадает" }, { status: 401 });
  }

  const name = [rest.first_name, rest.last_name].filter(Boolean).join(" ") || "Пользователь";
  const user = upsertUser({
    name,
    email: rest.username ? `${rest.username}@telegram.local` : null,
    tgId: rest.id,
  });

  const res = NextResponse.json({ ok: true, user: publicUser(user) });
  res.cookies.set(sessionCookie(signSessionToken(user.id)));
  return res;
}
