"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { decodeShare } from "@/lib/share";
import { LABELS_JA, type KinkKey, type KinkScores } from "@/types/kink";

type Row = { key: string; label: string; value: number };

export default function SharePage() {
  const sp = useSearchParams();
  const d = sp.get("d") ?? "";

  const payload = useMemo(() => decodeShare(d), [d]);

  const rows: Row[] = useMemo(() => {
    if (!payload) return [];
    const scores = payload.latest.scores as KinkScores;

    return Object.entries(scores)
      .map(([k, v]) => {
        const key = k as KinkKey;
        return {
          key,
          label: (LABELS_JA as any)[key] ?? key,
          value: Number(v) || 0,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [payload]);

  if (!payload) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full space-y-3">
          <h1 className="text-xl font-bold">共有リンクが無効です</h1>
          <p className="text-white/70 text-sm">
            URLが途中で切れているか、コピーが欠けている可能性があります。
          </p>
        </div>
      </main>
    );
  }

  const p = payload.profile;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-center">共有された診断結果</h1>

          <div className="border border-white/10 rounded-xl p-4 bg-white/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">
                  {p?.name?.trim() ? p.name : "（名前未設定）"}
                </div>
                <div className="text-sm text-white/60">
                  {p?.handle ? `@${p.handle.replace(/^@/, "")}` : ""}
                </div>
              </div>

              <div className="text-xs text-white/50">
                {new Date(payload.latest.at).toLocaleString()}
              </div>
            </div>

            {p?.bio ? <p className="mt-3 text-sm text-white/80">{p.bio}</p> : null}

            <p className="mt-3 text-xs text-white/40">
              ※このページはURLに含まれるデータを表示しています（保存はしません）
            </p>
          </div>
        </header>

        <section className="space-y-4">
          {rows.map(({ key, label, value }) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{label}</span>
                <span>{value}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded">
                <div className="h-2 bg-red-600 rounded" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}