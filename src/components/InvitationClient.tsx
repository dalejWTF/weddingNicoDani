//components/InvitationClient.tsx

"use client";

import { Calendar as CalendarIcon, Heart } from "lucide-react";
import CalendarMonth from "@/components/CalendarMonth";
import GalleryCarousel from "@/components/GalleryCarousel";
import QuoteBlock from "@/components/QuoteBlock";
import TextBlock from "@/components/TextBlock";
import VenueBlock from "@/components/VenueBlock";
import Timeline from "@/components/Timeline";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import RevealSection from "@/components/RevealSection";
import { Tangerine, Cookie, Merienda } from "next/font/google";
import DressCode from "@/components/DressCode";
import RecGiftsSection from "@/components/RecGiftsSection";
import BackgroundAudio from "@/components/BackgroundAudio";
import HeroCover from "@/components/HeroCover";
import RsvpButton from "@/components/RsvpButton";
import { FAMILIAS } from "@/data/familias";

const SOFT_BG_CARD = "#FFFFFF";
const SOFT_BORDER = "#DBEAF5";
const SOFT_ACCENT = "#8FBFD9";

const tangerine = Tangerine({ subsets: ["latin"], weight: "700", variable: "--font-tangerine", display: "swap" });
const cookie = Cookie({ subsets: ["latin"], weight: "400", variable: "--font-cookie", display: "swap" });
const merienda = Merienda({ subsets: ["latin"], weight: "400", variable: "--font-merienda", display: "swap" });

// CSR only
const CountdownBanner = dynamic(() => import("@/components/CountdownBanner"), { ssr: false });

const WEDDING_DATE = new Date("2025-12-20T17:00:00");

const CHURCH_NAME = "Iglesia San Isidro";
const CHURCH_MAPS_URL = "https://maps.google.com/?q=Iglesia+San+Francisco";
const RECEPTION_NAME = "Quinta Carbonero";
const RECEPTION_MAPS_URL = "https://maps.google.com/?q=Hacienda+La+Esperanza";

