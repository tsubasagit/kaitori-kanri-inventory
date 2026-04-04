import CustomerDetailClient from "@/components/customers/CustomerDetailClient";
import { SAMPLE_CUSTOMERS } from "@/lib/sampleData";

export async function generateStaticParams() {
  return SAMPLE_CUSTOMERS.map((c) => ({ id: c.id }));
}

export default function CustomerDetailPage() {
  return <CustomerDetailClient />;
}
