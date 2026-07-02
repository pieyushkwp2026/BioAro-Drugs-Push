import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CorporateNavbar } from "@/components/ui/CorporateNavbar";
import { CorporateFooter } from "@/components/ui/CorporateFooter";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "BioAro | Personalized Healthcare Intelligence",
  description:
    "BioAro connects advanced diagnostics and science-backed wellness through one precision-health ecosystem.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} bg-bioaro-bg font-body text-bioaro-text antialiased`}
      >
        <CorporateNavbar />
        <main>{children}</main>
        <CorporateFooter />
      </body>
    </html>
  );
}
