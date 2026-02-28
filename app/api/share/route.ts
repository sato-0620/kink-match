// app/api/share/route.ts
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = {
  scores: Record<string, number>;
  answers: number[];
  at: number;
  v?: number;
};

function makeId() {
  // 12桁くらいのランダムID
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(2, 6);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "invalid body" }, { status: 400 });
    }
    if (!body.scores || typeof body.scores !== "object") {
      return NextResponse.json({ error: "missing scores" }, { status: 400 });
    }

    const id = makeId();
    const key = `share:${id}`;

    // 期限：7日（必要なら変更）
    await kv.set(key, body, { ex: 60 * 60 * 24 * 7 });

    return NextResponse.json({ id });
  } catch (e) {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}