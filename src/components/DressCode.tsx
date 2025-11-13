// components/DressCode.tsx
"use client";

import Image from "next/image";
import { Mars, Venus } from "lucide-react";
import { Great_Vibes } from "next/font/google";

type Swatch = { color: string; name?: string };

const SOFT_BORDER = "#DBEAF5";
const SOFT_ACCENT = "#8FBFD9";
const COUPLE = "/couple2.png";

// igual que tu ejemplo de “El gran día”


const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-greatvibes",
  display: "swap",
});

export default function DressCode({
  title = "Código de Vestimenta",
  message1 = "Se recomienda no usar blanco ni tonalidades similares ya que es el color de la novia.",
  message2 = "Invitados en general pueden usar tonos pasteles, colores claros o vibrantes.",
  colors = DEFAULT_COLORS,
  womenColors,
  menColors,
  className,
  titleClassName,
  captionClassName,
}: {
  title?: string;
  message1?: string;
  message2?: string;
  colors?: Swatch[];
  womenColors?: Swatch[];
  menColors?: Swatch[];
  className?: string;
  titleClassName?: string;
  captionClassName?: string;
}) {
  const w = womenColors && womenColors.length ? womenColors.slice(0, 4) : colors.slice(0, 4);
  const m = menColors && menColors.length ? menColors.slice(0, 4) : colors.slice(4, 8);

  return (
    <section
      className={[
        "relative w-full px-4 sm:px-6 py-6 sm:py-8",
        className ?? "",
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-[560px] text-center">
        <h3
          className={`text-[34px] sm:text-[40px] font-medium text-slate-800 ${titleClassName ?? ""}`}
        >
          {title}
        </h3>

        <Image
          src={COUPLE}
          alt=""
          width={120}
          height={120}
          className="pointer-events-none mx-auto mt-4"
          style={{ height: "auto" }}
          priority={false}
        />

        <p className={`mt-3 text-sm text-slate-600 ${captionClassName ?? ""}`}>
          {message1}
        </p>

        <div className="mt-6 grid gap-6">
          <PaletteGroup
            label="Damas"
            icon={<Venus className="size-4" style={{ color: SOFT_ACCENT }} />}
            colors={w}
          />
          <PaletteGroup
            label="Caballeros"
            icon={<Mars className="size-4" style={{ color: SOFT_ACCENT }} />}
            colors={m}
          />
        </div>

        <p className={`mt-6 text-sm text-slate-600 ${captionClassName ?? ""}`}>
          {message2}
        </p>
      </div>
    </section>
  );
}

function PaletteGroup({
  label,
  icon,
  colors,
}: {
  label: string;
  icon?: React.ReactNode;
  colors: Swatch[];
}) {
  return (
    <div className="mx-auto w-full max-w-[520px]">
      <div
        className={`mb-2 flex items-center justify-center gap-2 text-[24px] sm:text-[30px] font-semibold tracking-wider text-slate-500 ${greatVibes.className}`}
      >
        {icon}
        <span>{label}</span>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {colors.slice(0, 4).map((s, i) => (
          <div key={i} className="flex flex-col items-center">
            <span
              className="size-12 sm:size-14 rounded-full ring-1 shadow-inner"
              style={{
                backgroundColor: s.color,
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)",
                borderColor: SOFT_BORDER,
              }}
              aria-label={s.name ?? s.color}
              title={s.name ?? s.color}
            />
            {s.name && <span className="mt-1 text-[10px] text-slate-500">{s.name}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

const DEFAULT_COLORS: Swatch[] = [
  // Mujeres
  { color: "#77C3EC" },
  { color: "#89CFF0" },
  { color: "#9DD9F3" },
  { color: "#B8E2F2" },
  // Hombres
  { color: "#9C867C" },
  { color: "#C9B2A6" },
  { color: "#EBD8CD" },
  { color: "#C9C2BC" },
];
