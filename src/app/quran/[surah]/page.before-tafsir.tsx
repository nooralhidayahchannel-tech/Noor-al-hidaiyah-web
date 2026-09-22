"use client";

import { useEffect, useState } from "react";

const surahNames = [
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

export default function SurahPage() {
  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahs, setAyahs] = useState<string[]>([]);
  const [contentData, setContentData] = useState<
    Record<number, { translation: string; tafsir: string }>
    >({});
  const [uthmani, setUthmani] = useState(true);
  const [mushafView, setMushafView] = useState(false);
  const [contentMode, setContentMode] = useState<
    "none" | "tafsir" | "translation" | "both"
  >("none");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [versesCount, setVersesCount] = useState(0);
  const [revelationPlace, setRevelationPlace] = useState("");

  useEffect(() => {
    const number = Number(window.location.pathname.split("/").pop()) || 1;
    setSurahNumber(number);

    async function loadSurah() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/quran/${number}`);

        if (!response.ok) {
          throw new Error("تعذر تحميل السورة");
        }

        const data = await response.json();
        const contentResponse = await fetch(`/api/quran-content/${number}`);

        if (contentResponse.ok) {
          const contentJson = await contentResponse.json();

            const contentMap: Record<
                number,
                    { translation: string; tafsir: string }
                      > = {};

                        for (const verse of contentJson.verses?.verses ?? []) {
                            contentMap[verse.verseNumber] = {
                                  translation: verse.translations?.[0]?.text ?? "",
                                        tafsir: verse.tafsirs?.[0]?.text ?? "",
                                            };
                                              }

                                                setContentData(contentMap);
                                                }

        const verses = data.verses ?? [];

        setVersesCount(data.metadata?.versesCount ?? verses.length);
        setRevelationPlace(data.metadata?.revelationPlace ?? "");

        setAyahs(
          verses.map(
            (verse: { text_uthmani?: string; text_imlaei?: string }) =>
              verse.text_uthmani || verse.text_imlaei || ""
          )
        );
      } catch {
        setError("تعذر تحميل السورة. حاول مرة أخرى.");
      } finally {
        setLoading(false);
      }
    }

    loadSurah();
  }, []);

  const surahName = surahNames[surahNumber - 1] || "السورة";

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#04291e] px-4 py-8 text-white sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <header className="quran-header">
          <div className="quran-navigation">
            <a
              href="/"
              className="quran-nav-home"
              aria-label="الصفحة الرئيسية"
              title="الصفحة الرئيسية"
            >
              🏠
            </a>

            <a
              href="/quran"
              className="quran-nav-quran"
              aria-label="فهرس القرآن"
              title="فهرس القرآن"
            >
              القرآن
            </a>

            <button
              type="button"
              className="quran-nav-search"
              onClick={() => {
                document
                  .getElementById("surah-search")
                  ?.scrollIntoView({ behavior: "smooth" });
                document.getElementById("surah-search-input")?.focus();
              }}
              aria-label="البحث عن سورة"
              title="البحث عن سورة"
            >
              🔍
            </button>
          </div>

          <p className="mt-8 text-xs font-bold tracking-[0.25em] text-amber-300">
            NOOR AL-HIDAYAH
          </p>

          <h1 className="quran-surah-title mt-3 text-5xl font-bold text-amber-50 sm:text-7xl">
            {surahName}
          </h1>

          <div className="quran-surah-info">
            <span>ترتيبها {surahNumber}</span>
            <span>•</span>
            <span>{versesCount} آية</span>
            <span>•</span>
            <span>
              {revelationPlace === "makkah"
                ? "مكية"
                : revelationPlace === "madinah"
                  ? "مدنية"
                  : "—"}
            </span>
          </div>

          <div className="quran-top-controls">
            <button
              type="button"
              onClick={() => setUthmani((value) => !value)}
              className="quran-toggle"
            >
              {uthmani ? "الخط العادي" : "الخط العثماني"}
            </button>

            <button
              type="button"
              onClick={() => setMushafView(false)}
              className={`display-control ${!mushafView ? "active" : ""}`}
            >
              ☷ <span>بالسطور</span>
            </button>

            <button
              type="button"
              onClick={() => setMushafView(true)}
              className={`display-control ${mushafView ? "active" : ""}`}
            >
              📖 <span>كامل السورة</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setContentMode((mode) =>
                  mode === "tafsir" ? "none" : "tafsir"
                )
              }
              className={`display-control ${
                contentMode === "tafsir" ? "active" : ""
              }`}
            >
              📚 <span>التفسير</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setContentMode((mode) =>
                  mode === "translation" ? "none" : "translation"
                )
              }
              className={`display-control ${
                contentMode === "translation" ? "active" : ""
              }`}
            >
              🌐 <span>الترجمة</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setContentMode((mode) =>
                  mode === "both" ? "none" : "both"
                )
              }
              className={`display-control ${
                contentMode === "both" ? "active" : ""
              }`}
            >
              📖🌐 <span>تفسير + ترجمة</span>
            </button>
          </div>
        </header>

        {loading && (
          <div className="quran-loading">
            جاري تحميل السورة...
          </div>
        )}

        {error && (
          <div className="quran-error">
            {error}
          </div>
        )}

        {!loading && !error && (
          <section
            className={`quran-reading-panel ${
              uthmani ? "quran-uthmani" : "quran-normal"
            } ${mushafView ? "mushaf-view" : "lines-view"}`}
          >
            {mushafView ? (
              <div className="mushaf-text">
                {ayahs.map((ayah, index) => (
                  <span
                    key={index}
                    className="mushaf-ayah"
                    style={{ animationDelay: `${index * 35}ms` }}
                  >
                    {ayah}
                    <span className="mushaf-number">
                      {" "}
                      {"{"}
                      {index + 1}
                      {"}"}
                      {" "}
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              ayahs.map((ayah, index) => (
                <div
                  key={index}
                  className="quran-line"
                  style={{ animationDelay: `${index * 35}ms` }}
                >
                  <p>{ayah}</p>

                  <span className="ayah-number">
                    {index + 1}
                  </span>
                </div>
              ))
            )}
          </section>
        )}

        <div className="mt-8 text-center">
          <a href="/quran" className="quran-back">
            العودة إلى قائمة السور
          </a>
        </div>
      </div>
    </main>
  );
}
