"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Course, Hackathon, EventItem } from "@/lib/data";
import { categories } from "@/lib/data";
import { formatDateTime, formatDateRange, formatPrice } from "@/lib/utils";
import { Button, Badge, Card, Container } from "../ui";
import { IconPlus, IconTrash, IconEdit } from "../icons";
import { CourseForm } from "./course-form";
import { HackathonForm } from "./hackathon-form";
import { EventForm } from "./event-form";

type Tab = "courses" | "hackathons" | "events";

interface Props {
  courses: Course[];
  hackathons: Hackathon[];
  events: EventItem[];
}

async function api(path: string, method: string, body?: unknown): Promise<void> {
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; id?: string };
  if (!res.ok) throw new Error(data.error ?? "Ошибка запроса");
}

export function AdminPanel({ courses, hackathons, events }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("courses");

  // Состояние формы: null = закрыта, "new" = создание, иначе id редактируемого
  const [editing, setEditing] = useState<{ entity: Tab; id?: string } | null>(null);

  const refresh = () => {
    setEditing(null);
    router.refresh();
  };

  const catTitle = (id: string) => categories.find((c) => c.id === id)?.title ?? id;

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "courses", label: "Курсы", count: courses.length },
    { id: "hackathons", label: "Хакатоны", count: hackathons.length },
    { id: "events", label: "Мероприятия", count: events.length },
  ];

  return (
    <div className="bg-grid">
      <section className="py-14 sm:py-20">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">
                Панель управления
              </div>
              <h1 className="mt-2 text-3xl font-bold text-white">Админка</h1>
            </div>
            <Button
              onClick={() => setEditing({ entity: tab })}
              size="sm"
            >
              <IconPlus className="h-4 w-4" />
              Добавить в «{tabs.find((t) => t.id === tab)?.label.slice(0, -1)}»
            </Button>
          </div>

          {/* Табы */}
          <div className="mb-6 flex gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  setEditing(null);
                }}
                className={`h-10 rounded-full border px-5 text-sm font-medium transition ${
                  tab === t.id
                    ? "border-brand bg-brand/15 text-brand-light"
                    : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"
                }`}
              >
                {t.label} <span className="ml-1 text-xs opacity-60">{t.count}</span>
              </button>
            ))}
          </div>

          {/* Формы */}
          {editing?.entity === "courses" && (
            <div className="mb-8">
              <CourseForm
                initial={courses.find((c) => c.id === editing.id)}
                onCancel={() => setEditing(null)}
                onSubmit={async (c) => {
                  await api(
                    c.id ? `/api/admin/courses/${c.id}` : "/api/admin/courses",
                    c.id ? "PUT" : "POST",
                    c
                  );
                  refresh();
                }}
              />
            </div>
          )}
          {editing?.entity === "hackathons" && (
            <div className="mb-8">
              <HackathonForm
                initial={hackathons.find((h) => h.id === editing.id)}
                onCancel={() => setEditing(null)}
                onSubmit={async (h) => {
                  await api(
                    h.id ? `/api/admin/hackathons/${h.id}` : "/api/admin/hackathons",
                    h.id ? "PUT" : "POST",
                    h
                  );
                  refresh();
                }}
              />
            </div>
          )}
          {editing?.entity === "events" && (
            <div className="mb-8">
              <EventForm
                initial={events.find((e) => e.id === editing.id)}
                onCancel={() => setEditing(null)}
                onSubmit={async (e) => {
                  await api(
                    e.id ? `/api/admin/events/${e.id}` : "/api/admin/events",
                    e.id ? "PUT" : "POST",
                    e
                  );
                  refresh();
                }}
              />
            </div>
          )}

          {/* Список: курсы */}
          {tab === "courses" && (
            <div className="space-y-3">
              {courses.map((c) => (
                <Card key={c.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white">{c.title}</span>
                      {c.price === 0 && <Badge tone="brand">Бесплатно</Badge>}
                      {c.tag && <Badge tone="amber">{c.tag}</Badge>}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {catTitle(c.categoryId)} · {c.level} · {c.weeks} нед. · {c.format} ·{" "}
                      {formatPrice(c.price)} · мест {c.seatsTaken}/{c.seatsTotal}
                    </div>
                  </div>
                  <RowActions onEdit={() => setEditing({ entity: "courses", id: c.id })} onDelete={async () => { await api(`/api/admin/courses/${c.id}`, "DELETE"); refresh(); }} />
                </Card>
              ))}
            </div>
          )}

          {/* Список: хакатоны */}
          {tab === "hackathons" && (
            <div className="space-y-3">
              {hackathons.map((h) => (
                <Card key={h.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white">{h.title}</span>
                      <Badge tone="amber">{formatPrice(h.prizePool)}</Badge>
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {formatDateRange(h.startsAt, h.endsAt)} · {h.location} · мест {h.seatsTaken}/{h.seatsTotal}
                    </div>
                  </div>
                  <RowActions onEdit={() => setEditing({ entity: "hackathons", id: h.id })} onDelete={async () => { await api(`/api/admin/hackathons/${h.id}`, "DELETE"); refresh(); }} />
                </Card>
              ))}
            </div>
          )}

          {/* Список: мероприятия */}
          {tab === "events" && (
            <div className="space-y-3">
              {events.map((e) => (
                <Card key={e.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white">{e.title}</span>
                      <Badge tone="sky">{e.kind}</Badge>
                      {e.free && <Badge tone="brand">Бесплатно</Badge>}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {formatDateTime(e.startsAt)} · {e.location}
                    </div>
                  </div>
                  <RowActions onEdit={() => setEditing({ entity: "events", id: e.id })} onDelete={async () => { await api(`/api/admin/events/${e.id}`, "DELETE"); refresh(); }} />
                </Card>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex shrink-0 gap-2">
      <button
        onClick={onEdit}
        className="flex h-9 items-center gap-1.5 rounded-full border border-white/10 px-3.5 text-xs font-medium text-zinc-300 transition hover:border-white/25 hover:text-white"
      >
        <IconEdit className="h-3.5 w-3.5" />
        Изменить
      </button>
      <button
        disabled={busy}
        onClick={async () => {
          if (!confirm("Удалить элемент? Действие необратимо.")) return;
          setBusy(true);
          try {
            await onDelete();
          } finally {
            setBusy(false);
          }
        }}
        className="flex h-9 items-center gap-1.5 rounded-full border border-rose-400/25 px-3.5 text-xs font-medium text-rose-300 transition hover:bg-rose-400/10 disabled:opacity-50"
      >
        <IconTrash className="h-3.5 w-3.5" />
        Удалить
      </button>
    </div>
  );
}
