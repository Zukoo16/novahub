"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth";
import { Button } from "./ui";
import { IconCheck } from "./icons";

/**
 * Кнопка «Записаться» через API. Требует вход.
 * initialEnrolled — изначальное состояние (из серверной страницы).
 */
export function EnrollButton({
  courseId,
  courseTitle,
  initialEnrolled = false,
  size = "md",
  className = "",
}: {
  courseId: string;
  courseTitle: string;
  initialEnrolled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { user, openAuth, toast } = useAuth();
  const router = useRouter();
  const [enrolled, setEnrolled] = useState(initialEnrolled);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onClick = async () => {
    if (!user) {
      openAuth("Войдите, чтобы записаться на курс. Это займёт 10 секунд.");
      return;
    }
    if (enrolled || busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Не удалось записаться");
        return;
      }
      setEnrolled(true);
      toast(`Вы записаны на «${courseTitle}»`);
      router.refresh();
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  };

  if (enrolled) {
    return (
      <Button variant="outline" size={size} disabled className={className}>
        <IconCheck className="h-4 w-4 text-brand-light" />
        Вы записаны
      </Button>
    );
  }

  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      <Button size={size} onClick={onClick} disabled={busy} className="w-full">
        {busy ? "Записываем…" : user ? "Записаться" : "Войти и записаться"}
      </Button>
      {error && <p className="text-center text-xs text-rose-400">{error}</p>}
    </div>
  );
}
