import TransactionDetailClient from "@/components/transactions/TransactionDetailClient";

export const revalidate = 0;

export async function generateStaticParams() {
  return [];
}

export default function TransactionDetailPage() {
  return <TransactionDetailClient />;
}
