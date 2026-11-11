import { NextResponse } from "next/server";
import { deleteEvent, listEvents, saveEvent } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import type { EventItem } from "@/lib/data";

const KINDS: EventItem["kind"][] = ["Митап", "Воркшоп", "Демо-день", "Лекция"];

type Params = { params: Promise<{ id: string }> };

/** Обновление мероприятия */
export async function PUT(req: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!listEvents().some((e) => e.id === id))
    return NextResponse.json({ error: "Мероприятие не найдено" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as (Omit<EventItem, "id"> & { id?: string }) | null;
  if (!body) return NextResponse.json({ error: "Пустое тело" }, { status: 400 });
  if (!KINDS.includes(body.kind))
    return NextResponse.json({ error: "Некорректный тип мероприятия" }, { status: 400 });

  const updated = saveEvent({ ...body, id });
  return NextResponse.json({ ok: true, id: updated });
}

/** Удаление мероприятия */
export async function DELETE(_req: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!listEvents().some((e) => e.id === id))
    return NextResponse.json({ error: "Мероприятие не найдено" }, { status: 404 });
  deleteEvent(id);
  return NextResponse.json({ ok: true });
}