export default function InvitationClient({ familyIdFromUrl }: { familyIdFromUrl?: string }) {
  const prefillFamily = familyIdFromUrl
    ? FAMILIAS.find((f) => f.id === familyIdFromUrl)
    : undefined;

  const saludoHero = prefillFamily
    ? `Estimada ${prefillFamily.nombreFamilia}, ¡Estás invitad@ a nuestra boda!`
    : "¡Estás invitad@ a nuestra boda!";

  return (
    <main
      className="paper-invite relative h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth no-scrollbar"
      style={{ overscrollBehaviorY: "contain" }}
    >
      <BackgroundAudio
        src="/audio/cancion.mp3"
        title="Nuestra canción"
        artist="Daniel & Nicole"
        cover="/assets/1.jpg"
      />

      <div className="mx-auto max-w-[640px]">
        {/* 1 — Hero */}
        <HeroCover src="/assets/1.jpg" alt="Daniel y Nicole" >
          <h1 className={`text-center text-5xl sm:text-8xl font-semibold ${tangerine.className} text-white drop-shadow`}>
            Daniel &amp; Nicole
          </h1>
          <p className={`mt-2 text-center text-white/90 ${merienda.className}`}>
            {saludoHero}
          </p>
        </HeroCover>

        {/* 2 — Texto + Countdown */}
        <RevealSection>
          <section className="grid gap-4 pt-9 my-4">
            <TextBlock
              paragraphs={[
                "Dios nos ha concedido el privilegio de conocernos y amarnos con su bendición y la de nuestros padres.",
                "Queremos unir nuestras vidas para siempre y celebrarlo contigo.",
              ]}
            />
            <CountdownBanner date={WEDDING_DATE} className="my-3" />
          </section>
        </RevealSection>

        {/* 3 — CalendarMonth */}
        <RevealSection>
          <section className="grid gap-2 pt-3">
            <div className="text-center py-2">
              <div className={`${cookie.className} text-5xl sm:text-5xl font-semibold text-slate-500`}>
                El gran día
              </div>
              <div className="flex items-center justify-center gap-2 text-sm pt-2" style={{ color: SOFT_ACCENT }}>
                <CalendarIcon className="size-4" />
                <span className="uppercase ">{WEDDING_DATE.toLocaleDateString("es-ES", { month: "long" })}</span>
              </div>
            </div>
            <CalendarMonth date={WEDDING_DATE} highlightDate={WEDDING_DATE} startOnSunday />
          </section>
        </RevealSection>

        {/* 4 — Venues */}
        <RevealSection>
          <section
            className={[
              // móvil: grande
              "[--corner:clamp(112px,38vw,260px)]",
              // sm+ (>=640px): tu valor actual
              "sm:[--corner:clamp(52px,16vw,210px)]",
              "relative overflow-visible rounded-2xl my-9 w-full px-4 py-4 sm:px-6 sm:py-5",

            ].join(" ")}
          >
            <img
              src="/blueleaves.png"
              alt=""
              aria-hidden
              className="pointer-events-none select-none absolute z-0
                        w-[var(--corner)] h-auto
                        top-[calc(-0.01_*_var(--corner))] right-[calc(-0.18_*_var(--corner))]"

            />

            {/* header sin imagen dentro */}
            <div className="text-center pt-6 z-10">
              <div className="mx-auto flex max-w-fit items-center justify-center gap-1 text-sm font-medium">
                <Heart className="size-5 text-slate-500" />
                <span className={`${cookie.className} text-5xl sm:text-5xl font-semibold text-slate-500`}>
                  Lugar
                </span>
              </div>
            </div>

            {/* resto igual */}
            <div className="z-10">
              <VenueBlock
                title="Ceremonia religiosa"
                name={CHURCH_NAME}
                address="Dirección de la iglesia"
                time="5:00 PM"
                mapUrl={CHURCH_MAPS_URL}
              />

              <div className="relative px-6 [--rose:clamp(90px,34vw,200px)] sm:[--rose:clamp(72px,22vw,180px)]">
                <Separator className="my-6" style={{ opacity: 0.6, backgroundColor: SOFT_BORDER }} />
                <img
                  src="/blueroses.png"   // ajusta la ruta si es distinta
                  alt=""
                  aria-hidden
                  className="pointer-events-none select-none"
                  style={{
                    position: "absolute",
                    left: "calc(-0.20 * var(--rose))",   // que salga un poco del borde
                    top: "50%",
                    transform: "translateY(-50%)",        // centrada verticalmente al separador
                    width: "var(--rose)",                 // tamaño responsivo
                    height: "auto",
                    zIndex: 20,
                    // Si quieres integrarlo más con el “papel”:
                    // mixBlendMode: "multiply",
                    // opacity: 0.95,
                  }}
                />

              </div>

              <VenueBlock
                title="Recepción"
                name={RECEPTION_NAME}
                address="Dirección de la recepción"
                time="7:00 PM"
                mapUrl={RECEPTION_MAPS_URL}
              />
            </div>
          </section>
        </RevealSection>


        {/* 5 — Timeline + Imagen */}
        <RevealSection>
          <section className="grid gap-4 pt-6 pb-6">
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
            />
          </section>
        </RevealSection>
        <RevealSection>
          <section className="grid gap-4 pt-8">
            <div
              className="relative mt-6 w-full aspect-[16/10] overflow-hidden rounded-xl"
              style={{
                backgroundColor: SOFT_BG_CARD,
                border: `1px solid ${SOFT_BORDER}`,
                boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
              }}
            >
              <Image
                src="/assets/3.jpg"
                alt="Momentos"
                fill
                sizes="100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </section>
        </RevealSection>

        {/* 6 — DressCode */}
        <RevealSection>
          <DressCode
            className="pt-6"
            womenColors={[{ color: "#D9EDF9" }, { color: "#E6F3FB" }, { color: "#F0F8FD" }, { color: "#F6FAFE" }]}
            menColors={[{ color: "#191919" }, { color: "#393939" }, { color: "#4B4B4B" }, { color: "#535353" }]}
          />
        </RevealSection>

        {/* 7 — Recomendaciones + Regalos */}
        <RevealSection>
          <RecGiftsSection
            className="pt-6"
            accounts={[
              { bank: "Banco Pichincha", holder: "Daniel Ulloa", account: "1234567890", dni: "0102030405" },
              { bank: "Banco Guayaquil", holder: "Nicole Torres", account: "0987654321", dni: "1122334455" },
            ]}
          />
        </RevealSection>

        {/* 8 — Carrusel + Cita */}
        <RevealSection>
          <section className="grid gap-3 py-6">
            <GalleryCarousel
              aspect={4 / 3}
              images={[
                { src: "/assets/4.jpg", alt: "Foto 1" },
                { src: "/assets/5.jpg", alt: "Foto 2" },
                { src: "/assets/6.jpg", alt: "Foto 3" },
              ]}
            />
            <QuoteBlock
              quote="El amor nunca se da por vencido, jamás pierde la fe, siempre tiene esperanzas y se mantiene firme en toda circunstancia."
              author="1 Corintios 13:7"
            />
          </section>
        </RevealSection>

        {/* 9 — Confirmación */}
        <RevealSection>
          <HeroCover src="/assets/2.jpg" alt="Nos vemos pronto">
            <div className="max-w-screen-sm mx-auto px-3 text-center">
              <div className={`text-center text-5xl sm:text-8xl font-semibold ${tangerine.className} text-white drop-shadow`}>
                Confirmar asistencia
              </div>

              <p className={`mt-2 text-center text-white/90 ${merienda.className}`}>
                Por favor confirma tu asistencia antes del 10 de diciembre de 2025
              </p>

              <div className="pt-3">
                <RsvpButton
                  triggerClassName="rounded-2xl px-10 border-white text-black hover:bg-white/10 bg-white/10"
                  triggerLabel="Confirmar"
                  prefillFamilyId={familyIdFromUrl}
                  prefillFamily={prefillFamily}
                />
              </div>
            </div>
          </HeroCover>
        </RevealSection>
      </div>
    </main>
  );
}
