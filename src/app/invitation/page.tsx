// app/invitation/page.tsx
"use client";

import { Calendar as CalendarIcon, Heart } from "lucide-react";
import { useSearchParams } from "next/navigation";
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
import { FAMILIAS } from "@/data/familias"; // ← usamos tu data local

// Paleta baby blue sutil
const SOFT_BG_CARD = "#FFFFFF";    // tarjetas
const SOFT_BORDER = "#DBEAF5";     // bordes
const SOFT_ACCENT = "#8FBFD9";     // acentos/iconos

const tangerine = Tangerine({
    subsets: ["latin"],
    weight: "700",
    style: "normal",
    variable: "--font-tangerine",
    display: "swap",
});
const cookie = Cookie({
    subsets: ["latin"],
    weight: "400",
    style: "normal",
    variable: "--font-cookie",
    display: "swap",
});
const merienda = Merienda({
    subsets: ["latin"],
    weight: "400",
    style: "normal",
    variable: "--font-merienda",
    display: "swap",
});

// Contador (CSR)
const CountdownBanner = dynamic(() => import("@/components/CountdownBanner"), { ssr: false });

const WEDDING_DATE = new Date("2025-12-20T17:00:00");

// Ubicaciones (demo)
const CHURCH_NAME = "Iglesia San Isidro";
const CHURCH_MAPS_URL = "https://maps.google.com/?q=Iglesia+San+Francisco";
const RECEPTION_NAME = "Quinta Carbonero";
const RECEPTION_MAPS_URL = "https://maps.google.com/?q=Hacienda+La+Esperanza";

export default function InvitacionPage() {
    const search = useSearchParams();
    const familyIdFromUrl = search.get("id") ?? undefined;

    // Buscamos la familia localmente (a prueba de filtros del API)
    const prefillFamily = familyIdFromUrl
        ? FAMILIAS.find((f) => f.id === familyIdFromUrl)
        : undefined;

    const saludoHero = prefillFamily
        ? `Estimada ${prefillFamily.nombreFamilia}, ¡Estás invitad@ a nuestra boda!`
        : "¡Estás invitad@ a nuestra boda!";

    return (
        <main
            className="relative h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth no-scrollbar"
            style={{ overscrollBehaviorY: "contain", backgroundColor: SOFT_BG_CARD }}
        >
            <BackgroundAudio
                src="/audio/cancion.mp3"
                title="Nuestra canción"
                artist="Daniel & Nicole"
                cover="/assets/1.jpg"
            />

            <div className="mx-auto max-w-[640px]">
                {/* 1 — Hero */}
                <HeroCover src="/assets/1.jpg" alt="Daniel y Nicole">
                    <h1
                        className={`text-center text-5xl sm:text-8xl font-semibold ${tangerine.className} text-white drop-shadow`}
                    >
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
                            <div
                                className={`${cookie.className} text-5xl sm:text-5xl font-semibold text-slate-500`}
                            >
                                El gran día
                            </div>
                            <div
                                className="flex items-center justify-center gap-2 text-sm pt-2"
                                style={{ color: SOFT_ACCENT }}
                            >
                                <CalendarIcon className="size-4" />
                                <span className="uppercase ">
                                    {WEDDING_DATE.toLocaleDateString("es-ES", { month: "long" })}
                                </span>
                            </div>
                        </div>
                        <CalendarMonth
                            date={WEDDING_DATE}
                            highlightDate={WEDDING_DATE}
                            startOnSunday
                        />
                    </section>
                </RevealSection>

                {/* 4 — Venues */}
                <RevealSection>
                    <section className="grid gap-4 pt-6 my-3">
                        <div className="text-center pt-6">
                            <div className="flex items-center justify-center gap-1 text-sm font-medium">
                                <Heart className="size-5 text-slate-500" />{" "}
                                <span
                                    className={`${cookie.className} text-5xl sm:text-5xl font-semibold text-slate-500`}
                                >
                                    Lugar
                                </span>
                            </div>
                        </div>

                        <div>
                            <VenueBlock
                                title="Ceremonia religiosa"
                                name={CHURCH_NAME}
                                address="Dirección de la iglesia"
                                time="5:00 PM"
                                mapUrl={CHURCH_MAPS_URL}
                            />
                            <div className="px-6">
                                <Separator
                                    className="my-6"
                                    style={{ opacity: 0.6, backgroundColor: SOFT_BORDER }}
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
                    <section className="grid gap-3 pt-6">
                        <Timeline
                            items={[
                                { time: "5:00 PM", label: "Ceremonia" },
                                { time: "6:00 PM", label: "Fotos" },
                                { time: "7:00 PM", label: "Recepción" },
                                { time: "9:00 PM", label: "Brindis & cena" },
                                { time: "10:00 PM", label: "Baile" },
                            ]}
                            className="px-3 pt-2"
                            title="Itinerario"
                        />

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
                        womenColors={[
                            { color: "#D9EDF9" },
                            { color: "#E6F3FB" },
                            { color: "#F0F8FD" },
                            { color: "#F6FAFE" },
                        ]}
                        menColors={[
                            { color: "#191919" },
                            { color: "#393939" },
                            { color: "#4B4B4B" },
                            { color: "#535353" },
                        ]}
                    />
                </RevealSection>

                {/* 7 — Recomendaciones + Regalos */}
                <RevealSection>
                    <RecGiftsSection
                        className="pt-6"
                        accounts={[
                            {
                                bank: "Banco Pichincha",
                                holder: "Daniel Ulloa",
                                account: "1234567890",
                                dni: "0102030405",
                            },
                            {
                                bank: "Banco Guayaquil",
                                holder: "Nicole Torres",
                                account: "0987654321",
                                dni: "1122334455",
                            },
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
                            <div
                                className={`text-center text-5xl sm:text-8xl font-semibold ${tangerine.className} text-white drop-shadow`}
                            >
                                Confirmar asistencia
                            </div>

                            <p className={`mt-2 text-center text-white/90 ${merienda.className}`}>
                                Por favor confirma tu asistencia antes del 10 de diciembre de 2025
                            </p>

                            <div className="pt-3">
                                <RsvpButton
                                    triggerClassName="rounded-2xl px-10 border-white text-black hover:bg-white/10 bg-white/10"
                                    triggerLabel="Confirmar"
                                    prefillFamilyId={familyIdFromUrl} // compat
                                    prefillFamily={prefillFamily}     // ← la familia completa
                                />
                            </div>
                        </div>
                    </HeroCover>
                </RevealSection>
            </div>
        </main>
    );
}
