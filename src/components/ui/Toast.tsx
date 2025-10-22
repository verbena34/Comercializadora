import React, { createContext, useContext, useState } from "react";

type ToastItem = { id: string; message: string };
const ToastContext = createContext<any>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  function add(message: string) {
    const t = { id: Date.now().toString(), message };
    setToasts((s) => [...s, t]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== t.id)), 3000);
  }
  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <div className="fixed right-4 bottom-4 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="bg-gray-800 text-white px-4 py-2 rounded shadow">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
