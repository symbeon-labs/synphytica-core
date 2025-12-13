import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google"; // Usando Google Fonts
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SynPhytica | AI Formulation Engine",
  description: "Advanced Phytotherapeutic Optimization Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrains.variable} antialiased bg-[#0a0e27] text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
