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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const key = `share:${id}`;

    const data = await kv.get<Payload>(key);
    if (!data) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}