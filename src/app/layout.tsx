// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Tangerine, Inter } from "next/font/google";
export const metadata: Metadata = { title: "Invitación de Boda" };

const tangerine = Tangerine({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-tangerine",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${tangerine.variable} ${inter.variable} bg-rose-50 max-w-[100dvw] overflow-x-clip`}
    >
      <body className="antialiased font-sans max-w-[100dvw] w-full overflow-x-clip">
        {children}
      </body>
    </html>
  );
}