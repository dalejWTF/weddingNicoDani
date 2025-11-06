// components/RecGiftsSection.tsx
"use client";

import * as React from "react";
import { Gift, Sparkles, Banknote } from "lucide-react";
import InfoCard from "@/components/InfoCard";
import { Button } from "@/components/ui/button";
import BankAccountsDialog, { type BankAccount } from "@/components/BankAccountsDialog";

const SOFT_BTN_BG = "#EAF3FB";
const SOFT_BTN_BG_HOVER = "#E1EEF8";
const SOFT_TEXT = "#0F172A";

// util para CSS vars sin any
type CSSVarProps<T extends string> = React.CSSProperties & Record<T, string>;

export default function RecGiftsSection({
  recommendations = "Llega con anticipación, sigue las indicaciones del personal y considera llevar un abrigo ligero (locación al aire libre).",
  gifts = "Tu presencia es lo más valioso; si deseas obsequiarnos algo, agradecemos el detalle en sobre o transferencia.",
  registryLabel,
  registryUrl,
  accounts = [],
  className,
}: {
  recommendations?: string;
  gifts?: string;
  registryLabel?: string;
  registryUrl?: string;
  accounts?: BankAccount[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  const lilyVarStyle: CSSVarProps<"--lily"> = { ["--lily"]: "clamp(320px,32vw,360px)" };

  return (
    <section
      className={[
        "relative overflow-visible w-full px-3",               // ← ancla para la rama
        // tamaño de la rama (igual que en la sección de “Lugar”)
        "[--corner:clamp(120px,22vw,120px)]",
        "sm:[--corner:clamp(84px,16vw,180px)]",
        className ?? "",
      ].join(" ")}
    >
      {/* 🌿 Rama esquina superior derecha de ESTA sección */}
      <img
        src="/blueleaves.png"
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute z-0
                   w-[var(--corner)] h-auto
                   sm:top-[calc(-0.01_*_var(--corner))] right-[calc(-0.30_*_var(--corner))]"
      />

      {/* contenido por encima de la rama */}
      <div className="relative z-10 mx-auto grid max-w-[880px] gap-6">
        <InfoCard
          title="Recomendaciones"
          icon={<Sparkles className="size-6" style={{ color: "#8FBFD9" }} />}
        >
          {recommendations}
        </InfoCard>

        {/* Flor horizontal entre tarjetas */}
        <div className="relative flex items-center justify-center" style={lilyVarStyle}>
          <img
            src="/blueflower_horizontal.png"
            alt=""
            aria-hidden
            className="pointer-events-none select-none"
            style={{ width: "var(--lily)", height: "auto" }}
          />
        </div>

        <InfoCard
          title="Regalos"
          icon={<Gift className="size-6" style={{ color: "#8FBFD9" }} />}
        >
          <p>{gifts}</p>

          <div className="mt-4 flex items-center gap-3">
            {accounts.length > 0 && (
              <Button
                type="button"
                
                onClick={() => setOpen(true)}
                className="rounded-xl px-4 py-2 text-sm font-semibold"
                style={{
                  backgroundColor: SOFT_BTN_BG,
                  color: SOFT_TEXT,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = SOFT_BTN_BG_HOVER)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = SOFT_BTN_BG)}
              >
                <Banknote className="mr-2 size-4" />
                Ver cuentas
              </Button>
            )}

            {registryUrl && (
              <a
                href={registryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition"
                style={{
                  backgroundColor: SOFT_BTN_BG,
                  color: SOFT_TEXT,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                {registryLabel ?? "Ver mesa de regalos"}
              </a>
            )}
          </div>
        </InfoCard>
      </div>

      {accounts.length > 0 && (
        <BankAccountsDialog
          open={open}
          onOpenChange={setOpen}
          accounts={accounts}
          title="Cuentas para regalo"
          description="Puedes copiar los datos que necesites. ¡Gracias!"
        />
      )}
    </section>
  );
}
