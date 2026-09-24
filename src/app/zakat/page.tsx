"use client";

import { useMemo, useState } from "react";

const NISAB_GOLD_GRAMS = 85;

function Field({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <label className="block text-right">
      <span className="mb-2 block text-sm text-white/70">{label}</span>
      <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 focus-within:border-amber-300/60">
        <input
          type="number"
          min={0}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          placeholder="0"
          className="w-full bg-transparent text-white outline-none placeholder-white/30"
        />
        {suffix && <span className="text-xs text-white/40">{suffix}</span>}
      </div>
    </label>
  );
}

export default function ZakatPage() {
  const [cash, setCash] = useState(0);
  const [goldGrams, setGoldGrams] = useState(0);
  const [goldPrice, setGoldPrice] = useState(0);
  const [silverGrams, setSilverGrams] = useState(0);
  const [silverPrice, setSilverPrice] = useState(0);
  const [investments, setInvestments] = useState(0);
  const [businessAssets, setBusinessAssets] = useState(0);
  const [owedToYou, setOwedToYou] = useState(0);
  const [debts, setDebts] = useState(0);

  const goldValue = goldGrams * goldPrice;
  const silverValue = silverGrams * silverPrice;
  const totalWealth =
    cash + goldValue + silverValue + investments + businessAssets + owedToYou - debts;

  const nisabValue = NISAB_GOLD_GRAMS * (goldPrice || 0);
  const meetsNisab = goldPrice > 0 && totalWealth >= nisabValue;
  const zakatDue = useMemo(
    () => (meetsNisab && totalWealth > 0 ? totalWealth * 0.025 : 0),
    [meetsNisab, totalWealth]
  );

  return (
    <main dir="rtl" className="min-h-screen bg-[#062b1f] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-amber-300">
          NOOR AL-HIDAYAH
        </p>
        <h1 className="mt-4 text-4xl font-bold text-amber-100 sm:text-6xl">
          حساب الزكاة
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/70">
          عبّي بياناتك المالية ونحسب لك زكاة المال المستحقة (٢.٥٪)
        </p>

        <div className="mt-10 space-y-4 rounded-3xl border border-white/20 bg-slate-950/70 p-6 text-right shadow-xl backdrop-blur-md sm:p-8">
          <Field label="النقد والمدّخرات (بالحساب البنكي أو باليد)" value={cash} onChange={setCash} suffix="د.إ" />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="وزن الذهب" value={goldGrams} onChange={setGoldGrams} suffix="جرام" />
            <Field label="سعر جرام الذهب حاليًا" value={goldPrice} onChange={setGoldPrice} suffix="د.إ" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="وزن الفضة" value={silverGrams} onChange={setSilverGrams} suffix="جرام" />
            <Field label="سعر جرام الفضة حاليًا" value={silverPrice} onChange={setSilverPrice} suffix="د.إ" />
          </div>

          <Field label="استثمارات وأسهم" value={investments} onChange={setInvestments} suffix="د.إ" />
          <Field label="أصول تجارية (بضاعة معدّة للبيع)" value={businessAssets} onChange={setBusinessAssets} suffix="د.إ" />
          <Field label="ديون لك عند الناس (تتوقع تحصيلها)" value={owedToYou} onChange={setOwedToYou} suffix="د.إ" />
          <Field label="ديون عليك (تُخصم)" value={debts} onChange={setDebts} suffix="د.إ" />

          <p className="pt-2 text-xs leading-6 text-white/40">
            تحتاج تدخل سعر الذهب الحالي بنفسك (تقدر تتأكد منه من أي محل صرافة أو موقع أسعار الذهب اليوم)، نصاب الزكاة يُحسب على أساس {NISAB_GOLD_GRAMS} جرام ذهب.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-amber-300/40 bg-amber-400/10 p-8 shadow-2xl backdrop-blur-md">
          <p className="text-white/70">إجمالي المال الزكوي</p>
          <p className="mt-1 text-3xl font-bold text-white">
            {totalWealth.toLocaleString("ar-EG", { maximumFractionDigits: 0 })} د.إ
          </p>

          {goldPrice > 0 ? (
            meetsNisab ? (
              <>
                <p className="mt-5 text-white/70">الزكاة المستحقة (٢.٥٪)</p>
                <p className="mt-1 text-4xl font-bold text-amber-200">
                  {zakatDue.toLocaleString("ar-EG", { maximumFractionDigits: 0 })} د.إ
                </p>
              </>
            ) : (
              <p className="mt-5 text-emerald-300">
                مالك أقل من النصاب ({nisabValue.toLocaleString("ar-EG", { maximumFractionDigits: 0 })} د.إ)، ما عليك زكاة هالسنة
              </p>
            )
          ) : (
            <p className="mt-5 text-sm text-amber-200/80">
              أدخل سعر جرام الذهب الحالي لحساب النصاب والزكاة
            </p>
          )}
        </div>

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
