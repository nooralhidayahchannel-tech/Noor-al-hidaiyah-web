"use client";

import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

function messageFor(code: string) {
  switch (code) {
    case "auth/unauthorized-domain":
      return "هذا الرابط غير مصرّح له بتسجيل الدخول عبر جوجل بعد. أضِف الدومين الحالي من Firebase Console → Authentication → Settings → Authorized domains";
    case "auth/popup-blocked":
    case "auth/popup-closed-by-user":
      return "تم إغلاق نافذة تسجيل الدخول قبل ما تكمل، حاول مرة أخرى";
    case "auth/network-request-failed":
      return "تأكد من اتصال الإنترنت وحاول مرة أخرى";
    default:
      return "تعذّر تسجيل الدخول عبر جوجل، حاول مرة أخرى";
  }
}

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    // safety net in case a previous redirect attempt is still pending
    getRedirectResult(auth).catch(() => {});
  }, []);

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) window.location.href = "/account";
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      setError(messageFor(code));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(cred.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch {
      setError(
        mode === "signup"
          ? "تعذّر إنشاء الحساب، تأكد من البريد وكلمة مرور لا تقل عن 6 أحرف"
          : "البريد أو كلمة المرور غير صحيحة"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) window.location.href = "/account";
  }, [user]);

  if (user) {
    return (
      <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#062b1f] px-4 text-white">
        <p className="text-amber-200">جاري تحويلك لحسابك…</p>
      </main>
    );
  }

  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#062b1f] px-4 py-10 text-white">
      <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-slate-950/70 p-8 shadow-2xl backdrop-blur-md">
        <p className="text-center text-sm font-bold tracking-[0.25em] text-amber-300">
          NOOR AL-HIDAYAH
        </p>
        <h1 className="mt-3 text-center text-3xl font-bold text-amber-100">
          {mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب"}
        </h1>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-white/30 bg-white px-5 py-3 font-bold text-slate-900 shadow-lg transition hover:scale-[1.02] disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.05H2.18a11 11 0 0 0 0 9.9z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.95 10.95 0 0 0 12 1 11 11 0 0 0 2.18 7.05l3.66 2.85C6.71 7.3 9.14 5.38 12 5.38z" />
          </svg>
          الدخول عبر جوجل
        </button>

        <div className="my-6 flex items-center gap-3 text-white/40">
          <span className="h-px flex-1 bg-white/15" />
          أو
          <span className="h-px flex-1 bg-white/15" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="الاسم"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-amber-300/60"
            />
          )}
          <input
            type="email"
            required
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-amber-300/60"
          />
          <input
            type="password"
            required
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-amber-300/60"
          />

          {error && <p className="text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-amber-400 px-5 py-3 font-bold text-slate-950 shadow-lg transition hover:scale-[1.02] hover:bg-amber-300 disabled:opacity-60"
          >
            {mode === "signin" ? "دخول" : "إنشاء الحساب"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-5 w-full text-center text-sm text-amber-200/80 hover:text-amber-200"
        >
          {mode === "signin"
            ? "ما عندك حساب؟ أنشئ واحد"
            : "عندك حساب؟ سجّل الدخول"}
        </button>

        <a href="/" className="mt-4 block text-center text-sm text-white/40 hover:text-white/70">
          العودة للرئيسية
        </a>
      </div>
    </main>
  );
}
