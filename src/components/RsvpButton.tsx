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

        <DialogContent className="sm:max-w-md">
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
                <Button type="submit" disabled={!selected || submitting}>
                  {submitting ? "Enviando..." : "Enviar confirmación"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ⭐ Dialog de éxito */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <DialogTitle>¡Confirmación enviada!</DialogTitle>
          </DialogHeader>
          <div className="space-y-1 text-sm">
            <p>
              Registramos la respuesta de <b>{successData?.nombreFamilia}</b> para{" "}
              <b>{successData?.nroPersonas}</b> {successData?.nroPersonas === 1 ? "persona" : "personas"}.
            </p>
            {successData?.asistencia && <p>¡Qué emoción, nos vemos en la boda! 🎉</p>}
          </div>
          <DialogFooter>
            <Button onClick={() => setSuccessOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
