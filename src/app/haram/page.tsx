const items = [
  {
    title: "الشرك بالله",
    text: "أعظم الذنوب على الإطلاق، وهو صرف شيء من العبادة لغير الله سبحانه وتعالى.",
  },
  {
    title: "قتل النفس بغير حق",
    text: "من كبائر الذنوب، وقد عظّم القرآن الكريم أمره أشد التعظيم.",
  },
  {
    title: "الربا",
    text: "أكل الربا بجميع صوره محرّم قطعًا، وقد توعّد الله آكله بالمحاربة.",
  },
  {
    title: "الزنا وما يقود إليه",
    text: "من الفواحش المحرّمة، وحرّم الإسلام كل وسيلة تقود إليه.",
  },
  {
    title: "شرب الخمر وكل مسكر",
    text: "محرّم قليله وكثيره، ويشمل التحريم كل ما يُذهب العقل.",
  },
  {
    title: "أكل مال اليتيم ظلمًا",
    text: "من كبائر الذنوب التي حذّر منها القرآن الكريم تحذيرًا شديدًا.",
  },
  {
    title: "شهادة الزور والكذب على الله ورسوله",
    text: "من أعظم المحرّمات لما فيها من ظلم وتضليل وتحريف للحق.",
  },
  {
    title: "عقوق الوالدين",
    text: "من كبائر الذنوب، وقرن الله طاعتهما بطاعته في مواضع من القرآن.",
  },
  {
    title: "أكل لحم الخنزير والميتة وما لم يُذكر اسم الله عليه",
    text: "من المحرّمات في الطعام إلا في حال الضرورة القصوى.",
  },
  {
    title: "الغيبة والنميمة",
    text: "محرّمتان، وشبّه القرآن الكريم الغيبة بأكل لحم الأخ ميتًا.",
  },
];

export default function HaramPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#062b1f] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-amber-300">
          NOOR AL-HIDAYAH
        </p>
        <h1 className="mt-4 text-4xl font-bold text-amber-100 sm:text-6xl">
          المحرّمات
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
          أمور نهى عنها الشرع نهيًا قاطعًا، ينبغي على كل مسلم اجتنابها
        </p>

        <div className="mt-10 space-y-4 text-right">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-red-400/25 bg-slate-950/70 p-6 shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:border-red-400/45"
            >
              <h2 className="text-lg font-bold text-red-300">{item.title}</h2>
              <p className="mt-2 leading-8 text-white/75">{item.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm leading-7 text-white/40">
          هذا المحتوى للتذكير العام وليس فتوى، وقد تختلف بعض التفاصيل والاستثناءات حسب الحالة — يُنصح بسؤال أهل العلم عند التفصيل.
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
