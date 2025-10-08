// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import EnableScrollOnMount from "@/components/EnableScrollOnMount";

export const metadata: Metadata = { title: "Invitación de Boda" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className="bg-rose-50 overflow-x-hidden no-scroll-on-load" // <- oculta scroll vertical de inicio
    >
      <body className="min-h-dvh antialiased text-neutral-800 overflow-x-hidden no-scroll-on-load">
        {children}
        <EnableScrollOnMount /> {/* vuelve a habilitar el scroll al montar */}
      </body>
    </html>
  );
}