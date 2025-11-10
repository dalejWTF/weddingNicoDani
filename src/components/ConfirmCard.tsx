// components/ConfirmCard.tsx
"use client";

import * as React from "react";
import { CheckCircle2, CalendarCheck2 } from "lucide-react";
import RsvpButton from "@/components/RsvpButton";

const SOFT_BORDER = "#DBEAF5";

type Family = { id: string; nombreFamilia: string; nroPersonas: number };

export default function ConfirmCard({
  confirmed,
  checking,
  prefillFamilyId,
  prefillFamily,
  onConfirmed,
  className,
  titleClassName,   // p.ej. greatVibes.className
  textClassName,    // p.ej. lora.className
  deadlineText = "Por favor confirma tu asistencia antes del 10 de diciembre de 2025",
  titleWhenOpen = "Confirmar asistencia",
  titleWhenDone = "¡Gracias por confirmar!",
  hideIfNoPrefill = true, // ⬅️ oculta toda la tarjeta si no hay id
}: {
  confirmed: boolean;
  checking?: boolean;
  prefillFamilyId?: string;
  prefillFamily?: Family;
  onConfirmed?: () => void;
  className?: string;
  titleClassName?: string;
  textClassName?: string;
  deadlineText?: string;
  titleWhenOpen?: string;
  titleWhenDone?: string;
  hideIfNoPrefill?: boolean;
}) {
  const hasPrefill = Boolean(prefillFamilyId || prefillFamily);
  if (hideIfNoPrefill && !hasPrefill) return null;

  return (
    <section className={`w-full ${className ?? ""}`}>
      <div
        className="mx-auto w-full max-w-[520px] rounded-3xl px-6 py-8 text-center"
        style={{
          backgroundColor: "#FFFFFF",
          border: `1px solid ${SOFT_BORDER}`,
          boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
        }}
      >
        {/* encabezado */}
        <div className="mx-auto grid place-items-center">
          <div
            className="grid place-items-center rounded-2xl"
            aria-hidden
            style={{ width: 48, height: 48, backgroundColor: "#F7FBFE", border: `1px solid ${SOFT_BORDER}` }}
          >
            {confirmed ? (
              <CheckCircle2 className="size-6" style={{ color: "#22C55E" }} />
            ) : (
              <CalendarCheck2 className="size-6" style={{ color: "#8FBFD9" }} />
            )}
          </div>
        </div>

        <h3 className={`mt-4 text-4xl sm:text-5xl ${titleClassName ?? ""}`} style={{ color: "#0B1B2B" }}>
          {confirmed ? titleWhenDone : titleWhenOpen}
        </h3>

        {!confirmed ? (
          <>
            <p className={`mt-2 text-sm text-slate-600 ${textClassName ?? ""}`}>{deadlineText}</p>

            {/* Botón (oculto si está confirmado o mientras chequea) */}
            {hasPrefill && !checking && (
              <div className="mt-5">
                <RsvpButton
                  triggerLabel="Confirmar"
                  prefillFamilyId={prefillFamilyId}
                  prefillFamily={prefillFamily}
                  greetingTemplate="{{nombre}}"
                  titleClassName ={titleClassName}
                  textClassName={textClassName}
                  note="Nos encantará contar con tu presencia. Con su confirmación, nos ayudará a planificar mejor este día tan especial."
                  requirePrefill // ⬅️ exige id
                  onConfirmed={onConfirmed}  
                />
              </div>
            )}

            <p className={`mt-3 text-xs text-slate-500 ${textClassName ?? ""}`} style={{ lineHeight: 1.4 }}>
              Si necesitas actualizar tu respuesta más adelante, contáctanos.
            </p>
          </>
        ) : (
          <p className={`mt-2 text-sm text-slate-600 ${textClassName ?? ""}`}>
            ¡Nos hace mucha ilusión compartir este día contigo! 💙
          </p>
        )}
      </div>
    </section>
  );
}
