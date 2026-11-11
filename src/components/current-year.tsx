"use client";

import { useEffect, useState } from "react";

/** Текущий год (SSR-safe: рендерится на клиенте) */
export function CurrentYear() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only значение (год) после гидратации
    setYear(new Date().getFullYear());
  }, []);
  return <>{year ?? 2026}</>;
}
