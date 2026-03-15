import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./client";
import { UserProfile } from "@/types";
import { toDateSafe } from "@/utils/date";

export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName });
  await setDoc(doc(db, "users", user.uid), {
    email,
    displayName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return user;
}

export async function signIn(email: string, password: string): Promise<User> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid,
    email: (data.email as string) ?? "",
    displayName: (data.displayName as string) ?? "スタッフ",
    createdAt: toDateSafe(data.createdAt),
    updatedAt: toDateSafe(data.updatedAt),
  };
}
