"use client";

import { useEffect, useMemo, useState } from "react";
import { KINK_KEYS, LABELS_JA, type KinkKey } from "@/types/kink";

type LatestPayload = {
  scores: Record<string, number>;
  answers: number[];
  at: number;
  v?: number;
};

export default function ResultPage() {
  const [payload, setPayload] = useState<LatestPayload | null>(null);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [shareStatus, setShareStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => {
    const raw = localStorage.getItem("kinkmatch:latest");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);

      // 想定: { scores, answers, at }
      // 念のため、scoresだけ直で入ってるケースも吸収
      const normalized: LatestPayload =
        parsed?.scores && parsed?.answers
          ? parsed
          : {
              scores: parsed,
              answers: [],
              at: Date.now(),
            };

      setPayload(normalized);
    } catch {
      console.error("結果データの読み込みに失敗しました");
    }
  }, []);

  const rows = useMemo(() => {
    const scores = payload?.scores ?? {};
    return KINK_KEYS.map((k: KinkKey) => ({
      key: k,
      label: LABELS_JA[k] ?? k,
      value: Number(scores[k] ?? 0),
    })).sort((a, b) => b.value - a.value);
  }, [payload]);

  async function createShare() {
    if (!payload) return;

    try {
      setShareStatus("loading");
      setShareUrl("");

      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setShareStatus("error");
        alert("共有リンクの作成に失敗しました");
        return;
      }

      const data = (await res.json()) as { id?: string };
      if (!data?.id) {
        setShareStatus("error");
        alert("共有リンクの作成に失敗しました（IDなし）");
        return;
      }

      const url = `${location.origin}/s/${data.id}`;
      setShareUrl(url);
      setShareStatus("success");

      // クリップボード（失敗してもURL表示はする）
      try {
        await navigator.clipboard.writeText(url);
      } catch {}
    } catch (e) {
      console.error(e);
      setShareStatus("error");
      alert("共有リンクの作成に失敗しました（通信エラー）");
    }
  }

  if (!payload) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>結果が見つかりません。</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">診断結果</h1>

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

        {/* 共有 */}
        <div className="pt-6 space-y-3">
          <div className="text-center">
            <button
              onClick={createShare}
              disabled={shareStatus === "loading"}
              className="inline-block bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 px-6 py-2 rounded text-white"
            >
              {shareStatus === "loading"
                ? "共有リンク作成中..."
                : "共有リンクを作る"}
            </button>
          </div>

          {shareUrl && (
            <div className="text-xs text-white/70 break-all text-center space-y-1">
              <div>共有URL：</div>
              <a
                className="underline"
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
              >
                {shareUrl}
              </a>
              <div className="text-white/50">
                ※コピーできない場合はURLを手動でコピーしてね
              </div>
            </div>
          )}
        </div>

        {/* もう一度 */}
        <div className="pt-6 text-center">
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