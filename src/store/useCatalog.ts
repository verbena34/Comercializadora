import { create } from "zustand";
import { mockKardex, mockProducts } from "../lib/mock";
import { KardexEntry, Product } from "../types/product";

interface CategoryStructure {
  [key: string]: string[];
}

const defaultCategories: CategoryStructure = {
  "Tecnología": ["Computadoras", "Accesorios", "Celulares", "Electrónica"],
  "Venta de Ropa": ["Hombre", "Mujer", "Niños", "Accesorios"],
  "Bodega": ["Alimentos", "Bebidas", "Limpieza", "Suministros"],
  "Comercio": ["Papelería", "Hogar", "Oficina", "Otros"]
};

interface CatalogState {
  products: Product[];
  categoryStructure: CategoryStructure;
  customCategories: CategoryStructure;
  kardex: KardexEntry[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  adjustStock: (productId: string, quantity: number, note: string) => void;
  addKardexEntry: (entry: Omit<KardexEntry, "id">) => void;
  addCustomCategory: (category: string, subcategories?: string[]) => void;
  addSubcategory: (category: string, subcategory: string) => void;
  getAllCategories: () => string[];
  getSubcategories: (category: string) => string[];
}

export const useCatalog = create<CatalogState>((set, get) => ({
  products: [...mockProducts],
  categoryStructure: { ...defaultCategories },
  customCategories: {},
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

  addCustomCategory: (category, subcategories = []) => {
    set((state) => ({
      customCategories: {
        ...state.customCategories,
        [category]: subcategories
      }
    }));
  },

  addSubcategory: (category, subcategory) => {
    set((state) => {
      const currentSubs = get().getSubcategories(category);
      if (!currentSubs.includes(subcategory)) {
        const isCustom = category in state.customCategories;
        if (isCustom) {
          return {
            customCategories: {
              ...state.customCategories,
              [category]: [...currentSubs, subcategory]
            }
          };
        } else {
          return {
            categoryStructure: {
              ...state.categoryStructure,
              [category]: [...currentSubs, subcategory]
            }
          };
        }
      }
      return state;
    });
  },

  getAllCategories: () => {
    const state = get();
    return [...Object.keys(state.categoryStructure), ...Object.keys(state.customCategories)];
  },

  getSubcategories: (category) => {
    const state = get();
    return state.categoryStructure[category] || state.customCategories[category] || [];
  },
}));
