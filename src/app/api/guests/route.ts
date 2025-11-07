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

function parseRespondedSet(md: string) {
  const set = new Set<string>();
  for (const line of md.split("\n")) {
    if (!line.startsWith("|")) continue;
    if (line.includes("|---|")) continue;
    const cells = line.split("|").map((s) => s.trim());
    const familyId = (cells[1] || "").trim();
    if (!familyId || familyId === "family_id") continue;
    set.add(familyId);
  }
  return set;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawId = searchParams.get("familyId");   // opcional
    const withStatus = searchParams.get("withStatus");

    // 1) Invitados
    const families = await loadGuests();

    // 2) RSVPs
    const rsvps = await getRsvpsFile();
    const responded = rsvps
      ? parseRespondedSet(Buffer.from(rsvps.content, "base64").toString("utf8"))
      : new Set<string>();

    // 2.a) status de una familia
    if (rawId) {
      const id = rawId.trim();
      // busca por id EXACTO y además por case-insensitive (por si acaso)
      const fam =
        families.find((f) => f.id === id) ??
        families.find((f) => f.id.toLowerCase() === id.toLowerCase()) ??
        null;

      const confirmed = fam ? responded.has(fam.id) : false;

      // Debug mínimo (aparece en server console)
      if (!fam) {
        console.warn(`[GET /api/guests] familyId no encontrado`, {
          familyId: id,
          totalFamilies: families.length,
          sampleIds: families.slice(0, 5).map((f) => f.id),
        });
      }

      return NextResponse.json({ family: fam, confirmed });
    }

    // 2.b) lista enriquecida
    if (withStatus === "1") {
      const enriched = families.map((f) => ({
        ...f,
        confirmed: responded.has(f.id),
      }));
      return NextResponse.json({ families: enriched });
    }

    // default
    return NextResponse.json({ families });
  } catch (e) {
    console.error(e);
    const families = await loadGuests().catch(() => []);
    return NextResponse.json({ families });
  }
}
