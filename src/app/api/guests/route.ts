// app/api/guests/route.ts
import { NextResponse } from "next/server";
import { loadGuests } from "@/lib/loadGuests";

export const runtime = "nodejs";

const OWNER  = process.env.GITHUB_OWNER!;
const REPO   = process.env.GITHUB_REPO!;
const BRANCH = process.env.GITHUB_BRANCH || "main";
const PATH   = process.env.GITHUB_DATA_PATH || "data/rsvps.md";
const TOKEN  = process.env.GITHUB_TOKEN!;
const GH = "https://api.github.com";

type GhFile = { content: string; sha?: string };

async function getRsvpsFile(): Promise<GhFile | null> {
  const res = await fetch(
    `${GH}/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(PATH)}?ref=${BRANCH}`,
    {
      headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/vnd.github+json" },
      cache: "no-store",
    }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as GhFile;
}

/* ------------------------------ Parser RSVP MD ------------------------------ */

type RsvpStatus = "si" | "no" | null;

type RsvpRecord = {
  familyId: string;
  status: RsvpStatus;
  responded: boolean;
  attending: boolean;
  declined: boolean;
  nombreFamilia?: string;
  nroPersonas?: number;
  at?: string;
  /** interno para ordenar por aparición cuando no hay fecha parseable */
  __order?: number;
};

function toBool(v: unknown): boolean | undefined {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (["true", "si", "sí", "yes", "1"].includes(s)) return true;
    if (["false", "no", "0"].includes(s)) return false;
  }
  return undefined;
}
function toNum(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.trim());
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}
function normStatus(v: unknown): RsvpStatus {
  const b = toBool(v);
  if (b === true) return "si";
  if (b === false) return "no";
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (["si", "sí", "yes", "true", "1"].includes(s)) return "si";
    if (["no", "false", "0"].includes(s)) return "no";
  }
  return null;
}

/**
 * Parsea una tabla markdown tipo:
 * | time | family_id | nombre | nro_personas | response |
 * y sinónimos:
 * - id: family_id, familyid, id
 * - response: response, status, asistencia, attending, attendance, answer, rsvp
 * - time: time, timestamp, fecha, at
 * - nombre: nombrefamilia, nombre, name
 * - nro: nropersonas, personas, nro, pase
 *
 * Devuelve el ÚLTIMO registro por familia (por fecha si existe; si no, por orden).
 */
function parseRsvpMarkdown(md: string): Map<string, RsvpRecord> {
  const map = new Map<string, RsvpRecord>();

  const lines = md.split(/\r?\n/).filter((l) => l.trim().startsWith("|"));
  if (lines.length === 0) return map;

  const headerLine = lines.find((l) => l.trim().startsWith("|") && !l.includes("|---|"));
  if (!headerLine) return map;

  const headerCells = headerLine
    .split("|")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const idx = (names: string[]) => {
    for (const n of names) {
      const i = headerCells.indexOf(n);
      if (i >= 0) return i;
    }
    return -1;
  };

  const iTime     = idx(["time", "timestamp", "fecha", "at"]);
  const iFamilyId = idx(["family_id", "familyid", "id"]);
  const iNombre   = idx(["nombrefamilia", "nombre", "name"]);
  const iNro      = idx(["nropersonas", "personas", "nro", "pase"]);
  const iResp     = idx(["response", "status", "asistencia", "attending", "attendance", "answer", "rsvp"]);

  const dataLines = lines.filter((l) => l.trim().startsWith("|") && !l.includes("|---|")).slice(1);

  const records: RsvpRecord[] = [];

  dataLines.forEach((line, order) => {
    const cellsRaw = line.split("|").map((s) => s.trim());
    const cells = cellsRaw.filter(Boolean); // quita el vacío por el pipe inicial

    const familyId = iFamilyId >= 0 ? (cells[iFamilyId] || "").toString().trim() : "";
    if (!familyId) return;

    const nombreFamilia = iNombre >= 0 ? cells[iNombre] : undefined;
    const nroPersonas   = iNro >= 0 ? toNum(cells[iNro]) : undefined;
    const at            = iTime >= 0 ? cells[iTime] : undefined;

    let respVal: unknown = undefined;
    if (iResp >= 0) respVal = cells[iResp];

    const status = normStatus(respVal);

    const rec: RsvpRecord = {
      familyId,
      status,
      responded: status !== null,
      attending: status === "si",
      declined: status === "no",
      nombreFamilia,
      nroPersonas,
      at,
      __order: order,
    };
    records.push(rec);
  });

  // Mantener el último por familyId
  const latest = new Map<string, RsvpRecord>();
  for (const r of records) {
    const prev = latest.get(r.familyId);
    if (!prev) {
      latest.set(r.familyId, r);
      continue;
    }
    const tPrev = Date.parse(prev.at ?? "");
    const tCurr = Date.parse(r.at ?? "");
    if (Number.isFinite(tPrev) && Number.isFinite(tCurr)) {
      if (tCurr >= tPrev) latest.set(r.familyId, r);
    } else {
      const oPrev = prev.__order ?? 0;
      const oCurr = r.__order ?? 0;
      if (oCurr >= oPrev) latest.set(r.familyId, r);
    }
  }

  // Quitar campo interno
  for (const v of latest.values()) delete (v as any).__order;

  return latest;
}

