// components/BankAccountsDialog.tsx
"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
const BACKGROUNDCOLOR = "#FEFEFA"
export type BankAccount = {
  bank: string;     // nombre banco
  holder: string;   // nombre titular
  account: string;  // nro de cuenta
  dni: string;      // dni
};

export default function BankAccountsDialog({
  open,
  onOpenChange,
  accounts,
  title = "Cuentas para regalo",
  description = "Gracias por tu cariño. Puedes usar cualquiera de estas cuentas:",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  accounts: BankAccount[];
  title?: string;
  description?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-2xl" style={{backgroundColor: BACKGROUNDCOLOR}}>
        <DialogHeader>
          <DialogTitle className="text-2xl tracking-wide">{title}</DialogTitle>
          <DialogDescription className="text-sm">{description}</DialogDescription>
        </DialogHeader>

        <ul className="grid gap-4">
          {accounts.map((acc, i) => (
            <li
              key={i}
              className="rounded-2xl border p-4 sm:p-5 shadow-sm ring-1 ring-blue-300/70" style={{backgroundColor: BACKGROUNDCOLOR}}
            >
              <div className="mb-2 text-base font-semibold">{acc.bank}</div>

              <FieldRow label="Titular" value={acc.holder} />
              <FieldRow label="Nro. de cuenta" value={acc.account} copyable />
              <FieldRow label="DNI" value={acc.dni} copyable />

              <div className="mt-3">
                <CopyAllButton acc={acc} />
              </div>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

function FieldRow({
  label,
  value,
  copyable = false,
}: {
  label: string;
  value: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <div className="text-sm">
        <span className="text-neutral-500">{label}:</span>{" "}
        <span className="font-medium text-neutral-900">{value}</span>
      </div>

      {copyable && (
        <Button
          size="sm"
          variant="outline"
          className="h-8 rounded-xl shadow-sm ring-1 ring-blue-300/70"
          onClick={handleCopy}
          aria-label={`Copiar ${label}`}
          style={{backgroundColor: BACKGROUNDCOLOR}}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </Button>
      )}
    </div>
  );
}

function CopyAllButton({ acc }: { acc: BankAccount }) {
  const [copied, setCopied] = React.useState(false);
  const text = `Banco: ${acc.bank}\nTitular: ${acc.holder}\nCuenta: ${acc.account}\nDNI: ${acc.dni}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <Button onClick={handleCopy} variant="secondary" className="rounded-xl ring-1 ring-blue-300/70 shadow-sm" style={{backgroundColor: BACKGROUNDCOLOR}}>
      {copied ? (
        <>
          <Check className="mr-2 size-4" /> Copiado
        </>
      ) : (
        <>
          <Copy className="mr-2 size-4" /> Copiar datos
        </>
      )}
    </Button>
  );
}
