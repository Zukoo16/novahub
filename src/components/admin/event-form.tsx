"use client";

import { useState } from "react";
import type { EventItem } from "@/lib/data";
import { Field, inputCls, selectCls, textareaCls, toLocalInput, fromLocalInput } from "./fields";
import { Button } from "../ui";
import { IconX } from "../icons";

const KINDS: EventItem["kind"][] = ["Митап", "Воркшоп", "Демо-день", "Лекция"];

interface FormState {
  id?: string;
  title: string;
  kind: EventItem["kind"];
  startsAt: string;
  location: string;
  free: boolean;
  description: string;
  speaker: string;
}

function fromEvent(e?: EventItem): FormState {
  return {
    id: e?.id,
    title: e?.title ?? "",
    kind: e?.kind ?? "Митап",
    startsAt: toLocalInput(e?.startsAt ?? ""),
    location: e?.location ?? "",
    free: e?.free ?? true,
    description: e?.description ?? "",
    speaker: e?.speaker ?? "",
  };
}

export function EventForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: EventItem;
  onSubmit: (e: Omit<EventItem, "id"> & { id?: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const [f, setF] = useState<FormState>(() => fromEvent(initial));
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
    const ev: Omit<EventItem, "id"> & { id?: string } = {
      id: f.id,
      title: f.title.trim(),
      kind: f.kind,
      startsAt: fromLocalInput(f.startsAt),
      location: f.location.trim() || "Астана",
      free: f.free,
      description: f.description.trim(),
      speaker: f.speaker.trim() || undefined,
    };
    try {
      await onSubmit(ev);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-brand/30 bg-surface-2/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-white">{f.id ? "Изменить мероприятие" : "Новое мероприятие"}</h3>
        <button onClick={onCancel} className="rounded-full p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white" aria-label="Закрыть">
          <IconX className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название" className="sm:col-span-2">
          <input className={inputCls} value={f.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label="Тип">
          <select className={selectCls} value={f.kind} onChange={(e) => set("kind", e.target.value as EventItem["kind"])}>
            {KINDS.map((k) => (
              <option key={k} value={k} className="bg-surface">
                {k}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Дата и время">
          <input className={inputCls} type="datetime-local" value={f.startsAt} onChange={(e) => set("startsAt", e.target.value)} />
        </Field>
        <Field label="Локация">
          <input className={inputCls} value={f.location} onChange={(e) => set("location", e.target.value)} />
        </Field>
        <Field label="Спикер (необязательно)">
          <input className={inputCls} value={f.speaker} onChange={(e) => set("speaker", e.target.value)} />
        </Field>
        <Field label="Описание" className="sm:col-span-2">
          <textarea className={textareaCls} rows={3} value={f.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" checked={f.free} onChange={(e) => set("free", e.target.checked)} className="h-4 w-4 accent-[#2c9d62]" />
          Бесплатное
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
