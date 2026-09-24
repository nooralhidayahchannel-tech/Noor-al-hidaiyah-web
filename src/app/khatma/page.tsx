"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { loadUserField, saveUserField } from "@/lib/userData";

const TOTAL_PAGES = 604;
const STORAGE_KEY = "noor-khatma";

type Plan = { days: number; startedAt: string };

function loadLocalPlan(): Plan | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadLocalDone(): Record<number, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY + "-done");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const presets = [
  { label: "ختمة رمضان", days: 30 },
  { label: "ختمة شهرين", days: 60 },
  { label: "ختمة نصف سنة", days: 180 },
  { label: "ختمة سنة", days: 365 },
];

export default function KhatmaPage() {
  const { user, ready } = useUser();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [customDays, setCustomDays] = useState(30);

  useEffect(() => {
    if (!ready) return;
    if (user) {
      Promise.all([
        loadUserField<Plan>(user.uid, "khatmaPlan"),
        loadUserField<Record<number, boolean>>(user.uid, "khatmaDone"),
      ]).then(([p, d]) => {
        setPlan(p ?? null);
        setDone(d ?? {});
      });
    } else {
      setPlan(loadLocalPlan());
      setDone(loadLocalDone());
    }
  }, [ready, user]);

  function persistPlan(newPlan: Plan | null, newDone: Record<number, boolean>) {
    if (user) {
      saveUserField(user.uid, "khatmaPlan", newPlan);
      saveUserField(user.uid, "khatmaDone", newDone);
    } else {
      if (newPlan) localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlan));
      else localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY + "-done", JSON.stringify(newDone));
    }
  }

  function startPlan(days: number) {
    const newPlan: Plan = { days, startedAt: new Date().toISOString() };
    setPlan(newPlan);
    setDone({});
    persistPlan(newPlan, {});
  }

  function toggleDay(day: number) {
    setDone((current) => {
      const next = { ...current, [day]: !current[day] };
      persistPlan(plan, next);
      return next;
    });
  }

  function resetPlan() {
    persistPlan(null, {});
    setPlan(null);
    setDone({});
  }

  const schedule = useMemo(() => {
    if (!plan) return [];
    const perDay = Math.ceil(TOTAL_PAGES / plan.days);
    const rows: { day: number; from: number; to: number }[] = [];
    let page = 1;
    for (let day = 1; day <= plan.days; day++) {
      const from = page;
      const to = Math.min(TOTAL_PAGES, page + perDay - 1);
      rows.push({ day, from, to });
      page = to + 1;
      if (page > TOTAL_PAGES) break;
    }
    return rows;
  }, [plan]);

  const completedCount = Object.values(done).filter(Boolean).length;
  const progress = plan ? Math.round((completedCount / plan.days) * 100) : 0;

  return (
    <main dir="rtl" className="min-h-screen bg-[#062b1f] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-amber-300">
          NOOR AL-HIDAYAH
        </p>
        <h1 className="mt-4 text-4xl font-bold text-amber-100 sm:text-6xl">
          خطة ختم القرآن
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/70">
          اختر مدة الختمة، ونوزّع لك عدد الصفحات على كل يوم تلقائيًا
        </p>

        {!plan ? (
          <div className="mt-10 rounded-3xl border border-white/20 bg-slate-950/70 p-7 shadow-xl backdrop-blur-md sm:p-10">
            <div className="grid gap-3 sm:grid-cols-2">
              {presets.map((p) => (
                <button
                  key={p.days}
                  type="button"
                  onClick={() => startPlan(p.days)}
                  className="rounded-2xl border border-amber-300/40 bg-amber-400/10 px-5 py-4 text-right font-bold text-amber-200 transition hover:bg-amber-400/20"
                >
                  {p.label}
                  <span className="mt-1 block text-xs font-normal text-white/50">
                    {p.days} يوم — {Math.ceil(TOTAL_PAGES / p.days)} صفحة يوميًا
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={604}
                value={customDays}
                onChange={(e) => setCustomDays(Number(e.target.value) || 1)}
                className="w-24 rounded-2xl border border-white/20 bg-white/5 px-3 py-3 text-center text-white outline-none focus:border-amber-300/60"
              />
              <span className="text-white/60">يوم</span>
              <button
                type="button"
                onClick={() => startPlan(customDays)}
                className="mr-auto rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-300"
              >
                إنشاء خطة مخصصة
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-10 rounded-3xl border border-amber-300/40 bg-amber-400/10 p-7 shadow-xl backdrop-blur-md">
              <p className="text-white/70">خطتك: {plan.days} يوم</p>
              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-3 text-amber-200">
                {completedCount} من {plan.days} يوم ({progress}%)
              </p>
              <button
                type="button"
                onClick={resetPlan}
                className="mt-4 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs font-bold text-white/60 transition hover:text-red-300"
              >
                إلغاء الخطة وبدء من جديد
              </button>
            </div>

            <div className="mt-6 max-h-[28rem] space-y-2 overflow-y-auto rounded-3xl border border-white/15 bg-slate-950/50 p-4 text-right">
              {schedule.map((row) => (
                <button
                  key={row.day}
                  type="button"
                  onClick={() => toggleDay(row.day)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-5 py-3 transition ${
                    done[row.day]
                      ? "border-amber-300/60 bg-amber-400/10 text-amber-200"
                      : "border-white/10 bg-white/5 text-white/85 hover:border-amber-300/30"
                  }`}
                >
                  <span className="text-sm">
                    اليوم {row.day} — صفحة {row.from} إلى {row.to}
                  </span>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border text-sm ${
                      done[row.day]
                        ? "border-amber-300 bg-amber-400 text-slate-950"
                        : "border-white/30 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        <a
          href="/"
          className="mt-12 inline-block rounded-full border border-white/30 bg-white/10 px-9 py-3 font-bold text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white/20"
        >
          العودة للرئيسية
        </a>
      </div>
    </main>
  );
}
