"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PublicUser } from "@/lib/session";
import { useAuth } from "./auth";
import { Button } from "./ui";
import { IconMenu, IconX, IconZap, IconArrowRight } from "./icons";

const nav = [
  { href: "/#categories", label: "Направления" },
  { href: "/courses", label: "Курсы" },
  { href: "/hackathons", label: "Хакатоны" },
  { href: "/events", label: "Мероприятия" },
  { href: "/leaderboard", label: "Лидерборд" },
  { href: "/about", label: "О платформе" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-[0_0_20px_-4px_rgba(44,157,98,0.8)]">
        <IconZap className="h-5 w-5" />
      </span>
      <span className="text-lg font-bold tracking-tight text-white">
        Nova<span className="text-brand-light">Hub</span>
      </span>
    </Link>
  );
}

function UserMenu({ user }: { user: PublicUser }) {
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const items: { href?: string; label: string; action?: () => void }[] = [
    { href: "/profile", label: "Мой профиль" },
    ...(user.isAdmin ? [{ href: "/admin", label: "Админка" }] : []),
    {
      label: "Выйти",
      action: async () => {
        setLoggingOut(true);
        await logout();
      },
    },
  ];

  return (
    <div className="group relative">
      <button className="flex items-center gap-2.5 rounded-full border border-white/10 py-1.5 pl-1.5 pr-4 transition hover:border-white/25">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/20 text-sm font-bold text-brand-light">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="max-w-[120px] truncate text-sm font-medium text-white">
          {user.name.split(" ")[0]}
        </span>
      </button>
      <div className="invisible absolute right-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
        <div className="w-48 rounded-xl border border-white/10 bg-surface-2 p-1.5 shadow-xl">
          {user.email && <div className="px-3 py-2 text-xs text-zinc-500">{user.email}</div>}
          {user.isAdmin && (
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-brand-light">
              Администратор
            </div>
          )}
          {items.map((it) =>
            it.action ? (
              <button
                key={it.label}
                onClick={it.action}
                disabled={loggingOut}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                {loggingOut ? "Выходим…" : it.label}
              </button>
            ) : (
              <Link
                key={it.label}
                href={it.href!}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
              >
                {it.label}
                <IconArrowRight className="h-3.5 w-3.5 opacity-40" />
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export function Header({ user }: { user: PublicUser | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { openAuth, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Закрываем мобильное меню при смене страницы
  // eslint-disable-next-line react-hooks/set-state-in-effect -- синхронизация состояния меню при навигации
  useEffect(() => setOpen(false), [pathname]);

  const goProfile = () => {
    setOpen(false);
    router.push(user ? "/profile" : "/");
    if (!user) openAuth("Войдите, чтобы открыть профиль");
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled || open
          ? "border-b border-white/10 bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Десктоп-навигация */}
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-white/8 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button variant="primary" size="sm" onClick={() => openAuth()}>
              Войти
            </Button>
          )}
        </div>

        {/* Мобильное меню */}
        <button
          className="rounded-lg p-2 text-zinc-300 transition hover:bg-white/5 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
        >
          {open ? <IconX className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
      </div>

      {/* Мобильная навигация */}
      {open && (
        <div className="border-t border-white/10 bg-ink/95 px-4 pb-5 pt-3 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 text-base font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 border-t border-white/10 pt-4">
              {user ? (
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-sm font-bold text-brand-light">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-white">{user.name}</div>
                      {user.isAdmin && (
                        <div className="text-[10px] uppercase tracking-wider text-brand-light">
                          Администратор
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={goProfile}>
                      Профиль
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setOpen(false);
                        void logout();
                      }}
                    >
                      Выйти
                    </Button>
                  </div>
                </div>
              ) : (
                <Button className="w-full" onClick={() => openAuth()}>
                  Войти
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
