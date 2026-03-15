# 古着在庫管理 - サービス仕様書

## 1. サービス概要
- **一言で**: 古着買取・販売店向けの店舗管理システム
- **対象ユーザー**: 袴田様（hakamada）の古着店 従業員約20名
- **解決する課題**: 在庫管理・顧客管理・レジ（POS）・棚卸しを一元管理
- **ステータス**: MVP

## 2. ユーザーロールと権限
| ロール | できること |
|---|---|
| スタッフ（全員同一権限） | 在庫登録・編集、顧客管理、買取・販売、取引履歴閲覧、棚卸し |

## 3. 機能一覧
### 実装済み
- [x] ログイン（メール/パスワード）
- [x] ダッシュボード（本日の売上・買取サマリ、直近取引、クイックアクション）
- [x] 在庫管理（CRUD、検索・フィルタ、ステータス管理）
- [x] 顧客管理（CRUD、検索、本人確認フラグ）
- [x] 買取フロー（ステップ式: 顧客選択→査定→確認→完了）
- [x] 販売（レジ）（商品検索→カート→決済方法選択→完了）
- [x] 取引履歴（一覧・詳細・レシート表示）

### 未実装（予定）
- [ ] 棚卸し（セッション管理、商品スキャン、差異レポート）
- [ ] レポート（日次/月次売上、在庫価値、ブランド別分析）
- [ ] バーコードラベル印刷
- [ ] 写真アップロード
- [ ] CSVエクスポート

## 4. 画面一覧
| 画面 | パス | 概要 |
|---|---|---|
| ログイン | `/login` | メール/パスワード認証 |
| ダッシュボード | `/dashboard` | 本日サマリ・直近取引・クイックアクション |
| 在庫一覧 | `/items` | 検索・フィルタ（ステータス/カテゴリ/ブランド） |
| 在庫登録 | `/items/new` | 商品情報入力フォーム |
| 在庫詳細 | `/items/[id]` | 詳細表示・編集・ステータス変更 |
| 買取 | `/purchase` | ステップ式: 顧客→査定→確認→完了 |
| 販売（レジ） | `/sales/new` | 商品検索→カート→決済 |
| 取引履歴 | `/transactions` | 全取引の検索・一覧 |
| 取引詳細 | `/transactions/[id]` | レシート表示 |
| 顧客一覧 | `/customers` | 検索・一覧 |
| 顧客登録 | `/customers/new` | 本人確認情報含む登録フォーム |
| 顧客詳細 | `/customers/[id]` | 取引履歴付き詳細 |

## 5. データモデル
### items — 在庫
- 主要フィールド: name, brand, category, subcategory, size, color, condition(S/A/B/C/D), purchasePrice, sellingPrice, status(in_stock/sold/returned/disposed), barcode(HKM-YYYYMMDD-XXXX), photoUrls[], customerId, registeredBy

### customers — 顧客
- 主要フィールド: lastName, firstName, lastNameKana, firstNameKana, phone, address, identityVerified, identityDocumentType, customerType(seller/buyer/both), totalSellCount, totalBuyCount

### transactions — 取引
- 主要フィールド: type(purchase/sale), customerId, items[], subtotal, total, paymentMethod(cash/credit_card/electronic_money/qr_payment), amountReceived, change, staffId, staffName, receiptNumber

### counters/receipts/{YYYY-MM-DD} — レシート番号採番

## 6. 外部連携
- 認証: Firebase Auth（メール/パスワード）
- DB: Firestore
- ホスティング: Firebase Hosting

## 7. ビジネスルール
- 価格は**税込**で統一（内税処理）
- 買取時は顧客の本人確認（氏名・住所・身分証）が**必須**（古物営業法）
- バーコードは `HKM-YYYYMMDD-XXXX` 形式で自動生成
- レシート番号は `S-20260315-0001`（販売）/ `P-20260315-0001`（買取）形式
- 取引レコードに顧客名・スタッフ名を非正規化して埋め込み（履歴の正確性優先）
- 買取/販売は Firestore batch で原子的に処理

## 8. 非機能要件
- 想定ユーザー数: 約20名（1店舗）
- パフォーマンス目標: 通常の業務利用に支障なし
- セキュリティ: Firebase Auth 認証必須、Firestore Rules で保護

## 9. 既知の課題・制限
- 写真アップロード未実装（Phase 3予定）
- ハードウェアバーコードスキャナー未対応（Phase 3予定）
- サーマルプリンター連携未対応（Phase 3予定）

## 10. 更新履歴
| 日付 | 内容 |
|---|---|
| 2026-03-15 | 初版作成 |
