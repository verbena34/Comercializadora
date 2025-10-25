export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  stock: number;
  stockMin: number;
  active: boolean;
  image?: string;
  images?: string[];
  description?: string;
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
