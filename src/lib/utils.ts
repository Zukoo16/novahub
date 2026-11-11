/** Форматирование цены: "Бесплатно" или "149 000 ₸" */
export function formatPrice(price: number): string {
  if (price === 0) return "Бесплатно";
  return `${price.toLocaleString("ru-RU")} ₸`;
}

/** Дата в стиле "21 ноя" */
export function formatDay(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }).replace(".", "");
}

/** Дата + время: "21 ноя, 18:30" */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return (
    d
      .toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
      .replace(".", "") +
    ", " +
    d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
  );
}

/** Диапазон дат: "5–6 дек" */
export function formatDateRange(fromIso: string, toIso: string): string {
  const from = new Date(fromIso);
  const to = new Date(toIso);
  const month = (d: Date) =>
    d
      .toLocaleDateString("ru-RU", { month: "short" })
      .replace(".", "");
  if (from.getMonth() === to.getMonth()) {
    return `${from.getDate()}–${to.getDate()} ${month(from)}`;
  }
  return `${from.getDate()} ${month(from)} – ${to.getDate()} ${month(to)}`;
}

/** Прогресс заполнения мест: 0..100 */
export function capacityPercent(taken: number, total: number): number {
  return Math.min(100, Math.round((taken / total) * 100));
}
