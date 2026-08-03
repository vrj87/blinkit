import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Collect & Normalize",
  description: "Review collection for quick-commerce category discovery",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="blinkit-collect-bar">⚡ Feeds discovery pipeline · data/discovery</div>
        {children}
      </body>
    </html>
  );
}
