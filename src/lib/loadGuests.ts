// lib/loadGuests.ts
import { getGhFile, decodeBase64ToUtf8 } from "./githubFiles";

export type Family = { id: string; nombreFamilia: string; nroPersonas: number };

// Fallback local
import { FAMILIAS as LOCAL_FAMILIAS } from "@/data/familias";

const GUESTS_PATH = process.env.GITHUB_GUESTS_PATH || "data/guests.json";

/* Helpers de tipado */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function toStringSafe(v: unknown): string {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
}
function toNumberSafe(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.trim());
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

export async function loadGuests(): Promise<Family[]> {
  try {
    const gh = await getGhFile(GUESTS_PATH);
    if (!gh) return LOCAL_FAMILIAS;

    // Decodifica y limpia BOM
    let raw = decodeBase64ToUtf8(gh.content);
    if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);

    // --- JSON ---
    if (GUESTS_PATH.endsWith(".json")) {
      // Soporta JSON con comentarios y comas colgantes (las retiramos)
      const cleaned = raw
        .replace(/\/\/.*$/gm, "") // // comentario
        .replace(/\/\*[\s\S]*?\*\//g, "") // /* comentario */
        .replace(/,\s*([\]}])/g, "$1"); // trailing comma

      const json: unknown = JSON.parse(cleaned);

      // Acepta múltiples formas:
      // { families: [...] } | { FAMILIAS: [...] } | { familias: [...] } | [...]
      let arrCandidate: unknown = [];

      if (Array.isArray(json)) {
        arrCandidate = json;
      } else if (isRecord(json)) {
        const pick =
          (json as Record<string, unknown>).families ??
          (json as Record<string, unknown>).FAMILIAS ??
          (json as Record<string, unknown>).familias;

        if (Array.isArray(pick)) {
          arrCandidate = pick;
        } else {
          // Como último recurso: toma el PRIMER array que aparezca en el objeto
          const firstArray = Object.values(json).find(Array.isArray);
          arrCandidate = Array.isArray(firstArray) ? firstArray : [];
        }
      }

      const finalArr: unknown[] = Array.isArray(arrCandidate) ? arrCandidate : [];
      return normalizeFamilies(finalArr);
    }

    // --- TS ---
    if (GUESTS_PATH.endsWith(".ts")) {
      // Busca el literal del array exportado como FAMILIAS
      const match = raw.match(/export\s+const\s+FAMILIAS[\s\S]*?=\s*(\[[\s\S]*?\]);?/);
      if (!match) throw new Error("No se pudo localizar el array FAMILIAS en el .ts");
      const arrayLiteral = match[1];

      const cleaned = arrayLiteral
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/,\s*([\]}])/g, "$1");

      const parsed: unknown = JSON.parse(cleaned);
      const arr: unknown[] = Array.isArray(parsed) ? parsed : [];
      return normalizeFamilies(arr);
    }

    return LOCAL_FAMILIAS;
  } catch (e) {
    console.error("[loadGuests] fallback a LOCAL_FAMILIAS:", e);
    return LOCAL_FAMILIAS;
  }
}

function normalizeFamilies(arr: unknown[]): Family[] {
  return arr
    .map((x): Family | null => {
      if (!isRecord(x)) return null;

      const id = toStringSafe(x.id).trim();
      const nombreFamilia = (toStringSafe(x.nombreFamilia) || toStringSafe(x.nombre)).trim();
      const nroRaw = isRecord(x)
        ? (x.nroPersonas ?? x.personas ?? x.nro)
        : undefined;
      const nroPersonas = toNumberSafe(nroRaw);

      const fam: Family = { id, nombreFamilia, nroPersonas };

      if (!fam.id || !fam.nombreFamilia || !Number.isFinite(fam.nroPersonas)) return null;
      return fam;
    })
    .filter((f): f is Family => f !== null);
}
