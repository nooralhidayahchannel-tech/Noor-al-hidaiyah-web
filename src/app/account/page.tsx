"use client";

import { useEffect, useState } from "react";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [nameMsg, setNameMsg] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEmailAccount = user?.providerData.some((p) => p.providerId === "password");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setName(u?.displayName || "");
      setReady(true);
      if (!u) window.location.href = "/login";
    });
    return () => unsub();
  }, []);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setNameMsg(null);
    setLoading(true);
    try {
      await updateProfile(user, { displayName: name });
      setNameMsg("تم تحديث الاسم ✅");
    } catch {
      setNameMsg("تعذّر تحديث الاسم");
    } finally {
      setLoading(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !user.email) return;
    setPwError(null);
    setPwMsg(null);

    if (newPassword.length < 6) {
      setPwError("كلمة المرور الجديدة لازم تكون 6 أحرف أو أكثر");
      return;
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setPwMsg("تم تغيير كلمة المرور ✅");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setPwError("كلمة المرور الحالية غير صحيحة، أو حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  if (!ready || !user) {
    return (
      <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#062b1f] text-amber-200">
        جاري التحميل…
      </main>
    );
  }

  const initial = (user.displayName || user.email || "؟").trim().charAt(0).toUpperCase();

  return (
    <main dir="rtl" className="min-h-screen bg-[#062b1f] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-lg">
        <p className="text-center text-sm font-bold tracking-[0.25em] text-amber-300">
          NOOR AL-HIDAYAH
        </p>
        <h1 className="mt-4 text-center text-4xl font-bold text-amber-100">حسابي</h1>

        <div className="mt-8 flex flex-col items-center rounded-3xl border border-white/20 bg-slate-950/70 p-8 text-center shadow-2xl backdrop-blur-md">
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="h-20 w-20 rounded-full ring-2 ring-amber-300/60" />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-400 text-2xl font-bold text-slate-950 ring-2 ring-amber-300/60">
              {initial}
            </span>
          )}
          <p className="mt-4 text-xl font-bold text-amber-200">
            {user.displayName || "بدون اسم"}
          </p>
          <p className="mt-1 text-sm text-white/50">{user.email}</p>
        </div>

        <form
          onSubmit={saveName}
          className="mt-6 rounded-3xl border border-white/20 bg-slate-950/70 p-6 shadow-xl backdrop-blur-md"
        >
          <h2 className="text-lg font-bold text-amber-200">تعديل الاسم</h2>
          <div className="mt-4 flex gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسمك"
              className="flex-1 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-amber-300/60"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-amber-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-amber-300 disabled:opacity-60"
            >
              حفظ
            </button>
          </div>
          {nameMsg && <p className="mt-3 text-sm text-amber-200/90">{nameMsg}</p>}
        </form>

        {isEmailAccount && (
          <form
            onSubmit={changePassword}
            className="mt-6 rounded-3xl border border-white/20 bg-slate-950/70 p-6 shadow-xl backdrop-blur-md"
          >
            <h2 className="text-lg font-bold text-amber-200">تغيير كلمة المرور</h2>
            <div className="mt-4 flex flex-col gap-3">
              <input
                type="password"
                required
                placeholder="كلمة المرور الحالية"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-amber-300/60"
              />
              <input
                type="password"
                required
                placeholder="كلمة المرور الجديدة"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-amber-300/60"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-amber-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-amber-300 disabled:opacity-60"
              >
                تحديث كلمة المرور
              </button>
              {pwMsg && <p className="text-sm text-amber-200/90">{pwMsg}</p>}
              {pwError && <p className="text-sm text-red-300">{pwError}</p>}
            </div>
          </form>
        )}

        {!isEmailAccount && (
          <p className="mt-6 text-center text-sm text-white/40">
            دخلت عبر جوجل، ما تقدر تغيّر كلمة مرور من هنا
          </p>
        )}

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="rounded-full border border-white/30 bg-white/10 px-8 py-3 font-bold text-white transition hover:bg-white/20"
          >
            تسجيل الخروج
          </button>
          <a href="/" className="text-sm text-white/40 hover:text-white/70">
            العودة للرئيسية
          </a>
        </div>
      </div>
    </main>
  );
}
