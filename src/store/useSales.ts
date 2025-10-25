import { create } from 'zustand';

interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

interface Sale {
  id: string;
  customerName: string;
  date: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: "pending" | "completed" | "cancelled";
  paymentMethod: "efectivo" | "tarjeta" | "transferencia";
  transferenceImage?: string;
  fromQuote?: string;
}

interface SalesState {
  sales: Sale[];
  setSales: (sales: Sale[]) => void;
  addSale: (sale: Sale) => void;
  updateSale: (id: string, updates: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  getTodaySales: () => Sale[];
  getCompletedSales: () => Sale[];
  getTotalRevenue: () => number;
  getAverageSale: () => number;
}

// Datos iniciales con fechas dinámicas
const initialSales: Sale[] = [
  {
    id: "V001",
    customerName: "Carlos Martínez",
    date: new Date().toISOString().split('T')[0],
    items: [
      { id: "1", productId: "P001", productName: "Martillo 16oz", quantity: 2, price: 25.00, discount: 0, total: 50.00 },
      { id: "2", productId: "P002", productName: "Destornillador Phillips", quantity: 3, price: 12.00, discount: 2.00, total: 34.00 }
    ],
    subtotal: 84.00,
    discount: 2.00,
    tax: 9.84,
    total: 91.84,
    status: "completed",
    paymentMethod: "efectivo"
  },
  {
    id: "V002",
    customerName: "Ana García",
    date: new Date().toISOString().split('T')[0],
    items: [
      { id: "3", productId: "P003", productName: "Taladro Eléctrico", quantity: 1, price: 180.00, discount: 20.00, total: 160.00 }
    ],
    subtotal: 160.00,
    discount: 20.00,
    tax: 16.80,
    total: 176.80,
    status: "completed",
    paymentMethod: "tarjeta"
  },
  {
    id: "V003",
    customerName: "Roberto Silva",
    date: new Date().toISOString().split('T')[0],
    items: [
      { id: "4", productId: "P007", productName: "Caja de Tornillos", quantity: 3, price: 15.00, discount: 0, total: 45.00 }
    ],
    subtotal: 45.00,
    discount: 0,
    tax: 5.40,
    total: 50.40,
    status: "completed",
    paymentMethod: "efectivo"
  },
  {
    id: "V004",
    customerName: "Luis Hernández",
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Ayer
    items: [
      { id: "5", productId: "P004", productName: "Sierra Circular", quantity: 1, price: 320.00, discount: 0, total: 320.00 },
      { id: "6", productId: "P005", productName: "Discos de Corte", quantity: 5, price: 8.00, discount: 0, total: 40.00 }
    ],
    subtotal: 360.00,
    discount: 0,
    tax: 43.20,
    total: 403.20,
    status: "completed",
    paymentMethod: "transferencia"
  }
];

export const useSales = create<SalesState>((set, get) => ({
  sales: initialSales,
  
  setSales: (sales) => set({ sales }),
  
  addSale: (sale) => set((state) => ({ 
    sales: [sale, ...state.sales] 
  })),
  
  updateSale: (id, updates) => set((state) => ({
    sales: state.sales.map(sale => 
      sale.id === id ? { ...sale, ...updates } : sale
    )
  })),
  
  deleteSale: (id) => set((state) => ({
    sales: state.sales.filter(sale => sale.id !== id)
  })),
  
  getTodaySales: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().sales.filter(s => s.date === today && s.status === "completed");
  },
  
  getCompletedSales: () => {
    return get().sales.filter(s => s.status === "completed");
  },
  
  getTotalRevenue: () => {
    return get().getCompletedSales().reduce((sum, sale) => sum + sale.total, 0);
  },
  
  getAverageSale: () => {
    const completedSales = get().getCompletedSales();
    return completedSales.length > 0 ? get().getTotalRevenue() / completedSales.length : 0;
  }
}));