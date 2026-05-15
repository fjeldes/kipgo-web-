'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: '#ecfdf5', border: '#22c55e', icon: '#22c55e' },
  error: { bg: '#fef2f2', border: '#dc2626', icon: '#dc2626' },
  warning: { bg: '#fffbeb', border: '#d97706', icon: '#d97706' },
  info: { bg: '#eef2ff', border: '#1a237e', icon: '#1a237e' },
};

let nextId = 0;

const ToastContext = createContext<(type: ToastType, message: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
        {toasts.map((toast) => {
          const c = COLORS[toast.type];
          const Icon = ICONS[toast.type];
          return (
            <div key={toast.id} className="flex items-start gap-3 px-5 py-4 rounded-2xl shadow-xl border-l-4 animate-slide-up" style={{ background: c.bg, borderLeftColor: c.border }}>
              <Icon size={20} style={{ color: c.icon, flexShrink: 0 }} />
              <p className="text-sm font-medium flex-1" style={{ color: '#1a1c1c' }}>{toast.message}</p>
              <button onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} style={{ color: '#767683' }}>
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
