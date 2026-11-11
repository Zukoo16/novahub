import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/components/auth";
import { config } from "@/lib/config";
import { getSessionUser, publicUser } from "@/lib/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
});

export const metadata: Metadata = {
  title: {
    default: `${config.name} — ${config.tagline}`,
    template: `%s · ${config.name}`,
  },
  description: config.taglineShort,
  keywords: ["курсы", "ИИ", "стартапы", "хакатоны", "митапы", "образование", config.city],
  openGraph: {
    title: `${config.name} — ${config.tagline}`,
    description: config.taglineShort,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070a",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const sessionUser = await getSessionUser();

  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-ink">
        <AuthProvider
          initialUser={sessionUser ? publicUser(sessionUser) : null}
          telegramBotUsername={process.env.TG_BOT_USERNAME || undefined}
        >
          <Header user={sessionUser ? publicUser(sessionUser) : null} />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
