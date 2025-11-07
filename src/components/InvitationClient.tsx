// components/InvitationClient.tsx
"use client";

import * as React from "react";
import { Calendar as CalendarIcon, Heart } from "lucide-react";
import CalendarMonth from "@/components/CalendarMonth";
import GalleryCarousel from "@/components/GalleryCarousel";
import QuoteBlock from "@/components/QuoteBlock";
import TextBlock from "@/components/TextBlock";
import { Infinity, Coins } from "lucide-react";
import VenueBlock from "@/components/VenueBlock";
import Timeline from "@/components/Timeline";
import InfoCard from "@/components/InfoCard";
import BigDate from "@/components/BigDate";
import ConfirmCard from "@/components/ConfirmCard";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import RevealSection from "@/components/RevealSection";
import DressCode from "@/components/DressCode";
import RecGiftsSection from "@/components/RecGiftsSection";
import BackgroundAudio from "@/components/BackgroundAudio";
import HeroCover from "@/components/HeroCover";

import {
  Great_Vibes,
  Cormorant_Garamond,
  Lora,
  Mr_De_Haviland,
} from "next/font/google";

const SOFT_BG_CARD = "#FFFFFF";
const SOFT_BORDER = "#DBEAF5";
const SOFT_ACCENT = "#8FBFD9";

// Tipografías
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-greatvibes", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cormorant", display: "swap" });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-lora", display: "swap" });
const mr_de_haviland = Mr_De_Haviland({ subsets: ["latin"], weight: "400", variable: "--font-mrdehaviland", display: "swap" });

// CSR only
const CountdownBanner = dynamic(() => import("@/components/CountdownBanner"), { ssr: false });

const WEDDING_DATE = new Date("2025-12-20T17:00:00");

const CHURCH_NAME = "Iglesia San Isidro";
const CHURCH_MAPS_URL = "https://maps.app.goo.gl/12A17Y3gianjggvA9";
const RECEPTION_NAME = "Quinta Carbonero";
const RECEPTION_MAPS_URL = "https://maps.app.goo.gl/kdwiUihm8pJUfiQv8";

