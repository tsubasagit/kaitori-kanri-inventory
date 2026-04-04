import ItemDetailClient from "@/components/items/ItemDetailClient";
import { SAMPLE_ITEMS } from "@/lib/sampleData";

export async function generateStaticParams() {
  return SAMPLE_ITEMS.map((item) => ({ id: item.id }));
}

export default function ItemDetailPage() {
  return <ItemDetailClient />;
}
