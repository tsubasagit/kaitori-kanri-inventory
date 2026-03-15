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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  return (
    <AuthContext.Provider value={{ user, profile, loading, error }}>
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
