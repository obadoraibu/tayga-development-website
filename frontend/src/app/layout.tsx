import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin", "cyrillic"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "Taiga Development | Строительная компания",
  description: "Современные жилые комплексы",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${montserrat.variable} font-sans bg-taiga-light text-taiga-dark antialiased`}>
        {children}
      </body>
    </html>
  );
}

