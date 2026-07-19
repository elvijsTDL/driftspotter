"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  toast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] space-y-2" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  // Opaque tinted-dark backgrounds (surface #111 + ~20% accent) — translucent
  // tints made toasts see-through over page content
  const colors = {
    success: "bg-[#143520] border-badge-grassroots/30 text-badge-grassroots",
    error: "bg-[#3D1B1B] border-red-500/30 text-red-400",
    info: "bg-[#0E3841] border-drift-cyan/30 text-drift-cyan",
  };

  return (
    <div role={toast.type === "error" ? "alert" : "status"} className={`px-4 py-3 rounded-xl border shadow-lg text-sm font-medium animate-fade-in-up ${colors[toast.type]}`}>
      {toast.message}
    </div>
  );
}

export const useToast = () => useContext(ToastContext);
