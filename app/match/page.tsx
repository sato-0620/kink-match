"use client";

// app/match/page.tsx
import { useEffect, useMemo, useState } from "react";
import { calcMatch } from "@/lib/match";
import { LABELS_JA, KINK_KEYS, type KinkKey, type KinkScores } from "@/types/kink";

type LatestPayload = {
  scores: Record<string, number>;
  answers: number[];
  at: number;
};

type SharePayload = {
  scores: Record<string, number>;
  answers: number[];
  at: number;
  v?: number;
};

function pickScores(raw: Record<string, number> | undefined | null): KinkScores {
  const obj: any = {};
  for (const k of KINK_KEYS) obj[k] = Number(raw?.[k] ?? 0);
  return obj as KinkScores;
}

function extractShareId(input: string): string | null {
  const s = input.trim();
  if (!s) return null;

  // すでにIDだけ
  if (!s.includes("/") && !s.includes("http")) return s;

  try {
    const url = new URL(s);
    // /s/{id}
    const m = url.pathname.match(/\/s\/([^/]+)/);
    if (m?.[1]) return m[1];
    return null;
  } catch {
    // URLじゃないけど /s/xxx だけ貼った場合
    const m = s.match(/\/s\/([^/]+)/);
    return m?.[1] ?? null;
  }
}

export default function MatchPage() {
  const [self, setSelf] = useState<KinkScores | null>(null);
  const [partner, setPartner] = useState<KinkScores | null>(null);
  const [partnerAt, setPartnerAt] = useState<number | null>(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("kinkmatch:latest");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as LatestPayload;
      setSelf(pickScores(parsed?.scores));
    } catch {
      // ignore
    }
  }, []);

  const match = useMemo(() => {
    if (!self || !partner) return null;
    return calcMatch(self, partner);
  }, [self, partner]);

  async function loadPartner() {
    setErr(null);
    const id = extractShareId(input);
    if (!id) {
      setErr("共有リンク（/s/xxxx）かIDを入れてね");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/share/${encodeURIComponent(id)}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        setErr("共有リンクが無効、または期限切れっぽい");
        setPartner(null);
        setPartnerAt(null);
        return;
      }

      const data = (await res.json()) as SharePayload;
      setPartner(pickScores(data?.scores));
      setPartnerAt(Number(data?.at ?? 0) || null);
    } catch {
      setErr("取得に失敗（ネットワーク/サーバー）");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">相性チェック</h1>

        <div className="space-y-2 rounded border border-white/10 p-4 bg-white/5">
          <p className="text-sm text-white/80">
            相手の共有リンク（<span className="text-white">/s/xxxx</span>）かIDを貼ってね
          </p>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="例: https://kink-match.vercel.app/s/abcd1234"
              className="flex-1 rounded bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={loadPartner}
              disabled={loading}
              className="rounded bg-red-600 hover:bg-red-700 disabled:opacity-60 px-4 py-2 text-sm"
            >
              {loading ? "取得中..." : "読み込み"}
            </button>
          </div>

          {err && <p className="text-sm text-red-400">{err}</p>}

          <div className="text-xs text-white/60">
            自分の結果:{" "}
            {self ? <span className="text-white">OK</span> : <span>未検出（先に診断してね）</span>}
            {partnerAt && (
              <span className="ml-3">
                相手の共有日時: {new Date(partnerAt).toLocaleString("ja-JP")}
              </span>
            )}
          </div>
        </div>

        {!match && (
          <div className="text-center text-white/60 text-sm">
            自分の診断結果 + 相手の共有データが揃うと表示されるよ
          </div>
        )}

        {match && (
          <div className="space-y-6">
            <div className="rounded border border-white/10 p-4 bg-white/5">
              <div className="flex items-end justify-between">
                <h2 className="text-lg font-bold">総合相性</h2>
                <div className="text-2xl font-bold text-red-400">
                  {Math.round(match.total)}%
                </div>
              </div>

              <div className="w-full h-2 bg-gray-800 rounded mt-3">
                <div
                  className="h-2 bg-red-600 rounded"
                  style={{ width: `${Math.round(match.total)}%` }}
                />
              </div>

              <p className="text-xs text-white/60 mt-2">
                ※主に「噛み合い（補完関係）」を重視したスコア
              </p>
            </div>

            <div className="rounded border border-white/10 p-4 bg-white/5 space-y-4">
              <h2 className="text-lg font-bold">内訳（強い順）</h2>

              {match.breakdown.map((b) => (
                <div key={b.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{b.title}</span>
                    <span>{Math.round(b.score)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded">
                    <div
                      className="h-2 bg-red-600 rounded"
                      style={{ width: `${Math.round(b.score)}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/60">{b.detail}</p>
                </div>
              ))}
            </div>

            <div className="rounded border border-white/10 p-4 bg-white/5 space-y-3">
              <h2 className="text-lg font-bold">参考：あなたの傾向（高い順）</h2>
              {self &&
                Object.entries(self)
                  .map(([key, value]) => ({
                    key,
                    label: LABELS_JA[key as KinkKey] ?? key,
                    value: Number(value),
                  }))
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 5)
                  .map((r) => (
                    <div key={r.key} className="flex justify-between text-sm">
                      <span>{r.label}</span>
                      <span>{r.value}%</span>
                    </div>
                  ))}
            </div>

            <div className="pt-2 text-center flex gap-3 justify-center">
              <a
                href="/result"
                className="inline-block bg-white/10 hover:bg-white/15 px-5 py-2 rounded text-white text-sm"
              >
                結果に戻る
              </a>
              <a
                href="/diagnosis"
                className="inline-block bg-red-600 hover:bg-red-700 px-5 py-2 rounded text-white text-sm"
              >
                もう一度診断
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}