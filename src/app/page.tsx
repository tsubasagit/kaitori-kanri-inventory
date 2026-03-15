"use client";

import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* ヒーロー */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-hover px-4 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            デモ版 — 実際のデータは保存されません
          </div>
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
            古着在庫管理システム
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85 sm:text-xl">
            QRコードで商品を管理。買取から販売まで、<br className="hidden sm:inline" />
            古着店の業務をワンストップでサポートします。
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={ROUTES.login}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-primary transition-colors hover:bg-white/90"
            >
              ゲストログインで試す
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 運用フロー */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">運用フロー</h2>
          <p className="mt-2 text-center text-secondary">QRコードを軸にした、シンプルな買取 → 販売の流れ</p>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "買取・査定",
                desc: "カメラで商品を撮影し、情報を入力。システムがバーコード番号（HKM-XXXXXXXX-XXXX）を自動発行します。",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                ),
              },
              {
                step: "2",
                title: "QRコード貼付",
                desc: "発行されたバーコード番号でQRコードを作成し、商品タグに貼り付けます。無料サイトやアプリで簡単に作成可能。",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                ),
              },
              {
                step: "3",
                title: "販売・レジ",
                desc: "販売時はカメラでQRコードをスキャン。商品が自動でカートに追加され、そのまま決済へ進めます。",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
                    {item.icon}
                  </div>
                  <span className="text-sm font-semibold text-primary">STEP {item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 機能一覧 */}
      <section className="bg-muted px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">主な機能</h2>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "在庫管理", desc: "商品の登録・検索・フィルタ・ステータス管理。カメラで写真撮影、QRコード読み取りに対応。" },
              { title: "顧客管理", desc: "顧客情報の登録・検索。古物営業法に準拠した本人確認記録にも対応。" },
              { title: "買取（仕入れ）", desc: "ステップ式の買取フロー。顧客選択 → 写真撮影 → 査定 → 確定まで一気通貫。" },
              { title: "販売（レジ）", desc: "QRコードスキャンで商品をカートに追加。現金・クレカ・電子マネー・QR決済に対応。" },
              { title: "取引履歴", desc: "買取・販売の全取引を検索・閲覧。レシート表示にも対応。" },
              { title: "ダッシュボード", desc: "本日の売上・買取サマリ、直近取引、クイックアクションを一画面で確認。" },
            ].map((f) => (
              <div key={f.title} className="rounded-lg border border-border bg-white p-5 shadow-sm">
                <h3 className="font-bold text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-secondary">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QRコード作成ガイド */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">QRコードの作り方</h2>
          <p className="mt-2 text-center text-secondary">商品に貼るQRコードは、以下の方法で簡単に作成できます</p>

          <div className="mt-10 space-y-4">
            {[
              {
                title: "無料Webサイトで作成（最も手軽）",
                desc: "「QRのススメ」等のサイトでテキスト入力するだけ。登録不要・無料。",
              },
              {
                title: "Excelで一括作成",
                desc: "大量の商品を扱う場合に便利。A列にバーコード番号を並べ、Google Charts APIのURLで一括生成。",
              },
              {
                title: "スマートフォンアプリで作成",
                desc: "「QRコードリーダー & 作成」等のアプリで、テキスト入力 → QRコード生成 → 画像保存。",
              },
              {
                title: "ラベルプリンターで直接印刷",
                desc: "Brother QL-800 等をお持ちなら、付属ソフトからバーコード番号を入力してラベルに直接印刷。",
              },
            ].map((m, i) => (
              <div key={i} className="flex gap-4 rounded-lg border border-border p-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{m.title}</h3>
                  <p className="mt-1 text-sm text-secondary">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-secondary">
            QRコードの中身は、システムが発行するバーコード番号<br />
            （例: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">HKM-20260315-0001</code>）をそのまま入力してください。
          </p>
        </div>
      </section>

      {/* デモ注意 + CTA */}
      <section className="bg-primary px-4 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium">
            デモ版
          </div>
          <h2 className="text-2xl font-bold sm:text-3xl">まずは試してみてください</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/85">
            これはデモ用のアプリケーションです。ゲストログインでサンプルデータが入った状態で全機能をお試しいただけます。データはブラウザを閉じるとリセットされます。
          </p>
          <div className="mt-8">
            <Link
              href={ROUTES.login}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-primary transition-colors hover:bg-white/90"
            >
              ゲストログインで試す
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* お問い合わせ */}
      <section className="border-t border-border px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">お問い合わせ</h2>
          <p className="mt-3 text-secondary">
            導入のご相談・カスタマイズのご要望など、お気軽にお問い合わせください。
          </p>
          <div className="mt-8">
            <a
              href="https://share.hsforms.com/2T1pQ6j2sQzajdd3AIDeWqgcy93d?utm_source=kaitori-kanri-inventory"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              AppTalentHub に問い合わせる
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-border bg-muted px-4 py-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm text-secondary">古着在庫管理システム — デモ版</p>
          <p className="mt-2 text-xs text-secondary">
            お問い合わせ:&nbsp;
            <a
              href="https://share.hsforms.com/2T1pQ6j2sQzajdd3AIDeWqgcy93d?utm_source=kaitori-kanri-inventory"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              AppTalentHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
