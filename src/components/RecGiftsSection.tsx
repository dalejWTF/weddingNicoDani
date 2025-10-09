// components/RecGiftsSection.tsx
"use client";

import { Gift, Sparkles } from "lucide-react";
import InfoCard from "@/components/InfoCard";

export default function RecGiftsSection({
  recommendations = "Llega con anticipación, sigue las indicaciones del personal y considera llevar un abrigo ligero (locación al aire libre).",
  gifts = "Tu presencia es lo más valioso; si deseas obsequiarnos algo, agradecemos el detalle en sobre.",
  registryLabel,
  registryUrl,
  className,
}: {
  recommendations?: string;
  gifts?: string;
  registryLabel?: string;   // opcional: “Ver mesa de regalos”
  registryUrl?: string;     // opcional: link a mesa de regalos
  className?: string;
}) {
  return (
    <section className={"w-full px-3 " + (className ?? "")}>
      <div className="mx-auto grid max-w-[880px] gap-4">
        <InfoCard
          title="Recomendaciones"
          icon={<Sparkles className="size-6" />}
        >
          {recommendations}
        </InfoCard>

        <InfoCard title="Regalos" icon={<Gift className="size-6" />}>
          <p>{gifts}</p>
          {registryUrl && (
            <div className="mt-4">
              <a
                href={registryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2
                           bg-rose-600 hover:bg-rose-700 active:bg-rose-800"
              >
                {registryLabel ?? "Ver mesa de regalos"}
              </a>
            </div>
          )}
        </InfoCard>
      </div>
    </section>
  );
}
