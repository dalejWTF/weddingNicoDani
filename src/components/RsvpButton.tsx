// components/RsvpButton.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const SOFT_BORDER = "#DBEAF5";
const SOFT_BTN_BG = "#EAF3FB";
const SOFT_BTN_BG_HOVER = "#E1EEF8";

type Family = { id: string; nombreFamilia: string; nroPersonas: number };

export default function RsvpButton({
  triggerClassName = "",
  triggerLabel = "Confirmar",
  prefillFamilyId,
  prefillFamily,
  confirmed,              // ← NUEVO (controlado desde el padre)
  onConfirmed,            // ← NUEVO (callback al confirmar)
}: {
  triggerClassName?: string;
  triggerLabel?: string;
  prefillFamilyId?: string;
  prefillFamily?: Family;
  confirmed?: boolean;
  onConfirmed?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [families, setFamilies] = React.useState<Family[]>([]);
  const [familyId, setFamilyId] = React.useState(prefillFamily?.id ?? "");
  const [attendance, setAttendance] = React.useState<"si" | "no">("si");
  const [loadingFamilies, setLoadingFamilies] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [loadedOnce, setLoadedOnce] = React.useState(false);

  const [successOpen, setSuccessOpen] = React.useState(false);
  const [successData, setSuccessData] = React.useState<
    null | { nombreFamilia: string; nroPersonas: number; asistencia: boolean }
  >(null);

  // Estados internos para autochequeo cuando hay prefill
  const [alreadyResponded, setAlreadyResponded] = React.useState(false);
  const [checkingStatus, setCheckingStatus] = React.useState(false);

  const hasPrefill = Boolean(prefillFamily || prefillFamilyId);
  const selected: Family | null =
    families.find((f) => f.id === familyId) || prefillFamily || null;

  // Si el padre pasa "confirmed", ése es la fuente de la verdad; si no, usamos el interno.
  const isConfirmed = (confirmed ?? alreadyResponded) === true;

  // Si viene prefill y el padre NO controla "confirmed", verificamos con eligible
  React.useEffect(() => {
    if (!hasPrefill) return;
    if (confirmed !== undefined) return; // padre controla, no auto-checkeamos aquí
    const id = prefillFamily?.id ?? prefillFamilyId!;
    let cancelled = false;

    (async () => {
      try {
        setCheckingStatus(true);
        const res = await fetch("/api/rsvp/eligible", { cache: "no-store" });
        const data = await res.json();
        const list: Family[] = data.families ?? [];
        const stillEligible = list.some((f) => f.id === id);
        if (!cancelled) setAlreadyResponded(!stillEligible);
      } catch {
        // en error no bloqueamos
      } finally {
        if (!cancelled) setCheckingStatus(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasPrefill, confirmed, prefillFamily, prefillFamilyId]);

  // Cargar familias solo para el selector (sin prefill)
  React.useEffect(() => {
    if (!open || loadedOnce || hasPrefill) return;
    (async () => {
      try {
        setLoadingFamilies(true);
        const res = await fetch("/api/rsvp/eligible", { cache: "no-store" });
        const data = await res.json();
        const list: Family[] = data.families ?? [];
        setFamilies(list);
      } finally {
        setLoadingFamilies(false);
        setLoadedOnce(true);
      }
    })();
  }, [open, loadedOnce, hasPrefill]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || isConfirmed) return; // bloquea doble envío
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
        // ya respondió
        setFamilies((prev) => prev.filter((f) => f.id !== selected.id));
        setFamilyId("");
        setAlreadyResponded(true);
        onConfirmed?.();       // ← avisa al padre
        setOpen(false);
        return;
      }
      if (!res.ok) throw new Error(await res.text());

      setFamilies((prev) => prev.filter((f) => f.id !== selected.id));
      setFamilyId("");
      setOpen(false);
      setSuccessData({
        nombreFamilia: selected.nombreFamilia,
        nroPersonas: selected.nroPersonas,
        asistencia: asistenciaBool,
      });

      // ← marca como confirmado y avisa al padre (oculta el botón inmediatamente)
      setAlreadyResponded(true);
      onConfirmed?.();

      // mostramos el modal de éxito
      setTimeout(() => setSuccessOpen(true), 0);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  const noneLeft = loadedOnce && !loadingFamilies && families.length === 0;

  // Si viene por link (prefill) y ya está confirmado (o mientras chequea), no muestres el botón
  if (hasPrefill && (isConfirmed || checkingStatus)) {
    return null;
  }

  return (
    <>
      {/* Botón que abre el diálogo */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={`rounded-2xl px-10 ${triggerClassName}`}
            disabled={noneLeft}
            title={noneLeft ? "Ya no hay familias pendientes" : ""}
            style={{ borderColor: SOFT_BORDER, backgroundColor: "#f7f7f7ff" }}
          >
            {noneLeft ? "Sin pendientes" : triggerLabel}
          </Button>
        </DialogTrigger>

        {/* Formulario */}
        <DialogContent
          className="sm:max-w-md rounded-3xl"
          style={{ backgroundColor: "#f7f7f7ff", borderColor: SOFT_BORDER }}
        >
          <DialogHeader>
            <DialogTitle>Confirmar asistencia</DialogTitle>
          </DialogHeader>

          {loadingFamilies ? (
            <div className="text-sm text-slate-500">Cargando familias…</div>
          ) : noneLeft && !selected ? (
            <div className="text-sm text-slate-500">
              No hay familias pendientes por responder.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4">
              {/* Banda informativa cuando llega por link */}
              {hasPrefill && selected && (
                <div
                  className="px-3 py-2 text-sm"
                  style={{ borderColor: SOFT_BORDER, backgroundColor: "#f7f7f7ff" }}
                >
                  Invitación para: <b>{selected.nombreFamilia}</b>
                </div>
              )}

              {/* Selector visible solo si NO viene prellenado */}
              {!hasPrefill && (
                <div className="grid gap-2">
                  <Label>Familia</Label>
                  <Select value={familyId} onValueChange={setFamilyId}>
                    <SelectTrigger
                      style={{ borderColor: SOFT_BORDER, backgroundColor: "#f7f7f7ff" }}
                    >
                      <SelectValue placeholder="Selecciona tu familia" />
                    </SelectTrigger>
                    <SelectContent>
                      {families.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.nombreFamilia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="px-3 py-2 text-sm">
                <Label>
                  Número de personas <b>{selected?.nroPersonas ?? ""}</b>
                </Label>
              </div>

              <div className="px-3 grid gap-2 display-flex">
                <Label>¿Asistirán?</Label>

                <RadioGroup
                  value={attendance}
                  onValueChange={(v: "si" | "no") => setAttendance(v)}
                  className="grid grid-cols-4 gap-2 flex "
                >
                  <Label
                    htmlFor="asist-si"
                    className={[
                      "block w-full rounded-md border p-3 cursor-pointer select-none transition",
                      attendance === "si"
                        ? "bg-white shadow-sm ring-2 ring-offset-0"
                        : "bg-white hover:bg-slate-50",
                    ].join(" ")}
                    style={{ borderColor: SOFT_BORDER, backgroundColor: "#f7f7f7ff" }}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="asist-si" value="si" />
                      <span>Sí</span>
                    </div>
                  </Label>

                  <Label
                    htmlFor="asist-no"
                    className={[
                      "block w-full rounded-md border p-3 cursor-pointer select-none transition",
                      attendance === "no"
                        ? "bg-white shadow-sm ring-2 ring-offset-0"
                        : "bg-white hover:bg-slate-50",
                    ].join(" ")}
                    style={{ borderColor: SOFT_BORDER, backgroundColor: "#f7f7f7ff" }}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="asist-no" value="no" />
                      <span>No</span>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={!selected || submitting}
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition"
                  style={{
                    backgroundColor: "#f7f7f7ff",
                    border: `1px solid ${SOFT_BORDER}`,
                    color: "#0F172A",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = SOFT_BTN_BG_HOVER)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = SOFT_BTN_BG)
                  }
                >
                  {submitting ? "Enviando..." : "Enviar confirmación"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Éxito */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md bg-transparent border-0 shadow-none p-0 [&>button]:hidden [&_[data-slot='dialog-close']]:hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="rounded-xl p-6 shadow-2xl"
            style={{ backgroundColor: "#f7f7f7ff", border: `1px solid ${SOFT_BORDER}` }}
          >
            <DialogHeader className="items-center">
              <div
                className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: "#E8F6EE" }}
              >
                <CheckCircle2 className="h-7 w-7" style={{ color: "#22C55E" }} />
              </div>
              <DialogTitle className="text-center">¡Confirmación enviada!</DialogTitle>
            </DialogHeader>

            <div className="space-y-1 text-sm text-center text-slate-700">
              <p>
                Registramos la respuesta de <b>{successData?.nombreFamilia}</b> para{" "}
                <b>{successData?.nroPersonas}</b>{" "}
                {successData?.nroPersonas === 1 ? "persona" : "personas"}.
              </p>
              {successData?.asistencia && <p>¡Qué emoción, nos vemos en la boda! 🎉</p>}
            </div>

            <DialogFooter className="mt-4 justify-center">
              <DialogClose asChild>
                <Button
                  className="rounded-xl"
                  style={{
                    backgroundColor: SOFT_BTN_BG,
                    border: `1px solid ${SOFT_BORDER}`,
                    color: "#0F172A",
                  }}
                >
                  Aceptar
                </Button>
              </DialogClose>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
