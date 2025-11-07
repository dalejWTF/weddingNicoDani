// lib/loadGuests.ts
import { getGhFile, decodeBase64ToUtf8 } from "./githubFiles";

export type Family = { id: string; nombreFamilia: string; nroPersonas: number };

// Fallback local
import { FAMILIAS as LOCAL_FAMILIAS } from "@/data/familias";

const GUESTS_PATH = process.env.GITHUB_GUESTS_PATH || "data/guests.json";

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
        .replace(/\/\/.*$/gm, "")            // // comentario
        .replace(/\/\*[\s\S]*?\*\//g, "")    // /* comentario */
        .replace(/,\s*([\]}])/g, "$1");      // trailing comma

      const json = JSON.parse(cleaned);

      // Acepta múltiples formas:
      // { families: [...] } | { FAMILIAS: [...] } | { familias: [...] } | [...]
      let arr: unknown =
        Array.isArray(json)
          ? json
          : json.families ?? json.FAMILIAS ?? json.familias;

      if (!Array.isArray(arr)) {
        // Como último recurso: toma el PRIMER array que aparezca en el objeto
        const firstArray = Object.values(json).find((v) => Array.isArray(v));
        arr = firstArray ?? [];
      }

      return normalizeFamilies(arr as any[]);
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

      const parsed = JSON.parse(cleaned);
      return normalizeFamilies(parsed);
    }

    return LOCAL_FAMILIAS;
  } catch (e) {
    console.error("[loadGuests] fallback a LOCAL_FAMILIAS:", e);
    return LOCAL_FAMILIAS;
  }
}

function normalizeFamilies(arr: any[]): Family[] {
  return arr.map((x) => ({
    id: String(x.id ?? "").trim(),
    nombreFamilia: String(x.nombreFamilia ?? x.nombre ?? "").trim(),
    nroPersonas: Number(x.nroPersonas ?? x.personas ?? x.nro ?? 0),
  })).filter((f) => f.id && f.nombreFamilia && Number.isFinite(f.nroPersonas));
}
