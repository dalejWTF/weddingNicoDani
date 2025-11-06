// app/api/guests/route.ts
import { NextResponse } from "next/server";
import { loadGuests } from "@/lib/loadGuests";

export const runtime = "nodejs";

const OWNER  = process.env.GITHUB_OWNER!;
const REPO   = process.env.GITHUB_REPO!;
const BRANCH = process.env.GITHUB_BRANCH || "main";
const PATH   = process.env.GITHUB_DATA_PATH || "data/rsvps.md"; // RSVPs en markdown
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

// Parser para el markdown de RSVPs (mismo formato que ya usas)
// | family_id | creation_date | nombre_familia | nro_personas | asistencia |
function parseRespondedSet(md: string) {
  const set = new Set<string>();
  for (const line of md.split("\n")) {
    if (!line.startsWith("|")) continue;
    if (line.includes("|---|")) continue;
    const cells = line.split("|").map((s) => s.trim());
    const familyId = cells[1];
    if (!familyId || familyId === "family_id") continue;
    set.add(familyId);
  }
  return set;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const familyId = searchParams.get("familyId");       // opcional: estado de una familia
    const withStatus = searchParams.get("withStatus");   // "1" para incluir confirmed por cada familia

    // 1) Cargar invitados
    const families = await loadGuests();

    // 2) Cargar/parsear RSVPs
    const rsvps = await getRsvpsFile();
    const responded = rsvps
      ? parseRespondedSet(Buffer.from(rsvps.content, "base64").toString("utf8"))
      : new Set<string>();

    // 2.a) Si preguntan por una familia específica, respondemos su estado
    if (familyId) {
      const fam = families.find((f) => f.id === familyId) || null;
      const confirmed = fam ? responded.has(fam.id) : false;
      return NextResponse.json({ family: fam, confirmed });
    }

    // 2.b) Si piden withStatus=1 devolvemos confirmed por cada familia
    if (withStatus === "1") {
      const enriched = families.map((f) => ({
        ...f,
        confirmed: responded.has(f.id),
      }));
      return NextResponse.json({ families: enriched });
    }

    // Default: lista simple (como antes)
    return NextResponse.json({ families });
  } catch (e) {
    console.error(e);
    // fallback: si algo falla, devolvemos lista simple sin estado
    const families = await loadGuests().catch(() => []);
    return NextResponse.json({ families });
  }
}
