const items = [
  {
    title: "الأكل والشرب واقفًا",
    text: "من المكروهات المنقولة عن بعض العلماء، والأولى الجلوس عند الأكل والشرب اقتداءً بالسنة.",
  },
  {
    title: "الإسراف في الوضوء واستعمال الماء",
    text: "الزيادة على القدر المشروع بلا حاجة مكروهة، ولو كان الماء عند نهر جارٍ.",
  },
  {
    title: "تشبيك الأصابع أو العبث أثناء الانتظار للصلاة",
    text: "يُكره للمصلي أو من هو بانتظار الصلاة العبث الزائد الذي يشغله عن الخشوع.",
  },
  {
    title: "رفع البصر إلى السماء في الصلاة",
    text: "ورد النهي عنه، والسنة النظر إلى موضع السجود.",
  },
  {
    title: "كثرة الالتفات في الصلاة بلا حاجة",
    text: "يُكره لأنه ينقص من كمال الصلاة والخشوع فيها.",
  },
  {
    title: "دخول المسجد برائحة كريهة",
    text: "كأكل الثوم والبصل نيئًا قبل الذهاب للمسجد، لما فيه من أذية المصلين والملائكة.",
  },
  {
    title: "النوم قبل صلاة العشاء أو الحديث بعدها بلا حاجة",
    text: "كان النبي ﷺ يكره النوم قبلها والسهر بعدها إلا لخير.",
  },
  {
    title: "كثرة الضحك وتضييع الوقت فيما لا فائدة منه",
    text: "لما فيه من قسوة القلب وضياع الوقت الذي ينبغي أن يُستغل بالنافع.",
  },
];

export default function MakroohPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#062b1f] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-amber-300">
          NOOR AL-HIDAYAH
        </p>
        <h1 className="mt-4 text-4xl font-bold text-amber-100 sm:text-6xl">
          المكروهات
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
          أمور غير محرّمة، لكن الأفضل تجنّبها اقتداءً بهدي النبي ﷺ وتكميلًا للعبادة
        </p>

        <div className="mt-10 space-y-4 text-right">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/20 bg-slate-950/70 p-6 shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:border-amber-300/40"
            >
              <h2 className="text-lg font-bold text-amber-200">{item.title}</h2>
              <p className="mt-2 leading-8 text-white/75">{item.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm leading-7 text-white/40">
          هذا المحتوى للتذكير العام وليس فتوى، وقد تختلف بعض الأحكام حسب المذهب والحالة — يُنصح بسؤال أهل العلم عند التفصيل.
        </p>

        <a
          href="/"
          className="mt-8 inline-block rounded-full border border-white/30 bg-white/10 px-9 py-3 font-bold text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white/20"
        >
          العودة للرئيسية
        </a>
      </div>
    </main>
  );
}
