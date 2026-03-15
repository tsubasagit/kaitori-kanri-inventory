import ItemDetailClient from "@/components/items/ItemDetailClient";

export const revalidate = 0;

export async function generateStaticParams() {
  return [];
}

export default function ItemDetailPage() {
  return <ItemDetailClient />;
}
