import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ surah: string }> }
) {
  try {
    const { surah } = await params;
    const surahNumber = Number(surah);

    if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return NextResponse.json(
        { error: "رقم السورة غير صحيح" },
        { status: 400 }
      );
    }

    const [versesResponse, chaptersResponse] = await Promise.all([
      fetch(
        `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surahNumber}`,
        { cache: "no-store" }
      ),
      fetch(
        "https://api.quran.com/api/v4/chapters?language=ar",
        { cache: "no-store" }
      ),
    ]);

    if (!versesResponse.ok || !chaptersResponse.ok) {
      throw new Error("تعذر جلب بيانات السورة");
    }

    const versesData = await versesResponse.json();
    const chaptersData = await chaptersResponse.json();

    const chapter = chaptersData.chapters?.find(
      (item: { id: number }) => item.id === surahNumber
    );

    return NextResponse.json({
      ...versesData,
      metadata: {
        id: surahNumber,
        versesCount: chapter?.verses_count ?? versesData.verses?.length ?? 0,
        revelationPlace: chapter?.revelation_place ?? "",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب السورة" },
      { status: 500 }
    );
  }
}
