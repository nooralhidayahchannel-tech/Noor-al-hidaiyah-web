"use client";

import { useEffect, useState } from "react";

type HadithItem = {
  text: string;
  narrator: string;
  source: string;
  topic: string;
};

const hadiths: HadithItem[] = [
  {
    text: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    narrator: "عمر بن الخطاب رضي الله عنه",
    source: "متفق عليه",
    topic: "الإخلاص",
  },
  {
    text: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    narrator: "أبو هريرة رضي الله عنه",
    source: "متفق عليه",
    topic: "الأدب",
  },
  {
    text: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    narrator: "أنس بن مالك رضي الله عنه",
    source: "متفق عليه",
    topic: "الأخوة",
  },
  {
    text: "الطُّهُورُ شَطْرُ الْإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلَأُ الْمِيزَانَ",
    narrator: "أبو مالك الأشعري رضي الله عنه",
    source: "رواه مسلم",
    topic: "العبادة",
  },
  {
    text: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    narrator: "عبدالله بن عمرو رضي الله عنهما",
    source: "متفق عليه",
    topic: "الأخلاق",
  },
  {
    text: "بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ",
    narrator: "عبدالله بن عمر رضي الله عنهما",
    source: "متفق عليه",
    topic: "أركان الإسلام",
  },
  {
    text: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    narrator: "أبو هريرة رضي الله عنه",
    source: "رواه مسلم",
    topic: "العلم",
  },
  {
    text: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    narrator: "عثمان بن عفان رضي الله عنه",
    source: "رواه البخاري",
    topic: "القرآن",
  },
];

const topics = ["الكل", ...Array.from(new Set(hadiths.map((h) => h.topic)))];

export default function HadithPage() {
  const [filter, setFilter] = useState("الكل");

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
  }, [filter]);

  const list =
    filter === "الكل" ? hadiths : hadiths.filter((h) => h.topic === filter);

  return (
    <main dir="rtl" className="min-h-screen bg-[#062b1f] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-amber-300">
          NOOR AL-HIDAYAH
        </p>
        <h1 className="mt-4 text-4xl font-bold text-amber-100 sm:text-6xl">
          الأحاديث النبوية
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
          أحاديث نبوية شريفة مختارة، بحسب الموضوع
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {topics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setFilter(topic)}
              className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                filter === topic
                  ? "border-amber-300 bg-amber-400 text-slate-950 shadow-lg"
                  : "border-white/20 bg-white/5 text-white/80 hover:border-amber-300/50"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="mt-10 space-y-5 text-right">
          {list.map((hadith, index) => (
            <div
              key={hadith.text}
              style={{ transitionDelay: `${index * 90}ms` }}
              className="reveal-card rounded-3xl border border-white/20 bg-slate-950/70 p-7 shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:border-amber-300/40"
            >
              <span className="inline-block rounded-full border border-amber-300/40 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
                {hadith.topic}
              </span>

              <p className="mt-5 text-xl leading-10 text-white sm:text-2xl">
                «{hadith.text}»
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 text-sm text-white/60">
                <span>عن {hadith.narrator}</span>
                <span className="text-amber-300">{hadith.source}</span>
              </div>
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
