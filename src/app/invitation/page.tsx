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
import { Tangerine, Lora } from "next/font/google";
import DressCode from "@/components/DressCode";
import RecGiftsSection from "@/components/RecGiftsSection";
import BackgroundAudio from "@/components/BackgroundAudio";

const tangerine = Tangerine({
    subsets: ["latin"],
    weight: "700",
    style: "normal",
    variable: "--font-tangerine",
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
            <SnapPager>
                {/* 1 */}
                <div className="text-center">
                    <h1 className={`text-3xl sm:text-8xl font-semibold tracking-tight ${tangerine.className}`}>
                        Daniel &amp; Nicole</h1>
                    <p className="text-sm text-neutral-600">¡Estás invitad@ a nuestra boda!</p>
                </div>

                {/* 2 */}
                <img
                    src="/assets/1.jpg"
                    alt="Pareja"
                    className="block w-full max-w-full object-cover aspect-[16/10]"
                    loading="lazy"
                />


                {/* 3 */}
                <TextBlock
                    paragraphs={[
                        "Dios nos ha concedido el privilegio de conocernos y amarnos con su bendición y la de nuestros padres.",
                        "Queremos unir nuestras vidas para siempre y celebrarlo contigo.",
                    ]}
                />

                {/* 4 */}
                <CountdownBanner date={WEDDING_DATE} className="mx-3 my-3" />

                {/* 5 */}
                <div className="text-center py-2">
                    <div className="text-xs tracking-[0.2em] uppercase text-neutral-500">El gran día</div>
                    <div className="flex items-center justify-center gap-2 text-sm text-neutral-700">
                        <CalendarIcon className="size-4" />
                        <span className="uppercase">
                            {WEDDING_DATE.toLocaleDateString("es-ES", { month: "long" })}
                        </span>
                    </div>
                </div>

                {/* 6 */}
                <CalendarMonth date={WEDDING_DATE} highlightDate={WEDDING_DATE} startOnSunday />

                {/* 7 */}
                <div className="text-center py-4">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium">
                        <Heart className="size-4" /> <span className="uppercase tracking-wide">Lugar</span>
                    </div>
                </div>

                {/* 8 */}
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

                {/* 9 */}
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

                {/* 10 */}
                <img
                    src="/assets/3.jpg"
                    alt="Momentos"
                    className="w-full object-cover aspect-[16/10]"
                    loading="lazy"
                />

                {/* 11 */}

                <DressCode
                    womenColors={[
                        { color: "#9DD9F3" }, { color: "#A1D7F0FF" }, { color: "#ABDCF1" }, { color: "#B8E2F2" },
                    ]}
                    menColors={[
                        { color: "#191919" }, { color: "#393939" }, { color: "#4B4B4B" }, { color: "#535353" },
                    ]}
                />


                {/* 12 — Recomendaciones + Regalos (dos tarjetas con el mismo look) */}
                <RecGiftsSection
                // opcional: personaliza textos o agrega mesa de regalos
                // registryLabel="Ver mesa de regalos"
                // registryUrl="https://tulista.com"
                />

                {/* 13 — Carrusel */}
                <GalleryCarousel
                    aspect={4 / 3}
                    images={[
                        { src: "/assets/4.jpg", alt: "Foto 1" },
                        { src: "/assets/5.jpg", alt: "Foto 2" },
                        { src: "/assets/6.jpg", alt: "Foto 3" },
                    ]}
                />

                {/* 14 — Cita */}
                <QuoteBlock
                    quote="El amor nunca se da por vencido, jamás pierde la fe, siempre tiene esperanzas y se mantiene firme en toda circunstancia."
                    author="1 Corintios 13:7"
                />

                {/* 15 — Confirmación */}
                <div className="px-3 py-10 text-center">
                    <div className="text-sm font-semibold uppercase tracking-wide mb-1">
                        Confirmar asistencia
                    </div>
                    <p className="text-sm text-neutral-700">
                        Por favor confirma tu asistencia antes del 10 de septiembre de 2025
                    </p>
                    <div className="pt-3">
                        <Button asChild variant="outline" className="rounded-2xl px-10">
                            <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer">
                                Confirmar
                            </a>
                        </Button>
                    </div>
                </div>

                {/* 16 — Foto final */}
                <img
                    src="/assets/2.jpg"
                    alt="Nos vemos pronto"
                    className="w-full object-cover aspect-[16/10]"
                    loading="lazy"
                />
            </SnapPager>
        </main>
    );
}
