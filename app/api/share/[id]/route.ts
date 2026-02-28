// app/api/share/[id]/route.ts
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = {
  scores: Record<string, number>;
  answers: number[];
  at: number;
  v?: number;
};

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const key = `share:${params.id}`;
  const data = (await kv.get<Payload>(key)) ?? null;

  if (!data) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(data);
}