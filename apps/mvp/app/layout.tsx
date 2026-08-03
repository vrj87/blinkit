import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { BackToTop } from "@/components/BackToTop";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-blinkit",
});

export const metadata: Metadata = {
  title: "Smart Category Explorer | Blinkit",
  description:
    "AI-native post-delivery category recommendations powered by discovery research and Groq LLM",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0c831f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={jakarta.className}>
        <div className="blinkit-chrome">
          <div className="blinkit-topstrip">
            <span className="blinkit-topstrip-pill">⚡ 10 min delivery</span>
            <span className="blinkit-topstrip-text">Smart Category Explorer · Blinkit growth demo</span>
          </div>
          <header className="blinkit-brandbar">
            <a href="/playground" className="blinkit-logo" aria-label="Blinkit home — back to project overview">
              blink<span>it</span>
            </a>
            <a href="/mvp" className="blinkit-brandbar-tag blinkit-brandbar-mvp">
              Smart Category Explorer
            </a>
            <a href="/playground" className="blinkit-brandbar-tag blinkit-brandbar-overview">
              ← Overview
            </a>
          </header>
        </div>
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
