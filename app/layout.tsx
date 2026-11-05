import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { Scene } from "@/components/ui/scene";
import "./globals.css";

const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "SmartFinance",
  description: "Organize seus gastos com clareza e tranquilidade.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2C4C40",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={sans.variable}>
      <body>
        <Scene />
        {children}
      </body>
    </html>
  );
}
