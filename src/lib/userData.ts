import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function loadUserField<T>(uid: string, field: string): Promise<T | null> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    const data = snap.data();
    return (data?.[field] as T) ?? null;
  } catch {
    return null;
  }
}

export async function saveUserField(uid: string, field: string, value: unknown) {
  try {
    await setDoc(doc(db, "users", uid), { [field]: value }, { merge: true });
  } catch {
    // fails silently — local state still works, will retry next change
  }
}
