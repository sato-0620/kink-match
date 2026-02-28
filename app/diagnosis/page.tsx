"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { QUESTIONS } from "@/lib/questions";
import { computeScores } from "@/lib/scoring";

const CHOICES = [
  { v: 0, label: "全く当てはまらない" },
  { v: 1, label: "あまり当てはまらない" },
  { v: 2, label: "どちらともいえない" },
  { v: 3, label: "やや当てはまる" },
  { v: 4, label: "強く当てはまる" },
];

export default function DiagnosisPage() {
  const total = QUESTIONS.length;
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() => Array(total).fill(-1));

  const q = QUESTIONS[idx];
  const current = answers[idx];

  const progress = useMemo(() => {
    const done = answers.filter((a) => a >= 0).length;
    return { done, pct: Math.round((done / total) * 100) };
  }, [answers, total]);

  const canPrev = idx > 0;
  const canNext = idx < total - 1 && current >= 0;
  const canFinish = idx === total - 1 && current >= 0 && answers.every((a) => a >= 0);

  function setAnswer(v: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = v;
      return next;
    });
  }

  function goNext() {
    if (!canNext) return;
    setIdx((n) => Math.min(total - 1, n + 1));
  }

  function goPrev() {
    if (!canPrev) return;
    setIdx((n) => Math.max(0, n - 1));
  }

  function finish() {
    const normalized = answers.map((a) => (a < 0 ? 0 : a));
    const scores = computeScores(normalized);

    localStorage.setItem(
      "kinkmatch:latest",
      JSON.stringify({ scores, answers: normalized, at: Date.now() })
    );

    window.location.href = "/result";
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">診断</h1>
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">
            中断して戻る
          </Link>
        </div>

        <p className="mt-2 text-zinc-400">{total}問。直感でOK。</p>

        <div className="mt-6 rounded-lg border border-zinc-800 p-4">
          <div className="flex items-center justify-between text-sm text-zinc-400">
            <span>Q{q.id} / {total}</span>
            <span>{progress.done}/{total}（{progress.pct}%）</span>
          </div>

          <div className="mt-3 h-2 w-full rounded bg-zinc-900">
            <div className="h-2 rounded bg-red-600" style={{ width: `${progress.pct}%` }} />
          </div>

          <div className="mt-6">
            <div className="text-lg font-semibold leading-relaxed">{q.text}</div>

            <div className="mt-5 grid gap-2">
              {CHOICES.map((c) => (
                <label
                  key={c.v}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition
                    ${current === c.v ? "border-red-600 bg-zinc-950" : "border-zinc-800 hover:bg-zinc-950"}
                  `}
                >
                  <span className="text-zinc-200">{c.label}</span>
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    className="accent-red-600"
                    checked={current === c.v}
                    onChange={() => setAnswer(c.v)}
                  />
                </label>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={goPrev}
                disabled={!canPrev}
                className="rounded-lg border border-zinc-800 px-4 py-2 text-zinc-200 disabled:opacity-40 hover:bg-zinc-950"
              >
                戻る
              </button>

              {idx < total - 1 ? (
                <button
                  onClick={goNext}
                  disabled={!canNext}
                  className="rounded-lg bg-red-600 px-5 py-2 font-semibold disabled:opacity-40 hover:bg-red-700"
                >
                  次へ
                </button>
              ) : (
                <button
                  onClick={finish}
                  disabled={!canFinish}
                  className="rounded-lg bg-red-600 px-5 py-2 font-semibold disabled:opacity-40 hover:bg-red-700"
                >
                  結果を見る
                </button>
              )}
            </div>

            <p className="mt-4 text-xs text-zinc-500">
              ※18歳未満利用不可 / 露骨な投稿・連絡先交換は禁止 / DM機能なし
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}