"use client";

import { useState } from "react";
import type { Hackathon } from "@/lib/data";
import { Field, inputCls, textareaCls, toLocalInput, fromLocalInput, toNum } from "./fields";
import { Button } from "../ui";
import { IconX } from "../icons";

interface FormState {
  id?: string;
  title: string;
  theme: string;
  startsAt: string;
  endsAt: string;
  location: string;
  online: boolean;
  prizePool: string;
  seatsTotal: string;
  seatsTaken: string;
  description: string;
  tracks: string;
}

function fromHackathon(h?: Hackathon): FormState {
  return {
    id: h?.id,
    title: h?.title ?? "",
    theme: h?.theme ?? "",
    startsAt: toLocalInput(h?.startsAt ?? ""),
    endsAt: toLocalInput(h?.endsAt ?? ""),
    location: h?.location ?? "",
    online: h?.online ?? false,
    prizePool: String(h?.prizePool ?? 0),
    seatsTotal: String(h?.seatsTotal ?? 100),
    seatsTaken: String(h?.seatsTaken ?? 0),
    description: h?.description ?? "",
    tracks: (h?.tracks ?? []).join(", "),
  };
}

export function HackathonForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Hackathon;
  onSubmit: (h: Omit<Hackathon, "id"> & { id?: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const [f, setF] = useState<FormState>(() => fromHackathon(initial));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    if (f.title.trim().length < 3) {
      setError("Название обязательно (от 3 символов)");
      return;
    }
    setBusy(true);
    setError("");
    const h: Omit<Hackathon, "id"> & { id?: string } = {
      id: f.id,
      title: f.title.trim(),
      theme: f.theme.trim(),
      startsAt: fromLocalInput(f.startsAt),
      endsAt: fromLocalInput(f.endsAt),
      location: f.location.trim() || "Астана",
      online: f.online,
      prizePool: toNum(f.prizePool, 0),
      seatsTotal: toNum(f.seatsTotal, 100),
      seatsTaken: toNum(f.seatsTaken, 0),
      description: f.description.trim(),
      tracks: f.tracks.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      await onSubmit(h);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-brand/30 bg-surface-2/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-white">{f.id ? "Изменить хакатон" : "Новый хакатон"}</h3>
        <button onClick={onCancel} className="rounded-full p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white" aria-label="Закрыть">
          <IconX className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название" className="sm:col-span-2">
          <input className={inputCls} value={f.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label="Тема" className="sm:col-span-2">
          <input className={inputCls} value={f.theme} onChange={(e) => set("theme", e.target.value)} />
        </Field>
        <Field label="Начало">
          <input className={inputCls} type="datetime-local" value={f.startsAt} onChange={(e) => set("startsAt", e.target.value)} />
        </Field>
        <Field label="Конец">
          <input className={inputCls} type="datetime-local" value={f.endsAt} onChange={(e) => set("endsAt", e.target.value)} />
        </Field>
        <Field label="Локация">
          <input className={inputCls} value={f.location} onChange={(e) => set("location", e.target.value)} />
        </Field>
        <Field label="Призовой фонд, ₸">
          <input className={inputCls} type="number" min={0} value={f.prizePool} onChange={(e) => set("prizePool", e.target.value)} />
        </Field>
        <Field label="Мест всего">
          <input className={inputCls} type="number" min={1} value={f.seatsTotal} onChange={(e) => set("seatsTotal", e.target.value)} />
        </Field>
        <Field label="Мест занято">
          <input className={inputCls} type="number" min={0} value={f.seatsTaken} onChange={(e) => set("seatsTaken", e.target.value)} />
        </Field>
        <Field label="Треки (через запятую)" className="sm:col-span-2">
          <input className={inputCls} value={f.tracks} onChange={(e) => set("tracks", e.target.value)} placeholder="Агенты, Fintech, Open Data" />
        </Field>
        <Field label="Описание" className="sm:col-span-2">
          <textarea className={textareaCls} rows={3} value={f.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-zinc-300 sm:col-span-2">
          <input type="checkbox" checked={f.online} onChange={(e) => set("online", e.target.checked)} className="h-4 w-4 accent-[#2c9d62]" />
          Есть онлайн-трек
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
      <div className="mt-5 flex gap-3">
        <Button onClick={submit} disabled={busy}>
          {busy ? "Сохраняем…" : "Сохранить"}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </div>
  );
}
