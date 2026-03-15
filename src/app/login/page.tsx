"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input, Card } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { guestLogin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.push(ROUTES.dashboard);
    } catch {
      setError("メールアドレスまたはパスワードが正しくありません");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    guestLogin();
    router.push(ROUTES.dashboard);
  };

  return (
    <Card className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-foreground">古着在庫管理</h1>
        <p className="mt-1 text-sm text-secondary">ログインしてください</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="メールアドレス"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="staff@example.com"
          required
        />
        <Input
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワードを入力"
          required
        />
        {error && (
          <p className="text-sm text-danger">{error}</p>
        )}
        <Button
          type="submit"
          loading={loading}
          className="w-full"
        >
          ログイン
        </Button>
      </form>

      <div className="mt-4 border-t border-border pt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGuestLogin}
        >
          ゲストログイン
        </Button>
      </div>
    </Card>
  );
}
