// components/InvitationClient.tsx
"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
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
  Mea_Culpa,
  Tangerine,
  Lavishly_Yours,
  Rouge_Script
} from "next/font/google";

type Family = { id: string; nombreFamilia: string; nroPersonas: number };
type CSSVarProps<T extends string> = React.CSSProperties & Record<T, string>;

const SOFT_BG_CARD = "#FFFFFF";
const SOFT_BORDER = "#DBEAF5";
const SOFT_ACCENT = "#8FBFD9";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-greatvibes", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cormorant", display: "swap" });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-lora", display: "swap" });
const mr_de_haviland = Mr_De_Haviland({ subsets: ["latin"], weight: "400", variable: "--font-mrdehaviland", display: "swap" });
const mea_culpa = Mea_Culpa({ subsets: ["latin"], weight: "400", variable: "--font-meaculpa", display: "swap" });
const tangerine = Tangerine({ subsets: ["latin"], weight: "400", variable: "--font-tangerine", display: "swap" });
const lavishlyYours = Lavishly_Yours({ subsets: ["latin"], weight: "400", variable: "--font-lavishlyyours", display: "swap" });
const rougeScript = Rouge_Script({ subsets: ["latin"], weight: "400", variable: "--font-rougescript", display: "swap" });

const CountdownBanner = dynamic(() => import("@/components/CountdownBanner"), { ssr: false });

const WEDDING_DATE = new Date("2025-12-20T17:00:00");

const CHURCH_NAME = "Iglesia San Isidro";
const CHURCH_MAPS_URL = "https://maps.app.goo.gl/12A17Y3gianjggvA9";
const RECEPTION_NAME = "Quinta Carbonero";
const RECEPTION_MAPS_URL = "https://maps.app.goo.gl/kdwiUihm8pJUfiQv8";

