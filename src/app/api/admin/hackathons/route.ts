import { NextResponse } from "next/server";
import { listHackathons, saveHackathon } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import type { Hackathon } from "@/lib/data";

/** Список хакатонов (для админки) */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ hackathons: listHackathons() });
}

/** Создание хакатона */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as (Omit<Hackathon, "id"> & { id?: string }) | null;
  if (!body) return NextResponse.json({ error: "Пустое тело" }, { status: 400 });
  if (!body.title || body.title.trim().length < 3)
    return NextResponse.json({ error: "Название обязательно (от 3 символов)" }, { status: 400 });
  if (!body.startsAt || !body.endsAt)
    return NextResponse.json({ error: "Укажите даты" }, { status: 400 });

  const id = saveHackathon(body);
  return NextResponse.json({ ok: true, id });
}
