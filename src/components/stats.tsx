import { stats } from "@/lib/data";
import { Container } from "./ui";
import { Counter } from "./counter";

/** Секция со статистикой (серверный компонент) */
export function Stats() {
  return (
    <section className="border-y border-white/5 bg-surface/60">
      <Container className="grid grid-cols-2 gap-y-8 py-10 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1 text-center">
            <span className="text-3xl font-bold text-white sm:text-4xl">
              <Counter value={s.value} suffix={s.suffix} />
            </span>
            <span className="text-sm text-zinc-500">{s.label}</span>
          </div>
        ))}
      </Container>
    </section>
  );
}
