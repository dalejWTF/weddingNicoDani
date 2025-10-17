"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { DialogClose } from "@/components/ui/dialog";

const COLOR = "#88CFF1";
const BACKGROUNDCOLOR = "#FEFEFA"

type Family = { id: string; nombreFamilia: string; nroPersonas: number };

export default function RsvpButton({
  triggerClassName = "",
  triggerLabel = "Confirmar",
}: {
  triggerClassName?: string;
  triggerLabel?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [families, setFamilies] = React.useState<Family[]>([]);
  const [familyId, setFamilyId] = React.useState("");
  const [attendance, setAttendance] = React.useState<"si" | "no">("si");
  const [loadingFamilies, setLoadingFamilies] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [loadedOnce, setLoadedOnce] = React.useState(false);

  // ⭐ Nuevo: dialog de éxito
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [successData, setSuccessData] = React.useState<
    null | { nombreFamilia: string; nroPersonas: number; asistencia: boolean }
  >(null);

  const selected = families.find(f => f.id === familyId) ?? null;

  // Cargar familias al abrir
  React.useEffect(() => {
    if (!open || loadedOnce) return;
    (async () => {
      try {
        setLoadingFamilies(true);
        const res = await fetch("/api/rsvp/eligible", { cache: "no-store" });
        const data = await res.json();
        setFamilies(data.families ?? []);
      } finally {
        setLoadingFamilies(false);
        setLoadedOnce(true);
      }
    })();
  }, [open, loadedOnce]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    try {
      const asistenciaBool = attendance === "si";
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyId: selected.id,
          nombreFamilia: selected.nombreFamilia,
          nroPersonas: selected.nroPersonas,
          asistencia: asistenciaBool,
        }),
      });

      if (res.status === 409) {
        // ya existía: la quitamos local y limpiamos selección
        setFamilies(prev => prev.filter(f => f.id !== selected.id));
        setFamilyId("");
        return;
      }

      if (!res.ok) throw new Error(await res.text());

      // éxito: limpiar, cerrar formulario y abrir dialog de éxito
      setFamilies(prev => prev.filter(f => f.id !== selected.id));
      setFamilyId("");
      setOpen(false);
      setSuccessData({
        nombreFamilia: selected.nombreFamilia,
        nroPersonas: selected.nroPersonas,
        asistencia: asistenciaBool,
      });
      setTimeout(() => setSuccessOpen(true), 0); // evita solapar portales
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  const noneLeft = loadedOnce && !loadingFamilies && families.length === 0;

  return (
    <>
      {/* Dialog del formulario */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={`rounded-2xl px-10 ${triggerClassName}`}
            disabled={noneLeft}
            title={noneLeft ? "Ya no hay familias pendientes" : ""}
          >
            {noneLeft ? "Sin pendientes" : triggerLabel}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md" style={{backgroundColor: BACKGROUNDCOLOR}}>
          <DialogHeader>
            <DialogTitle>Confirmar asistencia</DialogTitle>
          </DialogHeader>

          {loadingFamilies ? (
            <div className="text-sm text-muted-foreground">Cargando familias…</div>
          ) : noneLeft ? (
            <div className="text-sm text-muted-foreground">No hay familias pendientes por responder.</div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label>Familia</Label>
                <Select value={familyId} onValueChange={setFamilyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu familia" />
                  </SelectTrigger>
                  <SelectContent>
                    {families.map(f => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.nombreFamilia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Número de personas</Label>
                <Input value={selected?.nroPersonas ?? ""} readOnly />
              </div>

              <div className="grid gap-2">
                <Label>¿Asistirán?</Label>
                <RadioGroup
                  value={attendance}
                  onValueChange={(v: "si" | "no") => setAttendance(v)}
                  className="grid grid-cols-2 gap-2"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-2">
                    <RadioGroupItem id="asist-si" value="si" />
                    <Label htmlFor="asist-si">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-2">
                    <RadioGroupItem id="asist-no" value="no" />
                    <Label htmlFor="asist-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={!selected || submitting} className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2
                         hover:bg-blue-600/75 active:bg-blue-600/75 bg-blue-400/90">
                  {submitting ? "Enviando..." : "Enviar confirmación"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ⭐ Dialog de éxito */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent
          className="
      sm:max-w-md bg-transparent border-0 shadow-none p-0
      [&>button]:hidden [&_[data-slot='dialog-close']]:hidden
    "
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="rounded-xl bg-background p-6 shadow-2xl"
          >
            <DialogHeader className="items-center">
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
              <DialogTitle className="text-center">¡Confirmación enviada!</DialogTitle>
            </DialogHeader>

            <div className="space-y-1 text-sm text-center">
              <p>
                Registramos la respuesta de <b>{successData?.nombreFamilia}</b> para{" "}
                <b>{successData?.nroPersonas}</b> {successData?.nroPersonas === 1 ? "persona" : "personas"}.
              </p>
              {successData?.asistencia && <p>¡Qué emoción, nos vemos en la boda! 🎉</p>}
            </div>

            <DialogFooter className="mt-4 justify-center">
              <DialogClose asChild>
                <Button>Aceptar</Button>
              </DialogClose>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
