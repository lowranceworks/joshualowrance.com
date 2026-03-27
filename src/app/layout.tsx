import type { Metadata } from "next";
import { Cormorant_Garamond, EB_Garamond } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Joshua Lowrance",
  description: "Portfolio of Joshua Lowrance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${ebGaramond.variable}`}
    >
      <body className="flex min-h-screen justify-center bg-background scroll-smooth">
        <main className="flex w-screen max-w-[75rem] flex-col items-center px-6 pb-10 pt-7 text-[0.92rem] leading-relaxed sm:px-10 lg:px-10">
          {children}
        </main>
      </body>
    </html>
  );
}
