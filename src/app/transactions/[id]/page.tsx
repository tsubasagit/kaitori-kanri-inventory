import TransactionDetailClient from "@/components/transactions/TransactionDetailClient";
import { SAMPLE_TRANSACTIONS } from "@/lib/sampleData";

export async function generateStaticParams() {
  return SAMPLE_TRANSACTIONS.map((t) => ({ id: t.id }));
}

export default function TransactionDetailPage() {
  return <TransactionDetailClient />;
}
