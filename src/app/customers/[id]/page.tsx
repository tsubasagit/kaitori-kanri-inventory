import CustomerDetailClient from "@/components/customers/CustomerDetailClient";

export const revalidate = 0;

export async function generateStaticParams() {
  return [];
}

export default function CustomerDetailPage() {
  return <CustomerDetailClient />;
}
