"use client";

import { useEffect, useState } from "react";
import type { KinkScores } from "@/types/kink";

const LABELS_JA: Record<string, string> = {
  dominant: "優性",
  submissive: "サブミッシブ",
  sadist: "サディスト",
  masochist: "マゾヒスト",
  rigger: "リガー",
  ropeBunny: "ロープバニー",
  degrader: "劣化装置",
  degradee: "デグレード",
  owner: "オーナー",
  pet: "ペット",
  ageplayer: "年齢プレイヤー",
  switch: "スイッチ",
};

export default function ResultPage() {
  const [scores, setScores] = useState<KinkScores | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("kinkmatch:latest");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      setScores(parsed);
    } catch {
      console.error("スコアの読み込みに失敗しました");
    }
  }, []);

  if (!scores) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>結果が見つかりません。</p>
      </main>
    );
  }

  // 🔥 大きい順にソート
  const rows = Object.entries(scores)
    .map(([key, value]) => ({
      key,
      label: LABELS_JA[key] ?? key,
      value: Number(value),
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-8">
          診断結果
        </h1>

        {rows.map(({ key, label, value }) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{label}</span>
              <span>{value}%</span>
            </div>

            <div className="w-full h-2 bg-gray-800 rounded">
              <div
                className="h-2 bg-red-600 rounded"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}

        <div className="pt-8 text-center">
          <a
            href="/diagnosis"
            className="inline-block bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white"
          >
            もう一度
          </a>
        </div>
      </div>
    </main>
  );
}