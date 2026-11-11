import { NextResponse } from "next/server";
import { deleteHackathon, hackathonById, saveHackathon } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import type { Hackathon } from "@/lib/data";

type Params = { params: Promise<{ id: string }> };

/** Обновление хакатона */
export async function PUT(req: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!hackathonById(id)) return NextResponse.json({ error: "Хакатон не найден" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as (Omit<Hackathon, "id"> & { id?: string }) | null;
  if (!body) return NextResponse.json({ error: "Пустое тело" }, { status: 400 });

  const updated = saveHackathon({ ...body, id });
  return NextResponse.json({ ok: true, id: updated });
}

/** Удаление хакатона */
export async function DELETE(_req: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!hackathonById(id)) return NextResponse.json({ error: "Хакатон не найден" }, { status: 404 });
  deleteHackathon(id);
  return NextResponse.json({ ok: true });
}
