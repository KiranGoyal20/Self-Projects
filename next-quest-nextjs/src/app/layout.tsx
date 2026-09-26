import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import StoreProvider from "@/store/StoreProvider";
import { Navbar } from "@/components/Navbar";
import { NotificationStack } from "@/components/NotificationStack";
import { SyncEngine } from "@/components/SyncEngine";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Next.Quest — Learn Next.js by Playing",
  description:
    "An interactive, gamified Next.js learning playground with built-in coding exercises, XP, badges, streaks and an AI tutor.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-ink-950 text-ink-100 font-body antialiased">
        <StoreProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-6xl w-full mx-auto px-5 py-8 md:py-12 pb-24 md:pb-12">
              {children}
            </main>
          </div>
          <NotificationStack />
          <SyncEngine />
        </StoreProvider>
      </body>
    </html>
  );
}
