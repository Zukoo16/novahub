import type { ReactNode } from "react";

/** Обёртка поля: label + input + error */
export function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm text-zinc-300">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-400">{error}</span>}
    </label>
  );
}

export const inputCls =
  "h-10 w-full rounded-lg border border-white/10 bg-surface px-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-brand";
export const selectCls = inputCls + " appearance-none pr-8";
export const textareaCls =
  "w-full rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-brand";

/** datetime-local <-> ISO (локальный формат, без Z) */
export function toLocalInput(iso: string): string {
  return iso ? iso.slice(0, 16) : "";
}
export function fromLocalInput(v: string): string {
  if (!v) return "";
  return v.length === 16 ? `${v}:00` : v;
}

/** Число из input со значением по умолчанию */
export function toNum(v: string, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
