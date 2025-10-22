export interface Quote {
  id: string;
  customerName: string;
  validDays: number;
  date: string;
  items: QuoteItem[];
  total: number;
  status: "open" | "won" | "lost";
}

export interface QuoteItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}
