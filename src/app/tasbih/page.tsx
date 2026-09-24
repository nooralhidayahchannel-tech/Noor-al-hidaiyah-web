"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { loadUserField, saveUserField } from "@/lib/userData";

const phrases = [
  { id: "subhanallah", text: "سُبْحَانَ اللَّهِ" },
  { id: "alhamdulillah", text: "الْحَمْدُ لِلَّهِ" },
  { id: "allahuakbar", text: "اللَّهُ أَكْبَرُ" },
  { id: "lailahaillallah", text: "لَا إِلَهَ إِلَّا اللَّهُ" },
  { id: "astaghfirullah", text: "أَسْتَغْفِرُ اللَّهَ" },
];

const targets = [33, 100, 1000];

const STORAGE_KEY = "noor-tasbih-total";

export default function TasbihPage() {
  const { user, ready } = useUser();
  const [phraseId, setPhraseId] = useState(phrases[0].id);
  const [target, setTarget] = useState(33);
  const [count, setCount] = useState(0);
  const [lifetime, setLifetime] = useState(0);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (user) {
      loadUserField<number>(user.uid, "tasbihTotal").then((v) => setLifetime(v ?? 0));
    } else {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        setLifetime(raw ? Number(raw) : 0);
      } catch {
        // ignore
      }
    }
  }, [ready, user]);

  function persistLifetime(next: number) {
    if (user) {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveUserField(user.uid, "tasbihTotal", next);
      }, 600);
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
    }
  }

  function tap() {
    setCount((c) => {
      const next = c + 1;
      if (next % target === 0 && "vibrate" in navigator) {
        navigator.vibrate?.(120);
      }
      return next;
    });
    setLifetime((l) => {
      const next = l + 1;
      persistLifetime(next);
      return next;
    });
  }

  function reset() {
    setCount(0);
  }

  const phrase = phrases.find((p) => p.id === phraseId)!;
  const progress = Math.min(100, ((count % target) / target) * 100 || (count > 0 ? 100 : 0));
  const rounds = Math.floor(count / target);

  return (
    <main dir="rtl" className="min-h-screen bg-[#062b1f] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-md text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-amber-300">
          NOOR AL-HIDAYAH
        </p>
        <h1 className="mt-4 text-4xl font-bold text-amber-100 sm:text-6xl">
          التسبيح
        </h1>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {phrases.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPhraseId(p.id);
                setCount(0);
              }}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                phraseId === p.id
                  ? "border-amber-300 bg-amber-400 text-slate-950"
                  : "border-white/20 bg-white/5 text-white/75 hover:border-amber-300/40"
              }`}
            >
              {p.text}
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {targets.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTarget(t);
                setCount(0);
              }}
              className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                target === t
                  ? "border-amber-300/70 bg-amber-400/15 text-amber-200"
                  : "border-white/15 text-white/50 hover:text-white/80"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={tap}
          className="group relative mx-auto mt-10 flex h-64 w-64 select-none items-center justify-center rounded-full border-4 border-amber-300/50 bg-slate-950/70 shadow-2xl backdrop-blur-md transition active:scale-95"
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#ffffff1a" strokeWidth="4" />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - progress / 100)}
              className="transition-all duration-300"
            />
          </svg>
          <div>
            <p className="text-lg font-semibold text-amber-200">{phrase.text}</p>
            <p className="mt-2 text-5xl font-bold text-white">{count % target || (count > 0 ? target : 0)}</p>
            <p className="mt-1 text-xs text-white/40">من {target}</p>
          </div>
        </button>

        <p className="mt-6 text-white/60">أتممت {rounds} دورة كاملة</p>

        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-bold text-white/70 transition hover:text-red-300"
        >
          تصفير العداد
        </button>

        <p className="mt-8 text-sm text-amber-200/70">
          إجمالي تسبيحك {user ? "(محفوظ بحسابك)" : "على هذا الجهاز"}: {lifetime.toLocaleString("ar-EG")}
        </p>

        <a
          href="/"
          className="mt-10 inline-block rounded-full border border-white/30 bg-white/10 px-9 py-3 font-bold text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white/20"
        >
          العودة للرئيسية
        </a>
      </div>
    </main>
  );
}
