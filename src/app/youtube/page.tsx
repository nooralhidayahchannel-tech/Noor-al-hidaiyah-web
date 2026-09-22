"use client";

import { useEffect, useState } from "react";

const CHANNEL_URL = "https://youtube.com/@nooralhidayahoff?si=SUfCEM-ma7fVi6uk";

const videoIds = [
  "sujsZ1CeQ3A",
  "AMplM1C4Iq8",
  "1D5H23gRp9Y",
  "SEdhm6BglZw",
  "VUxB8kSz34o",
  "mr5Q4n48gX0",
];

type VideoMeta = { id: string; title: string | null };

export default function YoutubePage() {
  const [videos, setVideos] = useState<VideoMeta[]>(
    videoIds.map((id) => ({ id, title: null }))
  );

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [videos]);

  useEffect(() => {
    videoIds.forEach((id, index) => {
      fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
      )
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          if (!data) return;
          setVideos((current) => {
            const next = [...current];
            next[index] = { id, title: data.title };
            return next;
          });
        })
        .catch(() => {});
    });
  }, []);

  return (
    <main dir="rtl" className="min-h-screen bg-[#062b1f] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-amber-300">
          NOOR AL-HIDAYAH
        </p>
        <h1 className="mt-4 text-4xl font-bold text-amber-100 sm:text-6xl">
          قناة نور الهداية
        </h1>

        <div className="mt-8 flex flex-col items-center gap-5">
          <img
            src="/images/logo.png"
            alt="شعار نور الهداية"
            className="h-28 w-28 rounded-full object-cover shadow-2xl ring-2 ring-amber-300/60"
          />

          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-amber-400 px-10 py-4 text-lg font-bold text-slate-950 shadow-2xl transition duration-300 hover:scale-105 hover:bg-amber-300"
          >
            اشترك في القناة
          </a>
        </div>

        <div className="mt-12 grid gap-6 text-right sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ transitionDelay: `${index * 100}ms` }}
              className="reveal-card group overflow-hidden rounded-3xl border border-white/20 bg-slate-950/70 shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:border-amber-300/50"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title ?? `فيديو ${index + 1}`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition group-hover:opacity-100">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 shadow-xl">
                    <span className="mr-[-2px] text-xl text-slate-950">▶</span>
                  </div>
                </div>
                <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-amber-300">
                  0{index + 1}
                </span>
              </div>

              <div className="p-5">
                <p className="line-clamp-2 text-base font-semibold text-white">
                  {video.title ?? "..."}
                </p>
                <p className="mt-2 text-xs text-amber-300/80">شاهد على يوتيوب ←</p>
              </div>
            </a>
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
