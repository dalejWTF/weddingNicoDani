// app/invitation/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Heart } from "lucide-react";
import CalendarMonth from "@/components/CalendarMonth";
import GalleryCarousel from "@/components/GalleryCarousel";
import QuoteBlock from "@/components/QuoteBlock";
import TextBlock from "@/components/TextBlock";
import VenueBlock from "@/components/VenueBlock";
import Timeline from "@/components/Timeline";
import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator";
import SnapPager from "@/components/SnapPager";
import { Tangerine, Cookie } from "next/font/google";
import DressCode from "@/components/DressCode";
import RecGiftsSection from "@/components/RecGiftsSection";
import BackgroundAudio from "@/components/BackgroundAudio";
import HeroCover from "@/components/HeroCover";

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

// Contador estilo banner (CSR para evitar hydration)
const CountdownBanner = dynamic(() => import("@/components/CountdownBanner"), { ssr: false });

const WEDDING_DATE = new Date("2025-12-20T17:00:00");

// Ubicaciones independientes (reemplaza por tus datos reales)
const CHURCH_NAME = "Iglesia San Isidro";
const CHURCH_MAPS_URL = "https://maps.google.com/?q=Iglesia+San+Francisco";
const RECEPTION_NAME = "Quinta Carbonero";
const RECEPTION_MAPS_URL = "https://maps.google.com/?q=Hacienda+La+Esperanza";

// Formulario de Google para RSVP (reemplaza el id)
const GOOGLE_FORM_URL = "https://forms.gle/tu-form-id";

export default function InvitacionPage() {
    return (
        <main className="min-h-dvh w-full bg-white ">
            <BackgroundAudio
                src="/audio/cancion.mp3"
                title="Nuestra canción"
                artist="Daniel & Nicole"
                cover="/assets/1.jpg"
            />
            < SnapPager pageSize={1} >

                {/* 1 — Hero */}
                <HeroCover src="/assets/1.jpg" alt="Daniel y Nicole">
                    <h1 className={`text-center text-5xl sm:text-8xl font-semibold ${tangerine.className} text-white drop-shadow`}>
                        Daniel &amp; Nicole
                    </h1>
                    <p className="mt-2 text-center text-white/90">¡Estás invitad@ a nuestra boda!</p>
                </HeroCover>

                {/* 2 — TextBlock + Countdown */}
                <section className="grid gap-4">
                    <TextBlock
                        paragraphs={[
                            "Dios nos ha concedido el privilegio de conocernos y amarnos con su bendición y la de nuestros padres.",
                            "Queremos unir nuestras vidas para siempre y celebrarlo contigo.",
                        ]}
                    />
                    <CountdownBanner date={WEDDING_DATE} className="mx-3 my-3" />
                </section>

                {/* 3 — CalendarMonth (con título opcional dentro para que no cuente aparte) */}
                <section className="grid gap-2">
                    {/* Si no quieres este encabezado, bórralo */}
                    <div className="text-center py-2">
                        <div className={`${cookie.className} text-5xl sm:text-5xl font-semibold text-neutral-500`}>El gran día</div>
                        <div className="flex items-center justify-center gap-2 text-sm text-neutral-700">
                            <CalendarIcon className="size-4" />
                            <span className="uppercase">{WEDDING_DATE.toLocaleDateString("es-ES", { month: "long" })}</span>
                        </div>
                    </div>
                    <CalendarMonth date={WEDDING_DATE} highlightDate={WEDDING_DATE} startOnSunday />
                </section>

                {/* 4 — VenueBlock (título + ambos venues en la misma página) */}
                <section className="grid gap-4">
                    <div className="text-center py-4">
                        <div className="flex items-center justify-center gap-2 text-sm font-medium">
                            <Heart className="size-4" /> <span className="uppercase tracking-wide">Lugar</span>
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
                            <Separator className="my-6 opacity-50" />
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

                {/* 5 — Timeline + Imagen */}
                <section className="grid gap-3">
                    <Timeline
                        items={[
                            { time: "4:30 PM", label: "Recepción de invitados" },
                            { time: "5:00 PM", label: "Ceremonia" },
                            { time: "6:30 PM", label: "Brindis & fotos" },
                            { time: "7:00 PM", label: "Recepción & cena" },
                            { time: "10:00 PM", label: "Baile" },
                        ]}
                        className="px-3 pt-2"
                        title="Itinerario"
                    />
                    <img src="/assets/3.jpg" alt="Momentos" className="w-full object-cover aspect-[16/10]" loading="lazy" />
                </section>

                {/* 6 — DressCode */}
                <DressCode
                    womenColors={[{ color: "#9DD9F3" }, { color: "#A1D7F0FF" }, { color: "#ABDCF1" }, { color: "#B8E2F2" }]}
                    menColors={[{ color: "#191919" }, { color: "#393939" }, { color: "#4B4B4B" }, { color: "#535353" }]}
                />

                {/* 7 — Recomendaciones + Regalos */}
                <RecGiftsSection
                    accounts={[
                        { bank: "Banco Pichincha", holder: "Daniel Ulloa", account: "1234567890", dni: "0102030405" },
                        { bank: "Banco Guayaquil", holder: "Nicole Torres", account: "0987654321", dni: "1122334455" },
                    ]}
                />

                {/* 8 — Carrusel + Cita */}
                <section className="grid gap-3">
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

                {/* 9 — Confirmación + Foto final */}
                <HeroCover src="/assets/2.jpg" alt="Nos vemos pronto">
                    <div className="max-w-screen-sm mx-auto px-3 text-center">
                        <div className="text-sm font-semibold uppercase tracking-wide mb-1 text-white/90">
                            Confirmar asistencia
                        </div>

                        <p className="text-sm sm:text-base text-white/90">
                            Por favor confirma tu asistencia antes del 10 de septiembre de 2025
                        </p>

                        <div className="pt-3">
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-2xl px-10 border-white text-white hover:bg-white/10 bg-white/10"
                            >
                                <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer">
                                    Confirmar
                                </a>
                            </Button>
                        </div>
                    </div>
                </HeroCover>

            </ SnapPager >
        </main>
    );
}
