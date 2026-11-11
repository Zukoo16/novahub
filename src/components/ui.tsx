import Link from "next/link";
import type { ReactNode } from "react";

/* ---------- Кнопка ---------- */
type ButtonVariant = "primary" | "outline" | "ghost";

const btnStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-light/90 active:bg-brand shadow-[0_0_24px_-6px_rgba(44,157,98,0.7)]",
  outline: "border border-white/15 text-white hover:bg-white/5 hover:border-white/30",
  ghost: "text-zinc-300 hover:text-white hover:bg-white/5",
};

const btnSizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-base",
};

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: keyof typeof btnSizes;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  disabled,
  type = "button",
}: ButtonProps) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 cursor-pointer select-none ${btnStyles[variant]} ${btnSizes[size]} ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick as never}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

/* ---------- Бейдж ---------- */
export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "amber" | "sky" | "rose";
  className?: string;
}) {
  const tones = {
    neutral: "bg-white/8 text-zinc-300 border-white/10",
    brand: "bg-brand/15 text-brand-light border-brand/30",
    amber: "bg-amber-400/10 text-amber-300 border-amber-400/25",
    sky: "bg-sky-400/10 text-sky-300 border-sky-400/25",
    rose: "bg-rose-400/10 text-rose-300 border-rose-400/25",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* ---------- Контейнер ---------- */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

/* ---------- Заголовок секции ---------- */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      {eyebrow && (
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">{eyebrow}</div>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-zinc-400">{subtitle}</p>}
    </div>
  );
}

/* ---------- Карточка ---------- */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-surface-2/60 backdrop-blur transition-colors ${className}`}
    >
      {children}
    </div>
  );
}
