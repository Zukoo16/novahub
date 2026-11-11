import { NextResponse } from "next/server";
import { listEvents, saveEvent } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import type { EventItem } from "@/lib/data";

const KINDS: EventItem["kind"][] = ["Митап", "Воркшоп", "Демо-день", "Лекция"];

/** Список мероприятий (для админки) */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ events: listEvents(), kinds: KINDS });
}

/** Создание мероприятия */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as (Omit<EventItem, "id"> & { id?: string }) | null;
  if (!body) return NextResponse.json({ error: "Пустое тело" }, { status: 400 });
  if (!body.title || body.title.trim().length < 3)
    return NextResponse.json({ error: "Название обязательно (от 3 символов)" }, { status: 400 });
  if (!KINDS.includes(body.kind))
    return NextResponse.json({ error: "Некорректный тип мероприятия" }, { status: 400 });

  const id = saveEvent(body);
  return NextResponse.json({ ok: true, id });
}
