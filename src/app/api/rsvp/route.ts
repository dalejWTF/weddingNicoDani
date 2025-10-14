// app/api/rsvp/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  familyId: string;
  nombreFamilia: string;
  nroPersonas: number;
  asistencia: boolean;
};

const OWNER  = process.env.GITHUB_OWNER!;
const REPO   = process.env.GITHUB_REPO!;
const BRANCH = process.env.GITHUB_BRANCH || "main";
const PATH   = process.env.GITHUB_DATA_PATH || "data/rsvps.md";
const TOKEN  = process.env.GITHUB_TOKEN!;
const GH = "https://api.github.com";

async function getFile() {
  const res = await fetch(`${GH}/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(PATH)}?ref=${BRANCH}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/vnd.github+json" },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ content: string; sha: string }>;
}

async function putFile(content: string, sha?: string) {
  const body = {
    message: `RSVP ${new Date().toISOString()}`,
    content: Buffer.from(content, "utf8").toString("base64"),
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  };
  const res = await fetch(`${GH}/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(PATH)}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function parseRespondedSet(md: string) {
  const set = new Set<string>();
  for (const line of md.split("\n")) {
    if (!line.startsWith("|")) continue;        // solo filas de tabla
    if (line.includes("|---|")) continue;       // separador
    const cells = line.split("|").map(s => s.trim());
    // tabla: ['', timestamp, family_id, nombre_familia, nro_personas, asistencia, '']
    const familyId = cells[2];
    if (!familyId || familyId === "family_id") continue; // salta encabezado
    set.add(familyId);
  }
  return set;
}

export async function POST(req: Request) {
  try {
    const { familyId, nombreFamilia, nroPersonas, asistencia } = (await req.json()) as Body;
    if (!familyId || !nombreFamilia || typeof nroPersonas !== "number" || typeof asistencia !== "boolean") {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const existing = await getFile();
    const header = `| family_id | creation_date | nombre_familia | nro_personas | asistencia |\n|---|---|---|---|---|\n`;
    const ts = new Date().toISOString().split(".")[0].replace("T", " ");
    const newRow = `| ${familyId} | ${ts} | ${nombreFamilia} | ${nroPersonas} | ${asistencia ? "Sí" : "No"} |\n`;

    if (!existing) {
      // crea archivo
      await putFile(header + newRow);
      return NextResponse.json({ ok: true });
    }

    const decoded = Buffer.from(existing.content, "base64").toString("utf8");
    const responded = parseRespondedSet(decoded);

    if (responded.has(familyId)) {
      return NextResponse.json({ error: "Esta familia ya registró su respuesta." }, { status: 409 });
    }

    const next = decoded.endsWith("\n") ? decoded + newRow : decoded + "\n" + newRow;
    await putFile(next, (existing as any).sha);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "No se pudo guardar en GitHub" }, { status: 500 });
  }
}
