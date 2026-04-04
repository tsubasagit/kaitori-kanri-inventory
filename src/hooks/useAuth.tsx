"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { getUserProfile } from "@/lib/firebase/auth";
import { UserProfile } from "@/types";

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isGuest: boolean;
  guestLogin: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // sessionStorage からゲスト状態を復元
    if (typeof window !== "undefined" && sessionStorage.getItem("guest") === "1") {
      guestLogin();
      return;
    }

    let loadingCleared = false;
    const clearLoading = () => {
      if (loadingCleared) return;
      loadingCleared = true;
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setError(null);

      if (firebaseUser) {
        try {
          const userProfile = await Promise.race([
            getUserProfile(firebaseUser.uid),
            new Promise<null>((_, reject) =>
              setTimeout(() => reject(new Error("Profile fetch timeout")), 10000)
            ),
          ]);
          setProfile(userProfile);
        } catch (err) {
          console.error("Failed to fetch user profile:", err);
          setError("ユーザープロフィールの取得に失敗しました");
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      clearLoading();
    });

    const fallbackTimer = setTimeout(clearLoading, 15000);

    return () => {
      unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, []);

  const guestLogin = () => {
    const guestUser = { uid: "guest", displayName: "ゲスト" } as User;
    const guestProfile: UserProfile = {
      uid: "guest",
      email: "guest@example.com",
      displayName: "ゲストスタッフ",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setUser(guestUser);
    setProfile(guestProfile);
    setIsGuest(true);
    setLoading(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("guest", "1");
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, isGuest, guestLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
