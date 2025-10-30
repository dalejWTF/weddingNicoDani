// components/Timeline.tsx
"use client";

import Image from "next/image";
import { Lora } from "next/font/google";

const HIGHLIGHT = "#A7CDE6"; // línea/puntos
const TEXTTIMELINE = "#7B7C7C";

const lora = Lora({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-lora",
  display: "swap",
});

type Item = {
  time: string;
  label: string;
  side?: "left" | "right";
  icon?: string; // ej: "/assets/church.svg"
};

export default function Timeline({
  items,
  title,
  className,
}: {
  items: Item[];
  title?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      {title && (
        <div className="mb-4 text-center">
          <div
            className={`mb-1 text-4xl tracking-wide ${lora.className}`}
            style={{ color: TEXTTIMELINE }}
          >
            {title}
          </div>
          <TitleOrnament color={HIGHLIGHT} />
        </div>
      )}

      <div className="relative mx-auto w-full max-w-[920px] px-3">
        {/* Línea vertical central (como el original) */}
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
          style={{ backgroundColor: HIGHLIGHT }}
        />

        <ol className="grid grid-cols-[max-content_1px_max-content] auto-rows-[40px] gap-y-3 justify-center">
          {items.map((it, i) => {
            const side: "left" | "right" = it.side ?? (i % 2 === 0 ? "left" : "right");
            return (
              <li key={i} className="contents">
                {/* Columna izquierda */}
                <div className="relative flex items-center justify-end pr-3 sm:pr-5">
                  {side === "left" ? (
                    <>
                      {/* líneas horizontales más largas */}
                      <span
                        className="absolute right-0 top-1/2 h-px w-12 sm:w-16"
                        style={{ backgroundColor: HIGHLIGHT }}
                      />
                      <ItemBox
                        time={it.time}
                        label={it.label}
                        align="right"
                        color={HIGHLIGHT}
                        icon={it.icon}
                      />
                    </>
                  ) : (
                    <span className="sr-only">spacer</span>
                  )}
                </div>

                {/* Punto central */}
                <div className="relative">
                  <span
                    className="absolute left-1/2 top-1/2 z-10 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: HIGHLIGHT }}
                  />
                </div>

                {/* Columna derecha */}
                <div className="relative flex items-center justify-start pl-3 sm:pl-5">
                  {side === "right" ? (
                    <>
                      {/* líneas horizontales más largas */}
                      <span
                        className="absolute left-0 top-1/2 h-px w-12 sm:w-16"
                        style={{ backgroundColor: HIGHLIGHT }}
                      />
                      <ItemBox
                        time={it.time}
                        label={it.label}
                        align="left"
                        color={HIGHLIGHT}
                        icon={it.icon}
                      />
                    </>
                  ) : (
                    <span className="sr-only">spacer</span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function ItemBox({
  time,
  label,
  align,
  color,
  icon,
}: {
  time: string;
  label: string;
  align: "left" | "right";
  color: string;
  icon?: string;
}) {
  // Icono al FINAL del item (borde externo), 25% más grande.
  // Acercamos más el icono al contenido con gap más pequeño.
  const rowDir = align === "left" ? "flex-row" : "flex-row-reverse";

  return (
    <div
      className={`w-[clamp(160px,40vw,260px)] leading-tight ${
        align === "left" ? "text-left" : "text-right"
      }`}
    >
      <div className={`flex ${rowDir} items-center justify-between gap-1`}>
        {/* Texto */}
        <div>
          <div className="text-[13px] font-extrabold uppercase tracking-wide" style={{ color }}>
            {time}
          </div>
          <div
            className="text-[11px] uppercase tracking-wide"
            style={{ color: TEXTTIMELINE }}
          >
            {label}
          </div>
        </div>

        {/* Icono final (40px base, 45px en sm+) */}
        {icon && (
          <Image
            src={icon}
            width={40}
            height={40}
            alt=""
            aria-hidden
            className="shrink-0 w-10 h-10 sm:w-[45px] sm:h-[45px]"
            priority={false}
          />
        )}
      </div>
    </div>
  );
}

/* Adorno bajo el título */
function TitleOrnament({ color }: { color: string }) {
  return (
    <svg
      aria-hidden
      className="mx-auto block h-6 w-44"
      viewBox="0 0 220 30"
      fill="none"
    >
      <g opacity="0.85" stroke={color} strokeWidth="1.2">
        <path d="M5 15 Q 35 5, 65 15" />
        <path d="M215 15 Q 185 5, 155 15" />
        <circle cx="110" cy="15" r="2.5" fill={color} />
        <path d="M85 15 Q 110 25, 135 15" />
      </g>
    </svg>
  );
}




/*


// components/Timeline.tsx
"use client";

import Image from "next/image";
import { Lora } from "next/font/google";

const HIGHLIGHT = "#A7CDE6";
const TEXTTIMELINE = "#7B7C7C";

const lora = Lora({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-lora",
  display: "swap",
});

type Item = {
  time: string;
  label: string;
  side?: "left" | "right";
  icon?: string; // ej: "/assets/church.svg"
};

export default function Timeline({
  items,
  title,
  className,
}: {
  items: Item[];
  title?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      {title && (
        <div className="mb-6 text-center">
          <div
            className={`mb-2 tracking-wide ${lora.className}`}
            style={{ color: TEXTTIMELINE, fontSize: "54px", lineHeight: 1.06 }}
          >
            {title}
          </div>
          <TitleOrnament color={HIGHLIGHT} />
        </div>
      )}

      <div className="relative mx-auto w-full max-w-[1280px] px-3">

        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
          style={{ backgroundColor: HIGHLIGHT }}
        />

        <ol className="grid grid-cols-[max-content_1px_max-content] auto-rows-[50px] gap-y-4 justify-center">
          {items.map((it, i) => {
            const side: "left" | "right" = it.side ?? (i % 2 === 0 ? "left" : "right");
            return (
              <li key={i} className="contents">

                <div className="relative flex items-center justify-end pr-3 sm:pr-6">
                  {side === "left" ? (
                    <>

                      <span
                        className="absolute right-0 top-1/2 h-px w-24 sm:w-32"
                        style={{ backgroundColor: HIGHLIGHT }}
                      />
                      <ItemBox
                        time={it.time}
                        label={it.label}
                        align="right"
                        color={HIGHLIGHT}
                        icon={it.icon}
                      />
                    </>
                  ) : (
                    <span className="sr-only">spacer</span>
                  )}
                </div>

                
                <div className="relative">
                  <span
                    className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: HIGHLIGHT, width: 12, height: 12, display: "block" }}
                  />
                </div>

                
                <div className="relative flex items-center justify-start pl-3 sm:pl-6">
                  {side === "right" ? (
                    <>
                      
                      <span
                        className="absolute left-0 top-1/2 h-px w-24 sm:w-32"
                        style={{ backgroundColor: HIGHLIGHT }}
                      />
                      <ItemBox
                        time={it.time}
                        label={it.label}
                        align="left"
                        color={HIGHLIGHT}
                        icon={it.icon}
                      />
                    </>
                  ) : (
                    <span className="sr-only">spacer</span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function ItemBox({
  time,
  label,
  align,
  color,
  icon,
}: {
  time: string;
  label: string;
  align: "left" | "right";
  color: string;
  icon?: string;
}) {
  // Ícono al final, grande; filas orientadas para que quede hacia el borde externo.
  const rowDir = align === "left" ? "flex-row" : "flex-row-reverse";

  return (
    <div
      className={`w-[clamp(260px,54vw,420px)] leading-tight ${
        align === "left" ? "text-left" : "text-right"
      }`}
    >
      <div className={`flex ${rowDir} items-center justify-between gap-2`}>
        
        <div>
          <div className="font-extrabold uppercase tracking-wide" style={{ color, fontSize: 18 }}>
            {time}
          </div>
          <div className="uppercase tracking-wide" style={{ color: TEXTTIMELINE, fontSize: 16 }}>
            {label}
          </div>
        </div>

        
        {icon && (
          <Image
            src={icon}
            width={72}
            height={72}
            alt=""
            aria-hidden
            className="shrink-0 w-[64px] h-[64px] sm:w-[72px] sm:h-[72px]"
            priority={false}
          />
        )}
      </div>
    </div>
  );
}

/* Adorno (SVG) bajo el título, más grande 
function TitleOrnament({ color }: { color: string }) {
  return (
    <svg
      aria-hidden
      className="mx-auto block h-8 w-72"
      viewBox="0 0 260 36"
      fill="none"
    >
      <g opacity="0.9" stroke={color} strokeWidth="1.4">
        <path d="M6 18 Q 44 6, 82 18" />
        <path d="M254 18 Q 216 6, 178 18" />
        <circle cx="130" cy="18" r="3" fill={color} />
        <path d="M98 18 Q 130 30, 162 18" />
      </g>
    </svg>
  );
}


*/