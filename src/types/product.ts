export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  unit: string;
  cost: number;
  price: number;
  stock: number;
  stockMin: number;
  active: boolean;
}

export interface KardexEntry {
  id: string;
  productId: string;
  type: "purchase" | "sale" | "adjustment" | "return";
  quantity: number;
  date: string;
  note?: string;
  userId?: string;
}
