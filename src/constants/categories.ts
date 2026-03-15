export const CATEGORIES: { value: string; label: string; subcategories: string[] }[] = [
  {
    value: "tops",
    label: "トップス",
    subcategories: ["Tシャツ", "シャツ", "ブラウス", "ニット", "セーター", "パーカー", "スウェット", "カーディガン", "タンクトップ", "ポロシャツ", "その他"],
  },
  {
    value: "bottoms",
    label: "ボトムス",
    subcategories: ["デニム", "チノパン", "スラックス", "ショートパンツ", "スカート", "ワイドパンツ", "カーゴパンツ", "スウェットパンツ", "その他"],
  },
  {
    value: "outerwear",
    label: "アウター",
    subcategories: ["ジャケット", "コート", "ダウン", "ブルゾン", "ベスト", "レザージャケット", "デニムジャケット", "マウンテンパーカー", "その他"],
  },
  {
    value: "dress",
    label: "ワンピース・ドレス",
    subcategories: ["ワンピース", "ドレス", "サロペット", "オールインワン", "その他"],
  },
  {
    value: "shoes",
    label: "シューズ",
    subcategories: ["スニーカー", "ブーツ", "サンダル", "革靴", "ローファー", "パンプス", "その他"],
  },
  {
    value: "bags",
    label: "バッグ",
    subcategories: ["トートバッグ", "ショルダーバッグ", "リュック", "クラッチ", "ウエストバッグ", "ボストンバッグ", "その他"],
  },
  {
    value: "accessories",
    label: "アクセサリー・小物",
    subcategories: ["帽子", "マフラー", "ストール", "ベルト", "財布", "サングラス", "ネクタイ", "時計", "アクセサリー", "その他"],
  },
  {
    value: "other",
    label: "その他",
    subcategories: ["その他"],
  },
];

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label])
);

export const POPULAR_BRANDS = [
  "UNIQLO",
  "GU",
  "ZARA",
  "H&M",
  "Supreme",
  "THE NORTH FACE",
  "Patagonia",
  "Nike",
  "adidas",
  "New Balance",
  "Levi's",
  "Ralph Lauren",
  "BEAMS",
  "UNITED ARROWS",
  "SHIPS",
  "JOURNAL STANDARD",
  "nano・universe",
  "URBAN RESEARCH",
  "COMME des GARCONS",
  "STUSSY",
  "Champion",
  "Carhartt",
  "Dr.Martens",
  "Converse",
  "VANS",
];

export const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "FREE"];

export const COLORS = [
  "ブラック",
  "ホワイト",
  "グレー",
  "ネイビー",
  "ブルー",
  "レッド",
  "ピンク",
  "グリーン",
  "イエロー",
  "オレンジ",
  "パープル",
  "ブラウン",
  "ベージュ",
  "カーキ",
  "マルチカラー",
  "その他",
];