export default function InvitationClient({ familyIdFromUrl }: { familyIdFromUrl?: string }) {
  const [prefillFamily, setPrefillFamily] = React.useState<Family | undefined>(undefined);
  const [confirmed, setConfirmed] = React.useState(false);
  const [declined, setDeclined] = React.useState(false);
  const [checking, setChecking] = React.useState(true);
  const garlandVar: CSSVarProps<"--garland"> = { ["--garland"]: "clamp(110px,26vw,200px)" };

  // Lee estado desde el backend por familyId
  React.useEffect(() => {
    if (!familyIdFromUrl) { setChecking(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/guests?familyId=${encodeURIComponent(familyIdFromUrl)}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`GET /api/guests?familyId failed: ${res.status}`);
        const data = await res.json();

        // Normalización (acepta varios esquemas del backend):
        const rawStr = (data.status ?? data.rsvp ?? data.response ?? data.answer ?? data.attending ?? "").toString().trim().toLowerCase();
        const yesLike = ["si", "sí", "yes", "true"];
        const noLike = ["no", "false"];

        const isYes = yesLike.includes(rawStr) || data.confirmed === true || data.attending === true;
        const isNo = noLike.includes(rawStr) || data.declined === true || data.attending === false;

        if (!cancelled) {
          setConfirmed(Boolean(isYes));
          setDeclined(Boolean(isNo) && !isYes);
        }
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
        const list: Family[] = data.families ?? [];
        const fam = list.find((f) => f.id === familyIdFromUrl);
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
        src="audio/theme.mp3"
        title="Nuestra canción"
        artist="Daniel & Nicole"
        cover="/assets/1.jpg"
      />

      <div className="mx-auto max-w-[640px]">
        {/* 1 — Hero */}
        <HeroCover src="/assets/1.jpg" alt="Daniel y Nicole">
          <h1 className={`text-center text-[64px] sm:text-[100px] ${mr_de_haviland.className} text-white drop-shadow`}>
            Daniel & Nicole
          </h1>
          <p className={`mt-2 text-center text-white/90 text-[44px] sm:text-[50px] ${mea_culpa.className}`}>¡Nuestra Boda!</p>
        </HeroCover>

        {/* 2 — Texto + BigDate + Countdown + CalendarMonth (panel baby blue) */}
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
                className={`bg-transparent shadow-none p-0`}
                paragraphClassName={`text-slate-700 text-center ${tangerine.className}`}
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
                <div className={`${lavishlyYours.className} text-4xl sm:text-5xl font-semibold text-slate-600`}>
                  El gran día
                </div>
                <div className="flex items-center justify-center gap-2 text-sm pt-4" style={{ color: SOFT_ACCENT }}>
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

        {/* 3 — Info Padrinos (hoja blanca) */}
        <RevealSection>
          <section
            className={[
              "[--corner:clamp(112px,38vw,260px)]",
              "sm:[--corner:clamp(52px,16vw,210px)]",
            ].join(" ")}
          >
            <div
              className="
                relative z-10 py-6 pb-3
                bg-white/85 ring-1 ring-white/60
                shadow-[0_12px_36px_rgba(15,23,42,0.06)]
                backdrop-saturate-150
              "
            >
              <Image
                src="/blue_leaves.png"
                alt=""
                aria-hidden
                width={360}
                height={360}
                className="pointer-events-none select-none absolute z-0"
                style={{
                  width: "var(--corner)",
                  height: "auto",
                  top: "calc(0.10 * var(--corner))",
                  left: "calc(-0.10 * var(--corner))",
                  transform: "rotate(15deg)",
                }}
                priority={false}
              />
              <div className="text-center">
                <div className="mx-auto flex max-w-fit items-center justify-center gap-1 text-sm font-medium">
                  <span className={`${mea_culpa.className} text-4xl sm:text-5xl font-semibold text-slate-600 pt-6`}>
                    Nuestros Padrinos
                  </span>
                </div>
              </div>

              <InfoCard
                title={<span className="pt-6">Padrinos de Arras</span>}
                titleClassName={`${mea_culpa.className} text-[34px] sm:text-[40px]`}
                icon={<Coins className="size-6" style={{ color: "#8FBFD9" }} />}
              >
                <p className={`${tangerine.className} text-[26px] sm:text-[30px]`}>
                  Manuel Villamagua & Elizabeth Torres
                </p>
              </InfoCard>

              <InfoCard
                title={<span className="pt-6">Padrinos de Lazo</span>}
                titleClassName={`${mea_culpa.className} text-[34px] sm:text-[40px]`}
                icon={<Infinity className="size-6" style={{ color: "#8FBFD9" }} />}
              >
                <p className={`${tangerine.className} text-[26px] sm:text-[30px]`}>
                  Carlos Ulloa & Eliza Márquez
                </p>
              </InfoCard>
            </div>
          </section>
        </RevealSection>

        {/* 4 — Venue */}
        <RevealSection>
          <section
            className={[
              "[--corner:clamp(112px,38vw,260px)]",
              "sm:[--corner:clamp(52px,16vw,210px)]",
              "relative rounded-2xl w-full px-4 sm:px-6",
              "pt-0 pb-0 sm:pt-0 sm:pb-0",
              "mb-0 ",
            ].join(" ")}
          >
            <div className="z-10 pb-9 py-9">
              <VenueBlock
                title="Ceremonia"
                name={CHURCH_NAME}
                address="Av. Pio Jaramillo Alvarado, Loja 110150"
                time="05:00 PM"
                mapUrl={CHURCH_MAPS_URL}
              />

              <div className="relative px-6 py-2 [--rose:clamp(90px,34vw,200px)] sm:[--rose:clamp(72px,22vw,180px)] ">
                <Image
                  src="/blueroses.png"
                  alt=""
                  width={240}
                  height={240}
                  className="pointer-events-none select-none absolute z-20"
                  style={{
                    left: "calc(-0.20 * var(--rose))",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "var(--rose)",
                    height: "auto",
                  }}
                  priority={false}
                />
              </div>

              <VenueBlock
                title="Recepción"
                name={RECEPTION_NAME}
                address="Vía a Cuenca, barrio Carigán, Loja"
                time="07:00 PM"
                mapUrl={RECEPTION_MAPS_URL}
              />
            </div>
          </section>
        </RevealSection>

        {/* 5 — Timeline */}
        <RevealSection>
          <section
            className={[
              "[--corner:clamp(112px,38vw,260px)]",
              "sm:[--corner:clamp(52px,16vw,210px)]",
              "relative w-full",
              "px-4 sm:px-6",
              "mt-0 mb-0 pt-0 pb-15 sm:pb-15 backdrop-saturate-150 pt-4",
              "overflow-x-hidden sm:overflow-visible bg-white/85 ring-1 ring-white/60",
            ].join(" ")}
          >
            <Timeline
              items={[
                { time: "5:00 PM", label: "Ceremonia", icon: "/assets/TimelineSVG/church.svg" },
                { time: "6:00 PM", label: "Fotos", icon: "/assets/TimelineSVG/photos.svg" },
                { time: "7:00 PM", label: "Recepción", icon: "/assets/TimelineSVG/lunch.svg" },
                { time: "9:00 PM", label: "Brindis & cena", icon: "/assets/TimelineSVG/lunch.svg" },
                { time: "10:00 PM", label: "Baile", icon: "/assets/TimelineSVG/disco.svg" },
              ]}
              className="px-3"
              title="Itinerario"
              titleClassName={`${greatVibes.className} text-3xl`}
              itemClassName={`${lora.className}`}
            />
          </section>
        </RevealSection>

        {/* 6 — Imagen */}
        <RevealSection>
          <section className="grid gap-4">
            <div
              className="relative mt-0 w-full aspect-[16/10] overflow-hidden"
              style={{ backgroundColor: SOFT_BG_CARD, border: `1px solid ${SOFT_BORDER}`, boxShadow: "0 4px 14px rgba(0,0,0,0.06)" }}
            >
              <Image src="/assets/3.jpg" alt="Momentos" fill sizes="100vw" className="object-cover" loading="lazy" />
            </div>
          </section>
        </RevealSection>

        {/* 7 — DressCode */}
        <RevealSection>
          <DressCode
            className="pt-6"
            titleClassName={`${mea_culpa.className} text-3xl`}
            captionClassName={`${rougeScript.className} text-[25px] sm:text-[29px]`}
            womenColors={[
              { color: "#A9D6F5" },
              { color: "#BDE1F8" },
              { color: "#CAE7FA" },
              { color: "#D6EFFC" }
            ]}
            menColors={[{ color: "#191919" }, { color: "#393939" }, { color: "#4B4B4B" }, { color: "#535353" }]}
          />
        </RevealSection>

        {/* 8 — Recomendaciones + Regalos */}
        <RevealSection>
          <RecGiftsSection
            className="pt-6"
            titleClassName={`${mea_culpa.className} text-5xl`}
            itemClassName={`${rougeScript.className} text-[19px] sm:text-[25px]`}
            accounts={[
              { bank: "Cooperativa Coopmego", holder: "Daniel Ulloa", account: "401010838242", dni: "1105002867" },
              { bank: "Banco de Loja", holder: "Daniel Ulloa", account: "2903926236", dni: "1105002867" },
              { bank: "Banco Pichincha", holder: "Daniel Ulloa", account: "2206132871", dni: "1105002867" },
            ]}
          />
        </RevealSection>

        {/* 9 — Carrusel */}
        <RevealSection>
          <section className="grid gap-3 pt-6 [--garland:clamp(110px,26vw,200px)]">
            <GalleryCarousel
              aspect={4 / 3}
              images={[
                { src: "/assets/4.jpg", alt: "Foto 1" },
                { src: "/assets/5.jpg", alt: "Foto 2" },
                { src: "/assets/6.jpg", alt: "Foto 3" },
              ]}
              className={`${cormorant.className} text-3xl`}
            />
          </section>
        </RevealSection>

        {/* 10 — Cita (hoja blanca) */}
        <RevealSection>
          <section className="relative">
            <div
              className="relative mx-auto max-w-[880px] overflow-hidden p-6 sm:p-8 shadow-[0_4px_14px_rgba(0,0,0,0.04)]"
              style={{
                ...garlandVar,
                background: "#FFFFFF",
                border: `1px solid ${SOFT_BORDER}`,
                borderRadius: 28,
              }}
            >
              <Image
                src="/blue_horizontal.png"
                alt=""
                aria-hidden
                width={320}
                height={120}
                className="pointer-events-none select-none absolute z-0"
                style={{
                  top: "10%",
                  left: "50%",
                  transform: "translate(-50%, -30%)",
                  width: "var(--garland)",
                  height: "auto",
                  opacity: 0.95,
                }}
                priority={false}
              />
              <Image
                src="/blue_horizontal.png"
                alt=""
                aria-hidden
                width={320}
                height={120}
                className="pointer-events-none select-none absolute z-0"
                style={{
                  bottom: "5%",
                  left: "50%",
                  transform: "translate(-50%, 30%)",
                  width: "var(--garland)",
                  height: "auto",
                  opacity: 0.95,
                }}
                priority={false}
              />
              <div className="relative z-10 py-6 text-center">
                <QuoteBlock
                  classNameAuthor={`${cormorant.className} text-[14px] sm:text-[20px] py-3`}
                  classNameQuote={`${rougeScript.className} text-[29px] sm:text-[35px] pt-3`}
                  quote="El amor es paciente, es bondadoso. El amor no es envidioso, jactancioso ni orgulloso. No se comporta en rudeza, no es egoista, no se enoja fácilmente, no guarda rencor."
                  author="1 Corintios 13:4-5"
                />
              </div>
            </div>
          </section>
        </RevealSection>

        {/* 11 — Confirmación — SOLO si hay id */}
        {familyIdFromUrl && (
          <RevealSection>
            <section className="pb-9 pt-6">
              <ConfirmCard
                confirmed={confirmed}
                declined={declined}
                checking={checking}
                prefillFamilyId={familyIdFromUrl}
                prefillFamily={prefillFamily}
                onConfirmed={() => { setConfirmed(true); setDeclined(false); }}
                onDeclined={() => { setConfirmed(false); setDeclined(true); }}
                titleClassName={greatVibes.className}
                textClassName={lora.className}
                hideIfNoPrefill
                messageWhenConfirmed="¡Nos hace mucha ilusión compartir este día contigo! 💙"
                messageWhenDeclined="No hay problema, nos encontraremos en una siguiente ocasión"
              />
            </section>
          </RevealSection>
        )}

        {/* 12 — Cierre */}
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
