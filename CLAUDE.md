# 古着在庫管理 - 店舗管理システム

## Overview
古着買取・販売店向けの在庫管理・顧客管理・POS・棚卸しWebアプリ。袴田様（hakamada）の1店舗運営、従業員約20名が同一権限で利用。

## Tech Stack
- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4 + PostCSS
- **Auth**: Firebase Auth (Email/Password)
- **DB**: Firestore
- **Font**: Noto Sans JP
- **Path Alias**: `@/*` → `./src/*`

## Project Structure
```
src/
├── app/           # Next.js App Router pages
├── components/
│   ├── ui/        # Button, Card, Input, Table, Modal, Badge, Toast等
│   ├── layout/    # Sidebar, Header
│   ├── items/     # 在庫関連コンポーネント
│   ├── purchase/  # 買取フロー
│   ├── sales/     # 販売レジ
│   ├── customers/ # 顧客関連
│   ├── dashboard/ # ダッシュボード
│   └── transactions/ # 取引関連
├── hooks/         # useAuth, useItems, useCustomers, useTransactions
├── lib/firebase/  # Firebase client + auth
├── types/         # TypeScript型定義
├── constants/     # ルート・ステータス・カテゴリ定数
└── utils/         # バーコード・レシート・通貨・日付ユーティリティ
```

## Commands
```bash
npm run dev    # 開発サーバー起動
npm run build  # 本番ビルド
npm run lint   # ESLint
```

## Firebase Setup
1. `.env.example` を `.env.local` にコピー
2. Firebase Console でプロジェクト作成
3. 環境変数を設定

## Firestore Collections
- `items/{id}` - 在庫（商品情報・価格・ステータス・バーコード）
- `customers/{id}` - 顧客（氏名・住所・本人確認・取引集計）
- `transactions/{id}` - 取引（買取/販売・明細・決済方法・レシート番号）
- `counters/receipts/{YYYY-MM-DD}` - レシート番号カウンター

## Conventions
- UIコンポーネントは `components/ui/` に配置しindex.tsで再エクスポート
- Firestoreの読み書きはcustom hooksに集約
- 全員同一権限（`request.auth != null` のみ）
- 価格は税込で統一
- バーコード: `HKM-YYYYMMDD-XXXX` 形式
- レシート番号: `S-YYYYMMDD-XXXX`（販売）/ `P-YYYYMMDD-XXXX`（買取）
