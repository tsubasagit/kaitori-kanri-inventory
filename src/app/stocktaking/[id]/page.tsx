import { StocktakingDetailClient } from "@/components/stocktaking/StocktakingDetailClient";

export const revalidate = 0;

export async function generateStaticParams() {
  return [];
}

export default function StocktakingDetailPage() {
  return <StocktakingDetailClient />;
}
