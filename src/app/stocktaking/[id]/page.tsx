import { StocktakingDetailClient } from "@/components/stocktaking/StocktakingDetailClient";
import { SAMPLE_STOCKTAKING_SESSIONS } from "@/lib/sampleData";

export async function generateStaticParams() {
  return SAMPLE_STOCKTAKING_SESSIONS.map((s) => ({ id: s.id }));
}

export default function StocktakingDetailPage() {
  return <StocktakingDetailClient />;
}
