"use client";

import { useEffect, useMemo, useState } from "react";
import { KINK_KEYS, LABELS_JA, type KinkScores } from "@/types/kink";

type StoredPayload = {
  scores: KinkScores;
  answers: number[];
  at: number;
};

export default function ProfilePage() {
  const [scores, setScores] = useState<KinkScores | null>(null);
  const [nickname, setNickname] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [region, setRegion] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("kinkmatch:latest");
    if (!raw) return;

    const parsed: StoredPayload = JSON.parse(raw);
    setScores(parsed.scores);
  }, []);

  const top3 = useMemo(() => {
    if (!scores) return [];
    return KINK_KEYS
      .map((k) => ({
        key: k,
        label: LABELS_JA[k],
        value: scores[k] ?? 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
  }, [scores]);

  function saveProfile() {
    const profile = {
      nickname,
      ageRange,
      region,
      top3,
    };

    localStorage.setItem("kinkmatch:profile", JSON.stringify(profile));
    alert("保存しました");
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-center">
          プロフィール作成
        </h1>

        {/* 診断上位3つ */}
        <div className="bg-zinc-900 p-4 rounded space-y-2">
          <h2 className="font-semibold">あなたの傾向（上位3）</h2>
          {top3.map((t) => (
            <div key={t.key} className="flex justify-between text-sm">
              <span>{t.label}</span>
              <span>{t.value}%</span>
            </div>
          ))}
        </div>

        {/* ニックネーム */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">ニックネーム</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          />
        </div>

        {/* 年齢帯 */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">年齢帯</label>
          <select
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          >
            <option value="">選択してください</option>
            <option value="18-24">18-24</option>
            <option value="25-34">25-34</option>
            <option value="35-44">35-44</option>
            <option value="45+">45+</option>
          </select>
        </div>

        {/* 地域 */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">地域</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          >
            <option value="">選択してください</option>
            <option value="北海道">北海道</option>
            <option value="関東">関東</option>
            <option value="関西">関西</option>
            <option value="九州">九州</option>
          </select>
        </div>

        <button
          onClick={saveProfile}
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded font-semibold"
        >
          保存する
        </button>
      </div>
    </main>
  );
}