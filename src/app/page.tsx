"use client";

import { useEffect } from "react";

const cards = [
  {
    icon: "📖",
    title: "القرآن الكريم",
    text: "اقرأ وتدبر آيات القرآن الكريم.",
    href: "#quran",
  },
  {
    icon: "🤲",
    title: "الأذكار",
    text: "اجعل ذكر الله جزءًا من يومك.",
    href: "/adhkar",
  },
  {
    icon: "📜",
    title: "الأحاديث",
    text: "تعرّف على الأحاديث النبوية النافعة.",
    href: "/hadith",
  },
  {
    icon: "🏆",
    title: "التحدي اليومي",
    text: "خمسة أسئلة يوميًا واكسب حتى مئة نقطة.",
    href: "/challenge",
  },
  {
    icon: "▶️",
    title: "قناة يوتيوب",
    text: "شاهد أحدث مقاطعنا واشترك بالقناة.",
    href: "/youtube",
  },
  {
    icon: "🕌",
    title: "مواقيت الصلاة",
    text: "تابع أوقات الصلوات اليومية بسهولة.",
    href: "#prayer",
  },
  {
    icon: "🧭",
    title: "القبلة",
    text: "اعرف اتجاه القبلة أينما كنت.",
    href: "#qibla",
  },
];

export default function Home() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal-card, .reveal-about, .reveal-quran");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main dir="rtl" className="relative min-h-screen overflow-x-hidden text-white">
      <div className="fixed left-1/2 top-1/2 -z-20 h-[100vh] w-[100vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden">
        <img
          src="/images/background.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="fixed inset-0 -z-10 bg-black/50 pointer-events-none" />

      <nav className="absolute left-0 right-0 top-0 z-20 border-b border-white/15 bg-black/25 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-4 text-sm font-semibold">
          <a href="#" className="text-amber-200">
            الرئيسية
          </a>
          <a href="#quran" className="transition hover:text-amber-200">
            القرآن الكريم
          </a>
          <a href="/hadith" className="transition hover:text-amber-200">
            الأحاديث
          </a>
          <a href="/adhkar" className="transition hover:text-amber-200">
            الأذكار
          </a>
          <a href="/challenge" className="transition hover:text-amber-200">
            التحدي اليومي
          </a>
          <a href="/youtube" className="transition hover:text-amber-200">
            يوتيوب
          </a>
          <a href="#about" className="transition hover:text-amber-200">
            من نحن
          </a>
        </div>
      </nav>

      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 pb-10 pt-32 text-center">
        <div className="hero-logo">
          <img
            src="/images/logo.png"
            alt="شعار نور الهداية"
            className="h-64 w-64 rounded-full object-cover shadow-2xl ring-2 ring-amber-300/60 sm:h-72 sm:w-72"
          />
        </div>

        <h1 className="hero-title mt-8 text-6xl font-bold tracking-tight text-amber-100 sm:text-8xl">
          نور الهداية
        </h1>

        <p className="hero-basmala mt-5 text-xl font-medium text-amber-200 sm:text-2xl">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>

        <p className="hero-description mt-6 max-w-2xl text-lg leading-9 text-white sm:text-xl">
          منصة إسلامية تهدف إلى تقديم محتوى نافع، بطريقة جميلة وبسيطة وسهلة
          الاستخدام.
        </p>

        <div className="hero-buttons mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#content"
            className="rounded-full bg-amber-400 px-10 py-4 text-lg font-bold text-slate-950 shadow-2xl transition duration-300 hover:scale-105 hover:bg-amber-300"
          >
            استكشف المحتوى
          </a>

          <a
            href="#content"
            className="rounded-full border border-white/50 bg-white/10 px-10 py-4 text-lg font-bold text-white shadow-2xl backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white/20"
          >
            ابدأ الآن
          </a>
        </div>

        <a
          href="#content"
          aria-label="انتقل إلى المحتوى"
          className="scroll-cue mt-12 flex flex-col items-center"
        >
          <span className="mb-2 text-base font-semibold text-white">
            مرر للأسفل لاكتشاف المزيد
          </span>

          <span className="scroll-arrow text-7xl font-light text-amber-300 sm:text-8xl">
            ↓
          </span>
        </a>
      </section>

      <section
        id="content"
        className="mx-auto max-w-6xl px-6 pb-24 text-center"
      >
        <div className="rounded-[2rem] border border-white/20 bg-black/50 px-5 py-12 shadow-2xl backdrop-blur-md sm:px-10">
          <h2 className="text-4xl font-bold text-amber-200 sm:text-5xl">
            نور الهداية — طريقك إلى الخير
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/90">
            اكتشف محتوى إسلاميًا نافعًا يساعدك على الاقتراب من كتاب الله وسنة
            نبيه.
          </p>

          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {cards.map((card, index) => (
              <a
                key={card.title}
                href={card.href}
                style={{ transitionDelay: `${index * 140}ms` }}
                className="reveal-card group rounded-3xl border border-white/20 bg-slate-950/70 p-8 shadow-xl backdrop-blur-md hover:-translate-y-2 hover:border-amber-300/60"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/40 bg-black/30 text-4xl shadow-lg transition duration-500 group-hover:scale-110">
                  {card.icon}
                </div>

                <h3 className="mt-6 text-2xl font-bold text-white">
                  {card.title}
                </h3>

                <p className="mt-4 text-base leading-7 text-white/80">
                  {card.text}
                </p>

                <div className="mt-6 text-3xl text-amber-300 transition duration-300 group-hover:-translate-x-2">
                  ←
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        id="about"
        className="mx-auto max-w-5xl px-6 pb-24 text-center"
      >
        <div className="reveal-about rounded-[2rem] border border-amber-300/30 bg-black/55 px-6 py-12 shadow-2xl backdrop-blur-md sm:px-12">
          <p className="text-sm font-bold tracking-widest text-amber-300">
            NOOR AL-HIDAYAH
          </p>

          <h2 className="mt-4 text-4xl font-bold text-amber-100 sm:text-5xl">
            ماذا ستجد في نور الهداية؟
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-white/90 sm:text-xl">
            مساحة إسلامية تجمع لك المحتوى النافع والخدمات الإسلامية في تجربة
            بسيطة وجميلة، تساعدك على جعل الخير والذكر والتعلم جزءًا من يومك.
          </p>

          <div className="mt-8 text-5xl text-amber-300">
            ✦
          </div>
        </div>
      </section>
      <section
        id="quran"
        className="mx-auto max-w-6xl px-6 pb-24 text-center"
      >
        <div className="reveal-quran rounded-[2rem] border border-amber-300/30 bg-black/55 px-5 py-12 shadow-2xl backdrop-blur-md sm:px-10">
          <p className="text-sm font-bold tracking-widest text-amber-300">
            QURAN
          </p>

          <h2 className="mt-4 text-4xl font-bold text-amber-100 sm:text-5xl">
            القرآن الكريم
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/90">
            اقرأ كتاب الله وتدبر آياته في رحلة إيمانية هادئة.
          </p>

          <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-amber-300/30 bg-slate-950/75 p-8 shadow-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/40 bg-amber-400/10 text-4xl shadow-lg">
              📖
            </div>

            <h3 className="mt-6 text-3xl font-bold text-amber-200">
              سورة الفاتحة
            </h3>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-white/70">
              <span>السورة رقم 1</span>
              <span>•</span>
              <span>7 آيات</span>
              <span>•</span>
              <span>مكية</span>
            </div>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-white/85">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            <p className="mx-auto mt-2 max-w-2xl text-base leading-8 text-white/70">
              الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
            </p>

            <a
              href="/quran"
              className="mt-8 inline-block rounded-full bg-amber-400 px-9 py-3 font-bold text-slate-950 shadow-lg transition duration-300 hover:scale-105 hover:bg-amber-300"
            >
              ابدأ القراءة
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
