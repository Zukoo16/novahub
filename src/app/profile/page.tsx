import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { enrolledCourses, userProgressMap, userXpStats } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { computeXp } from "@/lib/xp";
import { gamificationLevels } from "@/lib/data";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { Badge, Button, Card, Container } from "@/components/ui";
import { IconCertificate, IconCheck, IconClock, IconPlay, IconStar, IconZap } from "@/components/icons";

export const metadata: Metadata = {
  title: "Мой профиль",
  description: "Ваши курсы, прогресс и достижения",
};

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/");

  const courses = enrolledCourses(user.id);
  const progressMap = userProgressMap(user.id);
  const xp = computeXp(userXpStats(user.id));

  return (
    <div className="bg-grid">
      <section className="py-14 sm:py-20">
        <Container className="max-w-4xl">
          {/* Шапка профиля */}
          <Card className="overflow-hidden">
            <div className="relative h-24 bg-gradient-to-r from-brand/40 via-brand/15 to-transparent" />
            <div className="px-6 pb-6">
              <div className="-mt-10 flex items-end gap-4">
                <span className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-ink bg-brand text-3xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <div className="pb-1">
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {user.email && <span className="text-sm text-zinc-400">{user.email}</span>}
                    {user.is_admin === 1 && <Badge tone="brand">Администратор</Badge>}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* XP / уровень */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <IconZap className="h-4 w-4 text-brand-light" />
                Очки
              </div>
              <div className="mt-2 text-3xl font-bold tabular-nums text-white">
                {xp.xp.toLocaleString("ru-RU")}
              </div>
              <div className="text-xs text-zinc-500">XP</div>
            </Card>
            <Card className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Текущий уровень
              </div>
              <div className="mt-2 text-2xl font-bold text-gradient">{xp.levelTitle}</div>
              <div className="text-xs text-zinc-500">Уровень {xp.levelIndex + 1}</div>
            </Card>
            <Card className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                До следующего
              </div>
              {xp.nextXp ? (
                <>
                  <div className="mt-2 text-2xl font-bold text-white">
                    {(xp.nextXp - xp.xp).toLocaleString("ru-RU")} XP
                  </div>
                  <div className="text-xs text-zinc-500">до уровня «{xp.nextTitle}»</div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${xp.progress}%` }} />
                  </div>
                </>
              ) : (
                <div className="mt-2 text-lg font-semibold text-brand-light">Максимальный уровень</div>
              )}
            </Card>
          </div>

          {/* Мои курсы */}
          <h2 className="mb-5 mt-12 text-xl font-bold text-white">
            Мои курсы{" "}
            <span className="text-sm font-normal text-zinc-500">({courses.length})</span>
          </h2>

          {courses.length === 0 ? (
            <Card className="p-10 text-center">
              <div className="text-lg font-semibold text-white">Вы ещё не записаны ни на один курс</div>
              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
                Загляните в каталог — там есть бесплатные курсы по ИИ, данным и разработке.
              </p>
              <Button href="/courses" className="mt-5">
                Смотреть курсы
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {courses.map((c) => {
                const prog = progressMap.get(c.id);
                const pct = prog?.pct ?? 0;
                const doneCount = prog?.completed.length ?? 0;
                const total = prog?.total ?? c.syllabus.length;
                const done = prog?.done ?? false;
                return (
                  <Card key={c.id} className="p-5 transition hover:border-brand/40">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            done ? "bg-brand text-white" : "bg-brand/15 text-brand-light"
                          }`}
                        >
                          {done ? <IconCertificate className="h-5 w-5" /> : <IconCheck className="h-5 w-5" />}
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/courses/${c.id}`}
                            className="font-semibold text-white transition hover:text-brand-light"
                          >
                            {c.title}
                          </Link>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                            <span className="inline-flex items-center gap-1.5">
                              <IconClock className="h-3.5 w-3.5" />
                              {c.weeks} нед. · {c.format}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <IconStar className="h-3.5 w-3.5 text-amber-300" />
                              {c.rating.toFixed(1)}
                            </span>
                            <span>Старт: {formatDateTime(c.startsAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-4">
                        <span className="text-sm font-bold text-white">{formatPrice(c.price)}</span>
                        <Button
                          href={`/courses/${c.id}/learn`}
                          variant={done ? "outline" : "primary"}
                          size="sm"
                        >
                          {done ? (
                            <>
                              <IconCertificate className="h-4 w-4 text-brand-light" />
                              Сертификат
                            </>
                          ) : (
                            <>
                              <IconPlay className="h-4 w-4" />
                              Продолжить
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className={done ? "font-medium text-brand-light" : "text-zinc-500"}>
                          {done ? "Курс завершён" : `Прогресс ${pct}%`}
                        </span>
                        <span className="text-zinc-500">
                          {doneCount} из {total} модулей
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Лестница уровней */}
          <h2 className="mb-5 mt-12 text-xl font-bold text-white">Лестница уровней</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {gamificationLevels.map((lvl, i) => {
              const reached = xp.xp >= lvl.xp;
              const isCurrent = i === xp.levelIndex;
              return (
                <Card
                  key={lvl.title}
                  className={`flex items-center justify-between p-4 ${
                    isCurrent ? "border-brand/40 bg-brand/8" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                        reached ? "bg-brand text-white" : "bg-white/8 text-zinc-500"
                      }`}
                    >
                      {reached ? <IconCheck className="h-4 w-4" /> : i + 1}
                    </span>
                    <div>
                      <div className={`font-semibold ${reached ? "text-white" : "text-zinc-400"}`}>
                        {lvl.title}
                      </div>
                      <div className="text-xs text-zinc-500">{lvl.perks}</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-zinc-500">
                    {lvl.xp.toLocaleString("ru-RU")} XP
                  </span>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
