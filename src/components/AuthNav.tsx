"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AuthNav() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
    return () => unsub();
  }, []);

  if (!ready) return <span className="h-9 w-9" />;

  if (!user) {
    return (
      <a
        href="/login"
        className="rounded-full bg-amber-400 px-4 py-1.5 font-semibold text-slate-950 transition hover:bg-amber-300"
      >
        تسجيل الدخول
      </a>
    );
  }

  const initial = (user.displayName || user.email || "؟").trim().charAt(0).toUpperCase();

  return (
    <a
      href="/account"
      className="flex items-center gap-2 rounded-full border border-amber-300/40 bg-white/5 py-1 pl-3 pr-1 transition hover:border-amber-300/70"
    >
      {user.photoURL ? (
        <img src={user.photoURL} alt="" className="h-7 w-7 rounded-full" />
      ) : (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-950">
          {initial}
        </span>
      )}
      <span className="max-w-[110px] truncate text-xs font-semibold text-white/85">
        {user.displayName || user.email}
      </span>
    </a>
  );
}
