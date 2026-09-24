"use client";

import { useEffect, useState } from "react";

type Dua = { text: string; note?: string };
type Category = { id: string; title: string; icon: string; items: Dua[] };

const categories: Category[] = [
  {
    id: "daily",
    title: "أدعية يومية",
    icon: "🌤️",
    items: [
      { text: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ" },
      { text: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي" },
      { text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ" },
      { text: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ" },
    ],
  },
  {
    id: "food",
    title: "الطعام والشراب",
    icon: "🍽️",
    items: [
      { text: "بِسْمِ اللَّهِ", note: "قبل الأكل" },
      { text: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ", note: "بعد الأكل" },
    ],
  },
  {
    id: "travel",
    title: "السفر",
    icon: "🧳",
    items: [
      {
        text: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
        note: "دعاء ركوب وسيلة النقل",
      },
      { text: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى" },
    ],
  },
  {
    id: "distress",
    title: "الكرب والهم",
    icon: "🤲",
    items: [
      { text: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ" },
      { text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ" },
      { text: "اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ" },
    ],
  },
  {
    id: "istikhara",
    title: "الاستخارة",
    icon: "⭐",
    items: [
      {
        text: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ...",
        note: "بعد صلاة ركعتين من غير الفريضة",
      },
    ],
  },
  {
    id: "home",
    title: "دخول وخروج المنزل",
    icon: "🏠",
    items: [
      { text: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا", note: "عند دخول المنزل" },
      { text: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", note: "عند الخروج" },
    ],
  },
];

function copyText(text: string) {
  navigator.clipboard?.writeText(text).catch(() => {});
}

export default function DuasPage() {
  const [active, setActive] = useState(categories[0].id);
  const [copied, setCopied] = useState<string | null>(null);

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
          الأدعية
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
          أدعية مأثورة لكل موقف من مواقف يومك
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
            <div
              key={item.text}
              style={{ transitionDelay: `${index * 90}ms` }}
              className="reveal-card rounded-3xl border border-white/20 bg-slate-950/70 p-7 shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:border-amber-300/40"
            >
              {item.note && (
                <span className="mb-3 inline-block rounded-full border border-amber-300/40 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
                  {item.note}
                </span>
              )}
              <p className="text-xl leading-10 text-white">{item.text}</p>
              <button
                type="button"
                onClick={() => {
                  copyText(item.text);
                  setCopied(item.text);
                  setTimeout(() => setCopied(null), 1500);
                }}
                className="mt-4 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-bold text-white/70 transition hover:border-amber-300/50 hover:text-amber-200"
              >
                {copied === item.text ? "تم النسخ ✅" : "نسخ الدعاء"}
              </button>
            </div>
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