export default function InvitationClient({ familyIdFromUrl }: { familyIdFromUrl?: string }) {
  const [prefillFamily, setPrefillFamily] = React.useState<{ id: string; nombreFamilia: string; nroPersonas: number } | undefined>(undefined);
  const [confirmed, setConfirmed] = React.useState(false);
  const [checking, setChecking] = React.useState(true);

  // Chequeo de confirmación por id
  React.useEffect(() => {
    if (!familyIdFromUrl) { setChecking(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/guests?familyId=${encodeURIComponent(familyIdFromUrl)}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`GET /api/guests?familyId failed: ${res.status}`);
        const data = await res.json();
        if (!cancelled) setConfirmed(Boolean(data.confirmed));
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, [familyIdFromUrl]);

  // Prefill de familia
  React.useEffect(() => {
    if (!familyIdFromUrl) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/guests", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const fam = (data.families ?? []).find((f: any) => f.id === familyIdFromUrl);
        if (!cancelled) setPrefillFamily(fam);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { cancelled = true; };
  }, [familyIdFromUrl]);

  return (
    <main
      className={`paper-invite relative h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth no-scrollbar ${lora.className}`}
      style={{ overscrollBehaviorY: "contain" }}
    >
      <BackgroundAudio
        src="/audio/theme.mp3"
        title="Nuestra canción"
        artist="Daniel & Nicole"
        cover="/assets/1.jpg"
      />

      <div className="mx-auto max-w-[640px]">
        {/* 1 — Hero */}
        <HeroCover src="/assets/1.jpg" alt="Daniel y Nicole">
          <h1 className={`text-center text-5xl sm:text-8xl ${mr_de_haviland.className} text-white drop-shadow`}>
            Daniel &amp; Nicole
          </h1>
          <p className={`mt-2 text-center text-white/90 ${lora.className}`}>Nuestra Boda</p>
        </HeroCover>

        {/* 2 — Texto + BigDate + Countdown + CalendarMonth (baby blue panel) */}
        <RevealSection>
          <section
            className="relative px-4 sm:px-6 py-6 sm:py-8"
            style={{
              background: "linear-gradient(0deg, #F7FBFE 0%, #EFF7FD 100%)",
              border: "1px solid #DBEAF5",
              boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
            }}
          >
            <div className="mx-auto w-full max-w-[560px] text-center">
              <TextBlock
                className={`bg-transparent shadow-none p-0 ${lora.className}`}
                paragraphClassName="text-slate-700 text-center"
                paragraphs={[
                  "Dios nos ha concedido el privilegio de conocernos y amarnos con su bendición y la de nuestros padres.",
                  "Queremos unir nuestras vidas para siempre y celebrarlo contigo.",
                ]}
              />

              <div className="mt-4">
                <BigDate
                  date={WEDDING_DATE}
                  tone="dark"
                  className={`mx-auto ${cormorant.className}`}
                  dayClassName={greatVibes.className}
                  labelsClassName={lora.className}
                />
              </div>

              <div className="mt-4">
                <CountdownBanner date={WEDDING_DATE} className="my-0" />
              </div>

              <div className="mt-6">
                <div className={`${cormorant.className} text-4xl sm:text-5xl font-semibold text-slate-600`}>
                  El gran día
                </div>
                <div className="flex items-center justify-center gap-2 text-sm pt-1" style={{ color: SOFT_ACCENT }}>
                  <CalendarIcon className="size-4" />
                  <span className="uppercase tracking-wide">
                    {WEDDING_DATE.toLocaleDateString("es-ES", { month: "long" })}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <CalendarMonth
                  className="mx-auto w-full max-w-[520px]"
                  date={WEDDING_DATE}
                  highlightDate={WEDDING_DATE}
                  startOnSunday
                />
              </div>
            </div>
          </section>
        </RevealSection>

        {/* 3 — Venues */}
        <RevealSection>
          <section
            className={[
              "[--corner:clamp(112px,38vw,260px)]",
              "sm:[--corner:clamp(52px,16vw,210px)]",
              "relative overflow-visible rounded-2xl my-9 w-full px-4 py-4 sm:px-6 sm:py-5",
            ].join(" ")}
          >
            <div className="text-center pt-6 z-10">
              <div className="mx-auto flex max-w-fit items-center justify-center gap-1 text-sm font-medium">
                <span className={`${cormorant.className} text-4xl sm:text-5xl font-semibold text-slate-600`}>
                  Nuestros <br />Padrinos
                </span>
              </div>
            </div>
            <InfoCard
              title={<span className="pt-6">Padrino de Arras</span>}
              icon={<Coins className="size-6" style={{ color: "#8FBFD9" }} />}
            >
              <p className={`${lora.className}`}>Manuel Villamagua y Elizabeth Torres</p>
            </InfoCard>
            <InfoCard
              title={<span className="pt-6">Padrino de Lazo</span>}
              icon={<Infinity className="size-6" style={{ color: "#8FBFD9" }} />}
            >
              <p className={`${lora.className}`}>Carlos Ulloa y Eliza Marquez</p>
            </InfoCard>

            {/* header sin imagen dentro */}
            <div className="text-center pt-6 z-10">
              <div className="mx-auto flex max-w-fit items-center justify-center gap-1 text-sm font-medium">
                <Heart className="size-5 text-slate-500" />
                <span className={`${cormorant.className} text-4xl sm:text-5xl font-semibold text-slate-600`}>
                  Lugar
                </span>
              </div>
            </div>

            {/* resto igual */}
            <div className="z-10">
              <VenueBlock
                title="Ceremonia"
                name={CHURCH_NAME}
                address="Av. Acueducto 5451, Puerta de Hierro, 45116"
                time="05:00 PM"
                mapUrl={CHURCH_MAPS_URL}
              />

              <div className="relative px-6 [--rose:clamp(90px,34vw,200px)] sm:[--rose:clamp(72px,22vw,180px)]">
                <Separator className="my-6" style={{ opacity: 0.6, backgroundColor: SOFT_BORDER }} />
                <img
                  src="/blueroses.png"
                  alt=""
                  aria-hidden
                  className="pointer-events-none select-none"
                  style={{
                    position: "absolute",
                    left: "calc(-0.20 * var(--rose))",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "var(--rose)",
                    height: "auto",
                    zIndex: 20,
                  }}
                />
              </div>

              <VenueBlock
                title="Recepción"
                name={RECEPTION_NAME}
                address="Dirección de la recepción"
                time="07:00 PM"
                mapUrl={RECEPTION_MAPS_URL}
              />
            </div>
          </section>
        </RevealSection>

        {/* 4 — Timeline + Imagen */}
        <RevealSection>
          <section
            className={[
              "grid gap-4 pt-6 pb-6 [--corner:clamp(112px,38vw,260px)]",
              "grid gap-4 pt-6 pb-6 sm:[--corner:clamp(52px,16vw,210px)]",
              "relative overflow-visible rounded-2xl my-9 w-full px-4 py-4 sm:px-6 sm:py-5",
            ].join(" ")}
          >
            <img
              src="/blue_leaves.png"
              alt=""
              aria-hidden
              className="pointer-events-none select-none absolute z-0 w-[var(--corner)] h-auto top-[calc(-0.5_*_var(--corner))] left-[calc(-0.18_*_var(--corner))]"
              style={{ transform: "rotate(-10deg)" }}
            />
            <Timeline
              items={[
                { time: "5:00 PM", label: "Ceremonia", icon: "/assets/TimelineSVG/church.svg" },
                { time: "6:00 PM", label: "Fotos", icon: "/assets/TimelineSVG/photos.svg" },
                { time: "7:00 PM", label: "Recepción", icon: "/assets/TimelineSVG/lunch.svg" },
                { time: "9:00 PM", label: "Brindis & cena", icon: "/assets/TimelineSVG/lunch.svg" },
                { time: "10:00 PM", label: "Baile", icon: "/assets/TimelineSVG/disco.svg" },
              ]}
              className="px-3 pt-2"
              title="Itinerario"
              titleClassName={`${cormorant.className} text-3xl`}
              itemClassName={`${lora.className}`}
            />
          </section>
        </RevealSection>

        {/* Imagen */}
        <RevealSection>
          <section className="grid gap-4 pt-3">
            <div
              className="relative mt-3 w-full aspect-[16/10] overflow-hidden"
              style={{ backgroundColor: SOFT_BG_CARD, border: `1px solid ${SOFT_BORDER}`, boxShadow: "0 4px 14px rgba(0,0,0,0.06)" }}
            >
              <Image src="/assets/3.jpg" alt="Momentos" fill sizes="100vw" className="object-cover" loading="lazy" />
            </div>
          </section>
        </RevealSection>

        {/* DressCode */}
        <RevealSection>
          <DressCode
            className="pt-6"
            titleClassName={`${cormorant.className} text-3xl`}
            captionClassName={`${lora.className}`}
            womenColors={[{ color: "#D9EDF9" }, { color: "#E6F3FB" }, { color: "#F0F8FD" }, { color: "#F6FAFE" }]}
            menColors={[{ color: "#191919" }, { color: "#393939" }, { color: "#4B4B4B" }, { color: "#535353" }]}
          />
        </RevealSection>

        {/* Recomendaciones + Regalos */}
        <RevealSection>
          <RecGiftsSection
            className="pt-6"
            titleClassName={`${cormorant.className} text-3xl`}
            itemClassName={`${lora.className}`}
            accounts={[
              { bank: "Banco Pichincha", holder: "Daniel Ulloa", account: "1234567890", dni: "0102030405" },
              { bank: "Banco Guayaquil", holder: "Nicole Torres", account: "0987654321", dni: "1122334455" },
            ]}
          />
        </RevealSection>

        {/* Carrusel + Cita */}
        <RevealSection>
          <section className="grid gap-3 py-6 [--garland:clamp(110px,26vw,200px)]">
            <GalleryCarousel
              aspect={4 / 3}
              images={[
                { src: "/assets/4.jpg", alt: "Foto 1" },
                { src: "/assets/5.jpg", alt: "Foto 2" },
                { src: "/assets/6.jpg", alt: "Foto 3" },
              ]}
              className={`${cormorant.className} text-3xl`}
            />
            <div className="relative mx-auto max-w-[880px] py-[calc(var(--garland)*0.40)]">
              <img
                src="/blue_horizontal.png"
                alt=""
                aria-hidden
                className="pointer-events-none select-none absolute z-0"
                style={{ top: "15%", left: "50%", transform: "translate(-50%, -30%)", width: "var(--garland)", height: "auto" }}
              />
              <img
                src="/blue_horizontal.png"
                alt=""
                aria-hidden
                className="pointer-events-none select-none absolute z-0"
                style={{ bottom: "10%", left: "50%", transform: "translate(-50%, 30%)", width: "var(--garland)", height: "auto" }}
              />
              <div className="relative z-10">
                <QuoteBlock
                  classNameAuthor={`${cormorant.className}`}
                  classNameQuote={`${lora.className}`}
                  quote="El amor nunca se da por vencido, jamás pierde la fe, siempre tiene esperanzas y se mantiene firme en toda circunstancia."
                  author="1 Corintios 13:7"
                />
              </div>
            </div>
          </section>
        </RevealSection>

        {/* Confirmación — SOLO si hay id */}
        {familyIdFromUrl && (
          <RevealSection>
            <section className="pb-9">
              <ConfirmCard
                confirmed={confirmed}
                checking={checking}
                prefillFamilyId={familyIdFromUrl}
                prefillFamily={prefillFamily}
                onConfirmed={() => setConfirmed(true)}
                titleClassName={greatVibes.className}
                textClassName={lora.className}
                hideIfNoPrefill
              />
            </section>
          </RevealSection>
        )}

        {/* Cierre */}
        <RevealSection>
          <HeroCover src="/assets/2.jpg" alt="Nos vemos pronto">
            <h1 className={`text-center text-5xl sm:text-8xl ${greatVibes.className} text-white drop-shadow`}>
              ¡Nos vemos en la boda!
            </h1>
          </HeroCover>
        </RevealSection>
      </div>
    </main>
  );
}
