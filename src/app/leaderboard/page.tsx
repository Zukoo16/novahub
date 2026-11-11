import type { Metadata } from "next";
import { leaderboard } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { Badge, Button, Card, Container } from "@/components/ui";
import { IconTrophy, IconZap } from "@/components/icons";

export const metadata: Metadata = {
  title: "Лидерборд",
  description: "Топ студентов NovaHub по очкам XP",
};

const medals = ["text-amber-300", "text-zinc-300", "text-amber-600"];

export default async function LeaderboardPage() {
  const user = await getSessionUser();
  const all = leaderboard();
  const top = all.slice(0, 10);
  const myEntry = user ? all.find((e) => e.id === user.id) : undefined;
  const myRank = user ? all.findIndex((e) => e.id === user.id) + 1 : 0;
  const inTop10 = myRank > 0 && myRank <= 10;

  return (
    <div className="bg-grid">
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[640px] -translate-x-1/2 rounded-full bg-brand/15 blur-[130px]"
        />
        <Container className="relative py-12 sm:py-16">
          <div className="mb-10 max-w-2xl">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">
              Рейтинг
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Лидерборд
            </h1>
            <p className="mt-3 text-base leading-relaxed text-zinc-400">
              Проходите модули и завершайте курсы, чтобы подняться в рейтинге. Топ-10 обновляется
              в реальном времени.
            </p>
          </div>

          {/* Мой результат */}
          {user ? (
            <Card
              className={`mb-6 flex flex-wrap items-center justify-between gap-3 p-5 ${
                inTop10 ? "border-brand/40 bg-brand/8" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/20 text-sm font-bold text-brand-light">
                  {myRank > 0 ? myRank : "—"}
                </span>
                <div>
                  <div className="font-semibold text-white">Ваш результат</div>
                  <div className="text-xs text-zinc-500">
                    {myEntry
                      ? `Уровень «${myEntry.levelTitle}» · курсов до конца: ${myEntry.coursesCompleted}`
                      : "Начните с бесплатного курса, чтобы попасть в рейтинг"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xl font-bold tabular-nums text-white">
                <IconZap className="h-5 w-5 text-brand-light" />
                {(myEntry?.xp ?? 50).toLocaleString("ru-RU")}
                <span className="text-xs font-normal text-zinc-500">XP</span>
              </div>
            </Card>
          ) : (
            <Card className="mb-6 flex flex-wrap items-center justify-between gap-4 p-5">
              <p className="text-sm text-zinc-400">
                Войдите, чтобы видеть своё место в рейтинге и копить XP.
              </p>
              <Button href="/courses" size="sm">
                Выбрать курс
              </Button>
            </Card>
          )}

          {/* Топ-10 */}
          {top.length === 0 ? (
            <Card className="p-10 text-center">
              <div className="text-lg font-semibold text-white">Рейтинг пока пуст</div>
              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
                Студенты появляются здесь после регистрации на платформе.
              </p>
            </Card>
          ) : (
            <ol className="space-y-3">
              {top.map((e, i) => {
                const isMe = user?.id === e.id;
                return (
                  <li key={e.id}>
                    <Card
                      className={`flex items-center gap-4 p-4 sm:p-5 ${
                        isMe ? "border-brand/40 bg-brand/8" : ""
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-sm font-bold ${
                          i < 3 ? medals[i] : "text-zinc-500"
                        }`}
                      >
                        {i < 3 ? <IconTrophy className="h-5 w-5" /> : i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate font-semibold text-white">{e.name}</span>
                          {isMe && <Badge tone="brand">Вы</Badge>}
                        </div>
                        <div className="mt-0.5 text-xs text-zinc-500">
                          {e.levelTitle} · курсов до конца: {e.coursesCompleted}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5 text-lg font-bold tabular-nums text-white">
                        <IconZap className="h-4 w-4 text-brand-light" />
                        {e.xp.toLocaleString("ru-RU")}
                        <span className="text-xs font-normal text-zinc-500">XP</span>
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ol>
          )}

          {/* Моё место, если вне топ-10 */}
          {myEntry && myRank > 10 && (
            <Card className="mt-6 flex items-center gap-4 border-brand/25 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-sm font-bold text-zinc-300">
                {myRank}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white">{myEntry.name}</div>
                <div className="mt-0.5 text-xs text-zinc-500">
                  {myEntry.levelTitle} · место {myRank} из {all.length}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 text-lg font-bold tabular-nums text-white">
                <IconZap className="h-4 w-4 text-brand-light" />
                {myEntry.xp.toLocaleString("ru-RU")}
                <span className="text-xs font-normal text-zinc-500">XP</span>
              </div>
            </Card>
          )}
        </Container>
      </section>
    </div>
  );
}
