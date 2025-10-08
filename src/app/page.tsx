import Envelope from "@/components/Envelope";


export default function Page() {
return (
<main className="grid min-h-dvh place-items-center p-6">
<div className="text-center space-y-8">
<div className="space-y-1">
<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Nuestra Boda</h1>
<p className="text-sm sm:text-base text-neutral-600">Toca el sobre para abrir la invitación</p>
</div>
<Envelope href="/invitation" />
</div>
</main>
);
}