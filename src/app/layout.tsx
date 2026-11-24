import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes, Montserrat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-vibes",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rida  & Usman  — Royal Wedding Invitation",
  description: "Celebrate the union of Rida  & Usman . Sunday, 15 November 2026 at Victoria Marquee, Faisalabad.",
  keywords: ["Wedding", "Invitation", "Rida  and Usman ", "Royal Wedding", "Faisalabad"],
  openGraph: {
    title: "Rida  & Usman  — Royal Wedding Invitation",
    description: "Join us in celebrating the beginning of our forever.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${greatVibes.variable} ${montserrat.variable}`}>
      <body className="antialiased font-serif bg-[#18231c] text-[#3e342b] overflow-x-hidden selection:bg-[#c5a059]/30">
        {children}
      </body>
    </html>
  );
}
