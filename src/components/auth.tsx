"use client";

/**
 * Клиентская обвязка авторизации: модалка входа (Telegram-виджет + демо-форма),
 * тосты. Состояние пользователя пришло с сервера (layout → prop initialUser).
 * После успешного входа вызываем router.refresh() — сервер перечитывает куку.
 */
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PublicUser } from "@/lib/session";
import { Button, Badge } from "./ui";
import { IconX } from "./icons";

interface AuthContextValue {
  user: PublicUser | null;
  openAuth: (note?: string) => void;
  closeAuth: () => void;
  logout: () => Promise<void>;
  toast: (msg: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
}

export function AuthProvider({
  initialUser,
  telegramBotUsername,
  children,
}: {
  initialUser: PublicUser | null;
  telegramBotUsername?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(initialUser);
  const [authOpen, setAuthOpen] = useState(false);
  const [authNote, setAuthNote] = useState<string | undefined>();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState<"form" | "telegram" | null>(null);

  const toast = useCallback((msg: string) => setToastMsg(msg), []);
  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 3500);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const openAuth = useCallback((note?: string) => {
    setAuthNote(note);
    setFormError("");
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const applyLogin = useCallback(
    (u: PublicUser, greeting: string) => {
      setUser(u);
      setAuthOpen(false);
      setForm({ name: "", email: "" });
      setFormError("");
      setBusy(null);
      toast(greeting);
      router.refresh();
    },
    [router, toast]
  );

  const submitDemo = async () => {
    setBusy("form");
    setFormError("");
    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { user?: PublicUser; error?: string };
      if (!res.ok || !data.user) {
        setFormError(data.error ?? "Не удалось войти");
        return;
      }
      applyLogin(data.user, `Привет, ${data.user.name.split(" ")[0]}! Вы вошли на платформу.`);
    } catch {
      setFormError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setBusy(null);
    }
  };

  /** Колбэк официального Telegram Login Widget */
  const onTelegramAuth = useCallback(async (tgUser: Record<string, string>) => {
    setBusy("telegram");
    try {
      const res = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: tgUser }),
      });
      const data = (await res.json()) as { user?: PublicUser; error?: string };
      if (!res.ok || !data.user) {
        setFormError(data.error ?? "Не удалось войти через Telegram");
        return;
      }
      applyLogin(data.user, `Привет, ${data.user.name.split(" ")[0]}!`);
    } catch {
      setFormError("Ошибка сети при входе через Telegram.");
    } finally {
      setBusy(null);
    }
  }, [applyLogin]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    toast("Вы вышли из аккаунта");
    router.refresh();
  }, [router, toast]);

  // Подключаем официальный виджет, когда модалка открыта и есть имя бота
  useEffect(() => {
    if (!authOpen || !telegramBotUsername) return;
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", telegramBotUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "window.__onTelegramAuth__(user)");
    script.setAttribute("data-request-access", "write");
    const holder = document.getElementById("tg-widget-holder");
    holder?.appendChild(script);
    return () => {
      script.remove();
    };
  }, [authOpen, telegramBotUsername]);

  // Глобальный обработчик, который вызываем из data-onauth
  useEffect(() => {
    const w = window as unknown as { __onTelegramAuth__?: (u: Record<string, string>) => void };
    w.__onTelegramAuth__ = (u) => {
      void onTelegramAuth(u);
    };
    return () => {
      delete w.__onTelegramAuth__;
    };
  }, [onTelegramAuth]);

  const value = useMemo(
    () => ({ user, openAuth, closeAuth, logout, toast }),
    [user, openAuth, closeAuth, logout, toast]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* Модалка авторизации */}
      {authOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={closeAuth}
        >
          <div
            className="animate-fade-up w-full max-w-md rounded-2xl border border-white/10 bg-surface-2 p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Вход на платформу</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Telegram — один клик. Или демо-вход по email.
                </p>
              </div>
              <button
                className="rounded-full p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                onClick={closeAuth}
                aria-label="Закрыть"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>

            {authNote && (
              <div className="mb-4 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-brand-light">
                {authNote}
              </div>
            )}

            {/* Telegram Login Widget (официальный) */}
            {telegramBotUsername ? (
              <>
                <div className="flex min-h-[46px] items-center justify-center rounded-xl">
                  <div id="tg-widget-holder" />
                </div>
                <div className="my-5 flex items-center gap-3 text-xs text-zinc-600">
                  <span className="h-px flex-1 bg-white/10" />
                  или по email
                  <span className="h-px flex-1 bg-white/10" />
                </div>
              </>
            ) : (
              <p className="mb-4 rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-xs text-zinc-500">
                Telegram-вход не настроен: создайте бота у @BotFather и задайте TG_BOT_USERNAME и
                TG_BOT_TOKEN в .env
              </p>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-zinc-300">Имя</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Адам"
                  className="h-11 w-full rounded-xl border border-white/10 bg-surface px-4 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-brand"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-zinc-300">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && submitDemo()}
                  placeholder="adam@example.kz"
                  type="email"
                  className="h-11 w-full rounded-xl border border-white/10 bg-surface px-4 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-brand"
                />
              </div>
              {formError && <p className="text-sm text-rose-400">{formError}</p>}
              <Button size="lg" className="w-full" onClick={submitDemo} disabled={busy !== null}>
                {busy === "form" ? "Входим…" : "Войти"}
              </Button>
              {busy === "telegram" && (
                <p className="text-center text-xs text-zinc-500">Проверяем Telegram…</p>
              )}
              <p className="text-center text-xs text-zinc-500">
                Подсказка для dev: email с доменом @admin.local = администратор
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Тост */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="animate-fade-up flex items-center gap-2 rounded-full border border-brand/30 bg-surface-3 px-5 py-3 text-sm font-medium text-white shadow-2xl">
            <Badge tone="brand">OK</Badge>
            {toastMsg}
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}
