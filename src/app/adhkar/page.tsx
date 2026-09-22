"use client";

import { useEffect, useState } from "react";

type Dhikr = {
  text: string;
  count: number;
  fadl?: string;
};

type Category = {
  id: string;
  title: string;
  icon: string;
  items: Dhikr[];
};

const categories: Category[] = [
  {
    id: "morning",
    title: "أذكار الصباح",
    icon: "🌅",
    items: [
      {
        text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
        count: 1,
      },
      {
        text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
        count: 1,
      },
      {
        text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
        count: 3,
      },
      { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 },
      {
        text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        count: 10,
        fadl: "من قالها عشر مرات كانت له عدل عشر رقاب",
      },
    ],
  },
  {
    id: "evening",
    title: "أذكار المساء",
    icon: "🌆",
    items: [
      {
        text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
        count: 1,
      },
      {
        text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ (دعاء سيد الاستغفار)",
        count: 1,
      },
      { text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3 },
      { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 },
      { text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", count: 100 },
    ],
  },
  {
    id: "after-prayer",
    title: "أذكار بعد الصلاة",
    icon: "🕌",
    items: [
      { text: "أَسْتَغْفِرُ اللَّهَ (ثلاثًا)، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ", count: 1 },
      { text: "سُبْحَانَ اللَّهِ", count: 33 },
      { text: "الْحَمْدُ لِلَّهِ", count: 33 },
      { text: "اللَّهُ أَكْبَرُ", count: 33 },
      {
        text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        count: 1,
      },
    ],
  },
  {
    id: "sleep",
    title: "أذكار النوم",
    icon: "🌙",
    items: [
      { text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", count: 1 },
      { text: "سُبْحَانَ اللَّهِ", count: 33 },
      { text: "الْحَمْدُ لِلَّهِ", count: 33 },
      { text: "اللَّهُ أَكْبَرُ", count: 34 },
      { text: "آيَةُ الْكُرْسِيِّ: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", count: 1 },
    ],
  },
];

function CounterCard({ item, index }: { item: Dhikr; index: number }) {
  const [remaining, setRemaining] = useState(item.count);

  return (
    <button
      type="button"
      onClick={() =>
        setRemaining((current) => (current > 0 ? current - 1 : item.count))
      }
      style={{ transitionDelay: `${index * 80}ms` }}
      className={`reveal-card group flex w-full items-start justify-between gap-4 rounded-3xl border p-6 text-right shadow-xl backdrop-blur-md transition sm:p-7 ${
        remaining === 0
          ? "border-amber-300/60 bg-amber-400/10"
          : "border-white/20 bg-slate-950/70 hover:-translate-y-1 hover:border-amber-300/40"
      }`}
    >
      <div className="flex-1">
        <p className="text-lg leading-9 text-white sm:text-xl">{item.text}</p>
        {item.fadl && (
          <p className="mt-3 text-sm text-amber-200/80">{item.fadl}</p>
        )}
      </div>

      <div className="flex flex-shrink-0 flex-col items-center gap-1">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full border-2 text-lg font-bold transition ${
            remaining === 0
              ? "border-amber-300 bg-amber-400 text-slate-950"
              : "border-amber-300/50 bg-black/30 text-amber-200"
          }`}
        >
          {remaining === 0 ? "✓" : remaining}
        </div>
        <span className="text-[11px] text-white/40">اضغط للعدّ</span>
      </div>
    </button>
  );
}

export default function AdhkarPage() {
  const [active, setActive] = useState(categories[0].id);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.1 }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [active]);

  const current = categories.find((category) => category.id === active)!;

  return (
    <main dir="rtl" className="min-h-screen bg-[#062b1f] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-amber-300">
          NOOR AL-HIDAYAH
        </p>
        <h1 className="mt-4 text-4xl font-bold text-amber-100 sm:text-6xl">
          الأذكار
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
          اجعل ذكر الله جزءًا من يومك، اضغط على كل ذكر لتعدّ تكراره
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActive(category.id)}
              className={`rounded-full border px-5 py-3 text-sm font-bold transition sm:text-base ${
                active === category.id
                  ? "border-amber-300 bg-amber-400 text-slate-950 shadow-lg"
                  : "border-white/20 bg-white/5 text-white/80 hover:border-amber-300/50"
              }`}
            >
              <span className="ml-2">{category.icon}</span>
              {category.title}
            </button>
          ))}
        </div>

        <div className="mt-10 space-y-4 text-right">
          {current.items.map((item, index) => (
            <CounterCard key={item.text} item={item} index={index} />
          ))}
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
