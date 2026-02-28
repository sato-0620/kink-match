"use client";

import { useEffect, useMemo, useState } from "react";
import { KINK_KEYS, LABELS_JA, type KinkKey, type KinkScores } from "@/types/kink";

type StoredLatest =
  | { scores: KinkScores; answers?: number[]; at?: number }
  | KinkScores;

function isKinkScores(v: unknown): v is KinkScores {
  if (!v || typeof v !== "object") return false;
  // 全キーが number を持ってるか（最低限）
  return KINK_KEYS.every((k) => typeof (v as any)[k] === "number");
}

export default function ResultPage() {
  const [scores, setScores] = useState<KinkScores | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("kinkmatch:latest");
    if (!raw) {
      setError("結果が見つかりません（診断を先に実行してください）。");
      return;
    }

    try {
      const parsed: StoredLatest = JSON.parse(raw);

      // ① {scores, answers, at} 形式
      if (parsed && typeof parsed === "object" && "scores" in parsed) {
        const maybeScores = (parsed as any).scores;
        if (isKinkScores(maybeScores)) {
          setScores(maybeScores);
          return;
        }
      }

      // ② 直接 KinkScores を保存してた古い形式にも対応
      if (isKinkScores(parsed)) {
        setScores(parsed);
        return;
      }

      setError("保存された結果データの形式が不正です。");
    } catch (e) {
      console.error(e);
      setError("スコアの読み込みに失敗しました。");
    }
  }, []);

  // 🔥 大きい順に並び替え（同点は日本語ラベル順で安定化）
  const rows = useMemo(() => {
    if (!scores) return [];
    return KINK_KEYS
      .map((k) => ({
        key: k,
        label: LABELS_JA[k] ?? k,
        value: Math.round(scores[k]),
      }))
      .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "ja"));
  }, [scores]);

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-4">
          <p className="text-zinc-200">{error}</p>
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

  if (!scores) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">読み込み中…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-8">診断結果</h1>

        {rows.map(({ key, label, value }) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between text-sm text-zinc-200">
              <span>{label}</span>
              <span>{value}%</span>
            </div>

            <div className="w-full h-2 bg-zinc-800 rounded">
              <div
                className="h-2 bg-red-600 rounded"
                style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
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