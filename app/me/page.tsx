"use client";

import { useEffect, useMemo, useState } from "react";
import { LABELS_JA, type KinkKey } from "@/types/kink";

type SavedProfile = {
  nickname: string;
  ageRange: string;
  region: string;
  top3: { key: KinkKey; label: string; value: number }[];
};

export default function MePage() {
  const [profile, setProfile] = useState<SavedProfile | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("kinkmatch:profile");
    if (!raw) return;
    try {
      setProfile(JSON.parse(raw));
    } catch {}
  }, []);

  const top3 = useMemo(() => profile?.top3 ?? [], [profile]);

  if (!profile) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <p className="text-zinc-300">プロフィールがまだありません</p>
          <a className="inline-block bg-red-600 hover:bg-red-700 px-6 py-2 rounded" href="/profile">
            プロフィール作成へ
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">マイプロフィール</h1>

        <div className="rounded bg-zinc-900 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">ニックネーム</span>
            <span>{profile.nickname || "未設定"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">年齢帯</span>
            <span>{profile.ageRange || "未設定"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">地域</span>
            <span>{profile.region || "未設定"}</span>
          </div>
        </div>

        <div className="rounded bg-zinc-900 p-4 space-y-2">
          <h2 className="font-semibold">傾向（上位3）</h2>
          {top3.map((t) => (
            <div key={t.key} className="flex justify-between text-sm">
              <span>{LABELS_JA[t.key] ?? t.label}</span>
              <span>{Math.round(t.value)}%</span>
            </div>
          ))}
        </div>

        <div className="grid gap-3">
          <a className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-center" href="/match">
            相性を見る（β）
          </a>
          <a className="border border-zinc-700 hover:bg-zinc-900 px-6 py-2 rounded text-center" href="/profile">
            編集する
          </a>
        </div>
      </div>
    </main>
  );
}