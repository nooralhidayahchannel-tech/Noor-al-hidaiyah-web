import { createServerClient } from "@quranjs/api/server";
import { NextResponse } from "next/server";

const client = createServerClient({
  clientId: process.env.QF_CLIENT_ID!,
    clientSecret: process.env.QF_CLIENT_SECRET!,
      services: {
          gatewayUrl: "https://apis-prelive.quran.foundation",
              oauth2BaseUrl: "https://prelive-oauth2.quran.foundation",
                },
                });

                export async function GET(
                  request: Request,
                    { params }: { params: Promise<{ surah: string }> }
                    ) {
                      try {
                          const { surah } = await params;
                              const surahNumber = Number(surah);

                                  if (
                                        !Number.isInteger(surahNumber) ||
                                              surahNumber < 1 ||
                                                    surahNumber > 114
                                                        ) {
                                                              return NextResponse.json(
                                                                      { error: "رقم السورة غير صحيح" },
                                                                              { status: 400 }
                                                                                    );
                                                                                        }

                                                                                            const allVerses: any[] = [];
                                                                                                let page = 1;
                                                                                                    let hasMore = true;

                                                                                                        while (hasMore) {
                                                                                                              const result: any = await client.content.v4.verses.byChapter(
                                                                                                                      String(surahNumber) as any,
                                                                                                                              {
                                                                                                                                        translations: [85],
                                                                                                                                                  tafsirs: [926],
                                                                                                                                                            page,
                                                                                                                                                                      perPage: 50,
                                                                                                                                                                              } as any
                                                                                                                                                                                    );

                                                                                                                                                                                          const verses = Array.isArray(result)
                                                                                                                                                                                                  ? result
                                                                                                                                                                                                          : result?.verses ?? [];

                                                                                                                                                                                                                allVerses.push(...verses);

                                                                                                                                                                                                                      const pagination = result?.pagination ?? {};

                                                                                                                                                                                                                            hasMore =
                                                                                                                                                                                                                                    verses.length === 50 ||
                                                                                                                                                                                                                                            pagination?.next_page != null ||
                                                                                                                                                                                                                                                    (pagination?.totalPages != null &&
                                                                                                                                                                                                                                                              page < pagination.totalPages);

                                                                                                                                                                                                                                                                    page++;

                                                                                                                                                                                                                                                                          if (page > 20) {
                                                                                                                                                                                                                                                                                  hasMore = false;
                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                return NextResponse.json({
                                                                                                                                                                                                                                                                                                      verses: allVerses,
                                                                                                                                                                                                                                                                                                          });
                                                                                                                                                                                                                                                                                                            } catch (error) {
                                                                                                                                                                                                                                                                                                                console.error("Quran content API error:", error);

                                                                                                                                                                                                                                                                                                                    return NextResponse.json(
                                                                                                                                                                                                                                                                                                                          { error: "تعذر تحميل التفسير والترجمة" },
                                                                                                                                                                                                                                                                                                                                { status: 500 }
                                                                                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                                                                      }