/* ------------------------------ Handler GET ------------------------------ */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawId = searchParams.get("familyId"); // opcional
    const withStatus = searchParams.get("withStatus");

    // 1) Invitados base
    const families = await loadGuests();

    // 2) RSVPs desde markdown
    const rsvpsFile = await getRsvpsFile();
    const rsvpsMd = rsvpsFile ? Buffer.from(rsvpsFile.content, "base64").toString("utf8") : "";
    const rsvpMap = rsvpsMd ? parseRsvpMarkdown(rsvpsMd) : new Map<string, RsvpRecord>();

    // (a) Detalle de una familia
    if (rawId) {
      const id = rawId.trim();

      const fam =
        families.find((f) => f.id === id) ??
        families.find((f) => f.id.toLowerCase() === id.toLowerCase()) ??
        null;

      const key = fam?.id ?? id;
      const rsvp = rsvpMap.get(key);

      const status: RsvpStatus = rsvp?.status ?? null;
      const attending = rsvp?.attending === true;
      const declined = rsvp?.declined === true;
      const responded = rsvp?.responded === true;

      // Compat: confirmed = true SOLO si es SÍ (evita marcar sí cuando fue "No")
      const confirmed = attending === true;

      return NextResponse.json({
        family: fam,
        // estado normalizado
        status,           // "si" | "no" | null
        attending,        // boolean
        declined,         // boolean
        responded,        // boolean
        confirmed,        // compat con front legado
        at: rsvp?.at ?? null,
        // extras útiles
        nombreFamilia: fam?.nombreFamilia ?? rsvp?.nombreFamilia ?? null,
        nroPersonas: fam?.nroPersonas ?? rsvp?.nroPersonas ?? null,
      });
    }

    // (b) Lista enriquecida
    if (withStatus === "1") {
      const enriched = families.map((f) => {
        const r = rsvpMap.get(f.id);
        const attending = r?.attending === true;
        const declined = r?.declined === true;
        const responded = r?.responded === true;
        const confirmed = attending === true; // compat
        return {
          ...f,
          status: r?.status ?? null,
          attending,
          declined,
          responded,
          confirmed,
          at: r?.at ?? null,
        };
      });
      return NextResponse.json({ families: enriched });
    }

    // default: solo invitados
    return NextResponse.json({ families });
  } catch (e) {
    console.error(e);
    const families = await loadGuests().catch(() => []);
    return NextResponse.json({ families });
  }
}
