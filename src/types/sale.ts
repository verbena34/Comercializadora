export interface Sale {
  id: string;
  date: string;
  total: number;
  items: SaleItem[];
  customerName?: string;
  customerNit?: string;
  employeeId: string;
  status: "draft" | "completed";
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}
