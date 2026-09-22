"use client";

import { useEffect, useMemo, useState } from "react";

const surahs = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام",
  "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد",
  "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
  "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء",
  "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب",
  "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت",
  "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد",
  "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر",
  "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
  "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم",
  "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل",
  "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات",
  "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج",
  "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل",
  "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة",
  "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل",
  "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد",
  "الإخلاص", "الفلق", "الناس",
];

function normalizeArabic(text: string) {
  return text
    .trim()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");
}

export default function QuranPage() {
  const [search, setSearch] = useState("");
  const [surahInfo, setSurahInfo] = useState<
    Record<number, { versesCount: number; revelationPlace: string }>
  >({});

  useEffect(() => {
    fetch("https://api.quran.com/api/v4/chapters?language=ar")
      .then((response) => response.json())
      .then((data) => {
        const info: Record<
          number,
          { versesCount: number; revelationPlace: string }
        > = {};

        for (const chapter of data.chapters ?? []) {
          info[chapter.id] = {
            versesCount: chapter.verses_count ?? 0,
            revelationPlace: chapter.revelation_place ?? "",
          };
        }

        setSurahInfo(info);
      })
      .catch(() => {});
  }, []);

  const filteredSurahs = useMemo(() => {
    const query = normalizeArabic(search);

    if (!query) {
      return surahs.map((name, index) => ({
        name,
        number: index + 1,
      }));
    }

    return surahs
      .map((name, index) => ({
        name,
        number: index + 1,
      }))
      .filter((surah) =>
        normalizeArabic(surah.name).startsWith(query)
      );
  }, [search]);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#062b1f] px-4 py-10 text-white sm:px-6"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-amber-300">
          NOOR AL-HIDAYAH
        </p>

        <h1 className="mt-4 text-4xl font-bold text-amber-100 sm:text-6xl">
          فهرس القرآن الكريم
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
          اختر السورة التي تريد قراءتها
        </p>

        <div id="surah-search" className="mt-8">
          <div className="quran-search-box">
            <span className="quran-search-icon">⌕</span>

            <input
              id="surah-search-input"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث عن سورة..."
              aria-label="البحث عن سورة"
              autoComplete="off"
            />

            {search && (
              <button
                type="button"
                className="quran-search-clear"
                onClick={() => setSearch("")}
                aria-label="مسح البحث"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 text-sm text-white/45">
          {search
            ? `عدد النتائج: ${filteredSurahs.length}`
            : `جميع السور: ${surahs.length}`}
        </div>

        <div className="mt-8 space-y-3">
          {filteredSurahs.map((surah) => (
            <a
              key={surah.number}
              href={`/quran/${surah.number}`}
              className="surah-list-item"
            >
              <span className="surah-number">
                {surah.number}
              </span>

              <span className="surah-name">
                سورة {surah.name}
              </span>

              <span className="surah-info">
                <span>ترتيب {surah.number}</span>
                <span>•</span>
                <span>
                  آيات {surahInfo[surah.number]?.versesCount ?? "—"}
                </span>
                <span>•</span>
                <span>
                  {surahInfo[surah.number]?.revelationPlace === "makkah"
                    ? "مكية"
                    : surahInfo[surah.number]?.revelationPlace === "madinah"
                      ? "مدنية"
                      : "—"}
                </span>
              </span>

              <span className="surah-arrow">
                ←
              </span>
            </a>
          ))}

          {filteredSurahs.length === 0 && (
            <div className="rounded-3xl bg-black/20 px-6 py-12 text-white/60">
              لا توجد سورة بهذا الاسم
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
