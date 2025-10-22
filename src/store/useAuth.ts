import { create } from "zustand";

interface AuthState {
  role: "admin" | "employee" | null;
  setRole: (role: "admin" | "employee") => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
  logout: () => set({ role: null }),
}));
