import Link from "next/link";
import { config } from "@/lib/config";
import { CurrentYear } from "./current-year";
import { Container } from "./ui";
import { IconZap } from "./icons";

const columns = [
  {
    title: "Платформа",
    links: [
      { href: "/#categories", label: "Направления" },
      { href: "/courses", label: "Курсы" },
      { href: "/hackathons", label: "Хакатоны" },
      { href: "/events", label: "Мероприятия" },
    ],
  },
  {
    title: "Ресурсы",
    links: [
      { href: "/about", label: "О платформе" },
      { href: "/#gamification", label: "Геймификация" },
      { href: "/#certificate", label: "Сертификаты" },
      { href: "/about", label: "FAQ" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <Container className="flex flex-col gap-10 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
                <IconZap className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold text-white">
                Nova<span className="text-brand-light">Hub</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">{config.tagline}.</p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-2">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-zinc-400 transition-colors hover:text-brand-light"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Соцсети
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href={config.socials.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-400 transition-colors hover:text-[#2AABEE]"
                  >
                    Telegram
                  </a>
                </li>
                <li>
                  <a
                    href={config.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-400 transition-colors hover:text-[#E1306C]"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={config.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-400 transition-colors hover:text-[#0A66C2]"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© <CurrentYear /> {config.name}. Все права защищены.</p>
          <div className="flex gap-5">
            <a href="#" className="transition hover:text-white">
              Политика конфиденциальности
            </a>
            <a href="#" className="transition hover:text-white">
              Условия использования
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
