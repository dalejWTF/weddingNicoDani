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
import RevealSection from "@/components/RevealSection";
import { Tangerine, Cookie, Englebert, Merienda } from "next/font/google";
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

const englebert = Englebert({
    subsets: ["latin"],
    weight: "400",
    style: "normal",
    variable: "--font-englebert",
    display: "swap",
});

const merienda = Merienda({
    subsets: ["latin"],
    weight: "400",
    style: "normal",
    variable: "--font-merienda",
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
        <main
            className="relative h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth overflow-y-scroll no-scrollbar"
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
                <HeroCover src="/assets/1.jpg" alt="Daniel y Nicole">
                    <h1 className={`text-center text-5xl sm:text-8xl font-semibold ${tangerine.className} text-white drop-shadow`}>
                        Daniel &amp; Nicole
                    </h1>
                    <p className={`mt-2 text-center text-white/90 ${merienda.className}`}>¡Estás invitad@ a nuestra boda!</p>
                </HeroCover>

                {/* 2 — TextBlock + Countdown */}
                <RevealSection>
                    <section className="grid gap-4 pt-6">
                        <TextBlock
                            paragraphs={[
                                "Dios nos ha concedido el privilegio de conocernos y amarnos con su bendición y la de nuestros padres.",
                                "Queremos unir nuestras vidas para siempre y celebrarlo contigo.",
                            ]}
                        />
                        <CountdownBanner date={WEDDING_DATE} className="mx-3 my-3" />
                    </section>
                </RevealSection>


                {/* 3 — CalendarMonth (con título opcional dentro para que no cuente aparte) */}
                <RevealSection>
                    <section className="grid gap-2 pt-6">
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
                </RevealSection>
                {/* 4 — VenueBlock (título + ambos venues en la misma página) */}
                <RevealSection>
                    <section className="grid gap-4 pt-6">
                        <div className="text-center py-4">
                            <div className="flex items-center justify-center gap-2 text-sm font-medium">
                                <Heart className="size-5 text-neutral-500" /> <span className={`${cookie.className} text-5xl sm:text-5xl font-semibold text-neutral-500`}>Lugar</span>
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
                        <img src="/assets/3.jpg" alt="Momentos" className="pt-6 w-full object-cover aspect-[16/10]" loading="lazy" />
                    </section>
                </RevealSection>
                {/* 6 — DressCode */}
                <RevealSection>
                    <DressCode className="pt-6"
                        womenColors={[{ color: "#9DD9F3" }, { color: "#A1D7F0FF" }, { color: "#ABDCF1" }, { color: "#B8E2F2" }]}
                        menColors={[{ color: "#191919" }, { color: "#393939" }, { color: "#4B4B4B" }, { color: "#535353" }]}
                    />
                </RevealSection>
                {/* 7 — Recomendaciones + Regalos */}
                <RevealSection>
                    <RecGiftsSection className="pt-6"
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
                {/* 9 — Confirmación + Foto final */}
                <RevealSection>
                    <HeroCover src="/assets/2.jpg" alt="Nos vemos pronto">
                        <div className="max-w-screen-sm mx-auto px-3 text-center">
                            <div className={`text-center text-5xl sm:text-8xl font-semibold ${tangerine.className} text-white drop-shadow`}>
                                Confirmar asistencia
                            </div>

                            <p className={`mt-2 text-center text-white/90 ${merienda.className}`}>
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
                </RevealSection>
            </div>
        </main>
    );
}
