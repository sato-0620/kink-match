"use client";

import { useEffect, useMemo, useState } from "react";
import type { KinkScores, KinkKey } from "@/types/kink";
import { LABELS_JA, KINK_KEYS } from "@/types/kink";

type LatestPayload = {
  scores: Partial<Record<KinkKey, number>>;
  answers?: number[];
  at?: number;
};

export default function ResultPage() {
  const [scores, setScores] = useState<KinkScores | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("kinkmatch:latest");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as LatestPayload;

      // scores が入ってない/壊れてる時の保険
      const s = parsed?.scores ?? {};

      // KINK_KEYS を基準に必ず全キーを埋める（undefined→0）
      const normalized = Object.fromEntries(
        KINK_KEYS.map((k) => [k, Number(s[k] ?? 0)])
      ) as KinkScores;

      setScores(normalized);
    } catch (e) {
      console.error("スコアの読み込みに失敗しました", e);
    }
  }, []);

  const rows = useMemo(() => {
    if (!scores) return [];
    return Object.entries(scores)
      .map(([key, value]) => ({
        key: key as KinkKey,
        label: LABELS_JA[key as KinkKey] ?? key,
        value: Number(value),
      }))
      .sort((a, b) => b.value - a.value); // 大きい順
  }, [scores]);

  if (!scores) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p>結果が見つかりません。</p>
          <a
            href="/diagnosis"
            className="inline-block bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white"
          >
            診断へ戻る
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-8">診断結果</h1>

        {rows.map(({ key, label, value }) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{label}</span>
              <span>{value}%</span>
            </div>

            <div className="w-full h-2 bg-gray-800 rounded">
              <div
                className="h-2 bg-red-600 rounded"
                style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
              />
            </div>
          </div>
        ))}

        <div className="pt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/profile"
            className="inline-block bg-white/10 hover:bg-white/20 px-6 py-2 rounded text-white text-center"
          >
            プロフィール作成へ
          </a>

          <a
            href="/me"
            className="inline-block bg-white/10 hover:bg-white/20 px-6 py-2 rounded text-white text-center"
          >
            マイページを見る
          </a>

          <a
            href="/diagnosis"
            className="inline-block bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white text-center"
          >
            もう一度
          </a>
        </div>
      </div>
    </main>
  );
}