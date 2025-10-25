export interface Sale {
  id: string;
  customerName: string;
  date: string;
  items: SaleItem[];
  total: number;
  subtotal: number;
  discount: number;
  status: "completed" | "pending" | "cancelled" | "draft";
  paymentMethod: "efectivo" | "tarjeta" | "transferencia";
  transferenceImage?: string;
  fromQuote?: string; // ID of the original quote
  customerNit?: string;
  employeeId?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

export interface SaleSummary {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  todaySales: number;
  monthSales: number;
}
