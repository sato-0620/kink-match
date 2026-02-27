"use client";

import { useEffect, useMemo, useState } from "react";
import {
  KINK_KEYS,
  KINK_LABELS_JA,
  type KinkKey,
  type KinkScores,
} from "@/types/kink";

type LatestPayload = {
  scores: KinkScores;
  answers?: number[];
  at?: number;
};

export default function ResultPage() {
  const [scores, setScores] = useState<KinkScores | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("kinkmatch:latest");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<LatestPayload>;

      // ✅ Diagnosis側が { scores, answers, at } 形式で保存してる前提
      if (parsed && parsed.scores) {
        setScores(parsed.scores);
        return;
      }

      // ✅ もし旧形式で scores だけ保存してた場合の救済
      // （オブジェクトの中身が全部数字なら scores とみなす）
      if (parsed && typeof parsed === "object") {
        const maybeScores = parsed as Record<string, unknown>;
        const allNumbers =
          Object.values(maybeScores).length > 0 &&
          Object.values(maybeScores).every((v) => typeof v === "number");

        if (allNumbers) {
          setScores(maybeScores as unknown as KinkScores);
          return;
        }
      }

      console.error("保存データ形式が想定と違います", parsed);
    } catch (e) {
      console.error("スコアの読み込みに失敗しました", e);
    }
  }, []);

  const rows = useMemo(() => {
    if (!scores) return [];

    // ✅ 安全に KINK_KEYS のみ出す（consent など紛れたら無視される）
    return KINK_KEYS.map((k) => ({
      key: k as KinkKey,
      label: KINK_LABELS_JA[k],
      value: Number(scores[k] ?? 0),
    })).sort((a, b) => b.value - a.value);
  }, [scores]);

  if (!scores) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-3">
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