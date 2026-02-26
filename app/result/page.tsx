"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Stored = { scores: any; at: number };

export default function ResultPage() {
  const [data, setData] = useState<Stored | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("kinkmatch:latest");
    if (!raw) return;
    try {
      setData(JSON.parse(raw));
    } catch {
      setData(null);
    }
  }, []);

  const items = useMemo(() => {
    if (!data) return [];
    const s = data.scores;
    return [
      ["Dominant", s.dominant],
      ["Submissive", s.submissive],
      ["Sadist", s.sadist],
      ["Masochist", s.masochist],
      ["Rigger", s.rigger],
      ["Rope bunny", s.ropeBunny],
      ["Degrader", s.degrader],
      ["Degradee", s.degradee],
      ["Owner", s.owner],
      ["Pet", s.pet],
      ["Ageplayer", s.ageplayer],
      ["Switch", s.switchScore],
      ["Consent", s.consent],
    ] as Array<[string, number]>;
  }, [data]);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">結果</h1>
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">
            トップへ
          </Link>
        </div>

        {!data ? (
          <div className="mt-8 rounded-lg border border-zinc-800 p-6 text-zinc-300">
            まだ結果がありません。先に診断してください。
            <div className="mt-4">
              <Link
                href="/diagnosis"
                className="inline-block rounded-lg bg-red-600 px-5 py-2 font-semibold hover:bg-red-700"
              >
                診断へ
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-zinc-800 p-6">
            <div className="space-y-3">
              {items.map(([k, v]) => (
                <div key={k}>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-300">{k}</span>
                    <span className="text-zinc-400">{Math.round(v)}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded bg-zinc-900">
                    <div
                      className="h-2 rounded bg-red-600"
                      style={{ width: `${Math.max(0, Math.min(100, v))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href="/diagnosis"
                className="inline-block rounded-lg bg-red-600 px-5 py-2 font-semibold hover:bg-red-700"
              >
                もう一度
              </Link>
            </div>

            <p className="mt-4 text-xs text-zinc-500">
              ※MVP：結果はブラウザ(localStorage)保存。次でログイン/サーバ保存にする。
            </p>
          </div>
        )}
      </div>
    </main>
  );
}