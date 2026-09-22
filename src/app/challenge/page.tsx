"use client";

import { useEffect, useMemo, useState } from "react";

type Question = {
  q: string;
  options: string[];
  answer: number;
};

const pool: Question[] = [
  {
    q: "كم عدد أركان الإسلام؟",
    options: ["ثلاثة", "أربعة", "خمسة", "ستة"],
    answer: 2,
  },
  {
    q: "ما هي أول سورة نزلت من القرآن الكريم؟",
    options: ["الفاتحة", "العلق", "المدثر", "البقرة"],
    answer: 1,
  },
  {
    q: "كم عدد ركعات صلاة الفجر؟",
    options: ["ركعتان", "ثلاث ركعات", "أربع ركعات", "ركعة واحدة"],
    answer: 0,
  },
  {
    q: "في أي شهر فرض صيام رمضان؟",
    options: ["شهر رمضان", "شهر شعبان", "شهر شوال", "شهر ذي الحجة"],
    answer: 0,
  },
  {
    q: "من هو أول الخلفاء الراشدين؟",
    options: ["عمر بن الخطاب", "أبو بكر الصديق", "عثمان بن عفان", "علي بن أبي طالب"],
    answer: 1,
  },
  {
    q: "كم عدد سور القرآن الكريم؟",
    options: ["110", "114", "120", "99"],
    answer: 1,
  },
  {
    q: "ما اسم أطول سورة في القرآن الكريم؟",
    options: ["آل عمران", "النساء", "البقرة", "المائدة"],
    answer: 2,
  },
  {
    q: "إلى أين كانت أول قبلة يصلي إليها المسلمون؟",
    options: ["الكعبة المشرفة", "المسجد الأقصى", "المسجد النبوي", "مسجد قباء"],
    answer: 1,
  },
  {
    q: "كم عدد أركان الحج؟",
    options: ["اثنان", "ثلاثة", "أربعة", "خمسة"],
    answer: 2,
  },
  {
    q: "ما هو الشهر الذي يسبق شهر رمضان؟",
    options: ["شعبان", "رجب", "شوال", "محرم"],
    answer: 0,
  },
];

function todaySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function pickToday(): Question[] {
  const seed = todaySeed();
  const shuffled = [...pool].sort(
    (a, b) => ((seed * pool.indexOf(a) + 7) % 97) - ((seed * pool.indexOf(b) + 7) % 97)
  );
  return shuffled.slice(0, 5);
}

const STORAGE_KEY = "noor-challenge";

export default function ChallengePage() {
  const questions = useMemo(() => pickToday(), []);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.day === todaySeed()) {
          setAlreadyDone(saved.score);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  function choose(index: number) {
    if (selected !== null) return;
    setSelected(index);
    const correct = index === questions[step].answer;
    const nextScore = score + (correct ? 20 : 0);

    setTimeout(() => {
      if (step + 1 < questions.length) {
        setScore(nextScore);
        setStep((s) => s + 1);
        setSelected(null);
      } else {
        setScore(nextScore);
        setDone(true);
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ day: todaySeed(), score: nextScore })
          );
        } catch {
          // ignore
        }
      }
    }, 700);
  }

  const progress = ((step + (done ? 1 : 0)) / questions.length) * 100;

  return (
    <main dir="rtl" className="min-h-screen bg-[#062b1f] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-amber-300">
          NOOR AL-HIDAYAH
        </p>
        <h1 className="mt-4 text-4xl font-bold text-amber-100 sm:text-6xl">
          التحدي اليومي
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/70">
          خمسة أسئلة كل يوم، كل إجابة صحيحة بعشرين نقطة، أقصى نقاط اليوم مئة
        </p>

        {alreadyDone !== null && !done && (
          <div className="mt-10 rounded-3xl border border-amber-300/40 bg-amber-400/10 p-10 shadow-xl backdrop-blur-md">
            <div className="text-5xl">✅</div>
            <h2 className="mt-4 text-2xl font-bold text-amber-200">
              خلصت تحدي اليوم
            </h2>
            <p className="mt-3 text-white/80">
              حصلت على {alreadyDone} من 100 نقطة اليوم. ارجع بكرة لتحدٍّ جديد!
            </p>
          </div>
        )}

        {alreadyDone === null && (
          <div className="mt-10 rounded-3xl border border-white/20 bg-slate-950/70 p-7 shadow-xl backdrop-blur-md sm:p-10">
            <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {!done ? (
              <>
                <p className="text-sm text-amber-300">
                  سؤال {step + 1} من {questions.length}
                </p>
                <h2 className="mt-4 text-2xl font-bold leading-relaxed text-white sm:text-3xl">
                  {questions[step].q}
                </h2>

                <div className="mt-8 grid gap-3">
                  {questions[step].options.map((option, index) => {
                    const isCorrect = index === questions[step].answer;
                    const isSelected = selected === index;
                    const showState = selected !== null;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => choose(index)}
                        disabled={selected !== null}
                        className={`rounded-2xl border px-6 py-4 text-right text-lg font-semibold transition ${
                          showState && isCorrect
                            ? "border-emerald-400 bg-emerald-400/15 text-emerald-200"
                            : showState && isSelected
                              ? "border-red-400 bg-red-400/15 text-red-200"
                              : "border-white/20 bg-white/5 text-white hover:border-amber-300/50 hover:bg-white/10"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div>
                <div className="text-6xl">🏆</div>
                <h2 className="mt-4 text-3xl font-bold text-amber-200">
                  أحسنت!
                </h2>
                <p className="mt-3 text-xl text-white/85">
                  حصلت على <span className="font-bold text-amber-300">{score}</span> من 100 نقطة
                </p>
                <p className="mt-2 text-white/60">ارجع بكرة لتحدٍّ جديد</p>
              </div>
            )}
          </div>
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
