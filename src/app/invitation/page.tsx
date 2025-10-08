"use client";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Send, Heart } from "lucide-react";
import CalendarMonth from "@/components/CalendarMonth";
import GalleryCarousel from "@/components/GalleryCarousel";
import QuoteBlock from "@/components/QuoteBlock";
import TextBlock from "@/components/TextBlock";
import VenueBlock from "@/components/VenueBlock";
import Timeline from "@/components/Timeline";
import RevealSection from "@/components/RevealSection";
import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator";


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
        <main className="min-h-dvh w-full bg-white">
            {/* Layout continuo sin gaps */}
            <section className="mx-auto w-full max-w-screen-sm overflow-x-hidden">
                <RevealSection>
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Daniel & Nicole</h1>
                        <p className="text-sm text-neutral-600">¡Estás invitad@ a nuestra boda!</p>
                    </div>
                </RevealSection>

                <RevealSection>
                    <img
                        src="/assets/1.jpg"
                        alt="Pareja"
                        className="w-full object-cover aspect-[16/10]"
                        loading="lazy"
                    />
                </RevealSection>

                <RevealSection>
                    <TextBlock
                        paragraphs={[
                            "Dios nos ha concedido el privilegio de conocernos y amarnos con su bendición y la de nuestros padres.",
                            "Queremos unir nuestras vidas para siempre y celebrarlo contigo.",
                        ]}
                    />
                </RevealSection>

                <RevealSection>
                    <CountdownBanner date={WEDDING_DATE} className="mx-3 my-3" />
                </RevealSection>

                <RevealSection>
                    <div className="text-center py-2">
                        <div className="text-xs tracking-[0.2em] uppercase text-neutral-500">El gran día</div>
                        <div className="flex items-center justify-center gap-2 text-sm text-neutral-700">
                            <CalendarIcon className="size-4" />
                            <span className="uppercase">{WEDDING_DATE.toLocaleDateString("es-ES", { month: "long" })}</span>
                        </div>
                    </div>
                    <CalendarMonth date={WEDDING_DATE} highlightDate={WEDDING_DATE} startOnSunday />
                </RevealSection>

                <RevealSection>
                    <div className="text-center py-4">
                        <div className="flex items-center justify-center gap-2 text-sm font-medium">
                            <Heart className="size-4" /> <span className="uppercase tracking-wide">Lugar</span>
                        </div>
                    </div>
                    <VenueBlock
                        title="Ceremonia religiosa"
                        name={CHURCH_NAME}
                        address="Dirección de la iglesia"
                        time="5:00 PM"
                        mapUrl={CHURCH_MAPS_URL}
                    />
                    <Separator className="my-2 mx-12 opacity-50" />
                    <VenueBlock
                        title="Recepción"
                        name={RECEPTION_NAME}
                        address="Dirección de la recepción"
                        time="7:00 PM"
                        mapUrl={RECEPTION_MAPS_URL}
                    />
                </RevealSection>

                {/* Itinerario como timeline */}
                <RevealSection>
                    <Timeline
  title="Itinerario"
  items={[
    { time: "4:30 PM", label: "Recepción de invitados" },
    { time: "5:00 PM", label: "Ceremonia" },
    { time: "6:30 PM", label: "Brindis & fotos" },
    { time: "7:00 PM", label: "Recepción & cena" },
    { time: "10:00 PM", label: "Baile" },
  ]}
  live
  dateBase={WEDDING_DATE}
/>
                </RevealSection>

                <RevealSection>
                    <img
                        src="/assets/3.jpg"
                        alt="Momentos"
                        className="w-full object-cover aspect-[16/10]"
                        loading="lazy"
                    />
                </RevealSection>

                <RevealSection>
                    <div className="px-3 py-4 space-y-4">
                        <div className="rounded-3xl border bg-neutral-50 px-4 py-5">
                            <div className="text-center text-sm font-semibold uppercase tracking-wide mb-2">Código de vestimenta</div>
                            <p className="text-center text-sm text-neutral-700">Mujeres: Vestido largo y elegante. Hombres: Atuendo formal (camisa manga larga). Evitar blanco puro.</p>
                        </div>
                        <div className="rounded-3xl border bg-neutral-50 px-4 py-5">
                            <div className="text-center text-sm font-semibold uppercase tracking-wide mb-2">Recomendaciones</div>
                            <p className="text-center text-sm text-neutral-700">Seguir las indicaciones del personal, ser puntual y llevar abrigo ligero (locación al aire libre).</p>
                        </div>
                        <div className="rounded-3xl border bg-neutral-50 px-4 py-5">
                            <div className="text-center text-sm font-semibold uppercase tracking-wide mb-2">Lluvia de sobres</div>
                            <p className="text-center text-sm text-neutral-700">Tu presencia es lo más valioso; si deseas obsequiarnos algo, agradecemos el detalle en sobre.</p>
                        </div>
                    </div>
                </RevealSection>
                <RevealSection>
                    <GalleryCarousel aspect={4/3}
                        images={[
                            { src: "/assets/4.jpg", alt: "Foto 1" },
                            { src: "/assets/5.jpg", alt: "Foto 2" },
                            { src: "/assets/6.jpg", alt: "Foto 3" },
                        ]}
                    />
                </RevealSection>
                <RevealSection>
                    <QuoteBlock quote="El amor nunca se da por vencido, jamás pierde la fe, siempre tiene esperanzas y se mantiene firme en toda circunstancia." author="1 Corintios 13:7" />
                </RevealSection>

                <RevealSection>
                    <div className="px-3 py-6 text-center">
                        <div className="text-sm font-semibold uppercase tracking-wide mb-1">Confirmar asistencia</div>
                        <p className="text-sm text-neutral-700">Por favor confirma tu asistencia antes del 10 de septiembre de 2025</p>
                        <div className="pt-3">
                            <Button asChild variant="outline" className="rounded-2xl px-10">
                                <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer">Confirmar</a>
                            </Button>
                        </div>
                    </div>
                </RevealSection>

                <RevealSection>
                    <img
                        src="/assets/2.jpg"
                        alt="Nos vemos pronto"
                        className="w-full object-cover aspect-[16/10]"
                        loading="lazy"
                    />
                </RevealSection>
            </section>
        </main>
    );
}