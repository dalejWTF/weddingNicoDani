// lib/loadGuests.ts
import { getGhFile, decodeBase64ToUtf8 } from "./githubFiles";

export type Family = { id: string; nombreFamilia: string; nroPersonas: number };

// fallback local opcional:
import { FAMILIAS as LOCAL_FAMILIAS } from "@/data/familias";

// Usa una env separada para no chocar con el path de RSVPs
const GUESTS_PATH = process.env.GITHUB_GUESTS_PATH || "data/guests.json";

/**
 * Intenta cargar familias desde GitHub. Si falla o no existe, retorna el fallback local.
 * Soporta JSON nativo. Para .ts, hay un parser simple (no evalúa código).
 */
export async function loadGuests(): Promise<Family[]> {
  try {
    const gh = await getGhFile(GUESTS_PATH);
    if (!gh) return LOCAL_FAMILIAS;

    const raw = decodeBase64ToUtf8(gh.content);

    if (GUESTS_PATH.endsWith(".json")) {
      const json = JSON.parse(raw);
      // Se permiten tanto { families: [...]} como [...]
      const arr: unknown = Array.isArray(json) ? json : json.families;
      if (!Array.isArray(arr)) throw new Error("JSON inválido: no es array");
      return normalizeFamilies(arr);
    }

    if (GUESTS_PATH.endsWith(".ts")) {
      // Parser SIMPLE para tomar el array que exportas como FAMILIAS
      // Busca: export const FAMILIAS ... = [ ... ];
      const match = raw.match(/export\s+const\s+FAMILIAS[\s\S]*?=\s*(\[[\s\S]*?\]);?/);
      if (!match) throw new Error("No se pudo localizar el array FAMILIAS en el .ts");
      const arrayLiteral = match[1];

      // Convertimos a JSON “lo mejor posible”: quitamos comentarios y trailing commas
      const cleaned = arrayLiteral
        .replace(/\/\/.*$/gm, "")               // // comentarios
        .replace(/\/\*[\s\S]*?\*\//g, "")       // /* */ comentarios
        .replace(/,\s*([\]}])/g, "$1");         // trailing commas

      // Opción simple: usar JSON.parse si cumple JSON estricto
      const parsed = JSON.parse(cleaned);
      return normalizeFamilies(parsed);
    }

    // Otros formatos no soportados aquí
    return LOCAL_FAMILIAS;
  } catch (e) {
    console.error("[loadGuests] fallback a LOCAL_FAMILIAS:", e);
    return LOCAL_FAMILIAS;
  }
}

function normalizeFamilies(arr: any[]): Family[] {
  return arr.map((x) => ({
    id: String(x.id),
    nombreFamilia: String(x.nombreFamilia),
    nroPersonas: Number(x.nroPersonas),
  }));
}
