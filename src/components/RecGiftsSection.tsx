// components/RecGiftsSection.tsx
"use client";

import * as React from "react";
import { Gift, Sparkles, Banknote } from "lucide-react";
import InfoCard from "@/components/InfoCard";
import { Button } from "@/components/ui/button";
import BankAccountsDialog, { type BankAccount } from "@/components/BankAccountsDialog";

const COLOR = "#55BAE9FF";

export default function RecGiftsSection({
  recommendations = "Llega con anticipación, sigue las indicaciones del personal y considera llevar un abrigo ligero (locación al aire libre).",
  gifts = "Tu presencia es lo más valioso; si deseas obsequiarnos algo, agradecemos el detalle en sobre o transferencia.",
  registryLabel,
  registryUrl,
  accounts = [],              // <— NUEVO
  className,
}: {
  recommendations?: string;
  gifts?: string;
  registryLabel?: string;
  registryUrl?: string;
  accounts?: BankAccount[];   // <— NUEVO
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <section className={"w-full px-3 " + (className ?? "")} >
      <div className="mx-auto grid max-w-[880px] gap-4" >
        <InfoCard title="Recomendaciones" icon={<Sparkles className="size-6" style={{ color: COLOR }}/>}>
          {recommendations}
        </InfoCard>

        <InfoCard title="Regalos" icon={<Gift className="size-6" style={{ color: COLOR }}/>}>
          <p>{gifts}</p>

          <div className="mt-4 items-center gap-3">
            {accounts.length > 0 && (
              <Button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-xl hover:bg-blue-600/75 active:bg-blue-600/75 bg-blue-600/50 items-center"
                
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
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2
                         hover:bg-blue-600/75 active:bg-blue-600/75 bg-blue-300/90"
              >
                {registryLabel ?? "Ver mesa de regalos"}
              </a>
            )}
          </div>
        </InfoCard>
      </div>

      {/* Modal de cuentas */}
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
