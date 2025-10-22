import { create } from "zustand";
import { mockCategories, mockKardex, mockProducts, mockUnits } from "../lib/mock";
import { KardexEntry, Product } from "../types/product";

interface CatalogState {
  products: Product[];
  categories: string[];
  units: string[];
  kardex: KardexEntry[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  adjustStock: (productId: string, quantity: number, note: string) => void;
  addKardexEntry: (entry: Omit<KardexEntry, "id">) => void;
}

export const useCatalog = create<CatalogState>((set, get) => ({
  products: [...mockProducts],
  categories: [...mockCategories],
  units: [...mockUnits],
  kardex: [...mockKardex],

  addProduct: (product) => {
    const newProduct = { ...product, id: Date.now().toString() };
    set((state) => ({ products: [...state.products, newProduct] }));
  },

  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },

  adjustStock: (productId, quantity, note) => {
    const product = get().products.find((p) => p.id === productId);
    if (!product) return;

    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, stock: p.stock + quantity } : p
      ),
    }));

    get().addKardexEntry({
      productId,
      type: "adjustment",
      quantity,
      date: new Date().toISOString(),
      note,
    });
  },

  addKardexEntry: (entry) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    set((state) => ({ kardex: [...state.kardex, newEntry] }));
  },
}));
