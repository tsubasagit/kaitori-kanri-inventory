export const ROUTES = {
  login: "/login",
  dashboard: "/dashboard",
  items: "/items",
  itemsNew: "/items/new",
  itemDetail: (id: string) => `/items/${id}`,
  customers: "/customers",
  customersNew: "/customers/new",
  customerDetail: (id: string) => `/customers/${id}`,
  purchase: "/purchase",
  salesNew: "/sales/new",
  transactions: "/transactions",
  transactionDetail: (id: string) => `/transactions/${id}`,
} as const;
