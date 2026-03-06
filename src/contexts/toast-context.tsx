/**
 * Toast Notification System
 * Simple toast notifications for errors and messages
 */

'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type'], duration?: number) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'info', duration = 5000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const newToast: ToastMessage = { id, message, type, duration };

      setToasts(prev => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  const showError = useCallback(
    (message: string) => showToast(message, 'error', 7000),
    [showToast]
  );

  const showSuccess = useCallback(
    (message: string) => showToast(message, 'success', 4000),
    [showToast]
  );

  const showWarning = useCallback(
    (message: string) => showToast(message, 'warning', 6000),
    [showToast]
  );

  const showInfo = useCallback(
    (message: string) => showToast(message, 'info', 5000),
    [showToast]
  );

  const clearToasts = useCallback(() => setToasts([]), []);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        showError,
        showSuccess,
        showWarning,
        showInfo,
        removeToast,
        clearToasts,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto
            px-4 py-3 rounded-xl shadow-lg
            flex items-center gap-3
            animate-in slide-in-from-bottom
            max-w-md w-full
            ${toast.type === 'error' ? 'bg-red-500/90 text-white' : ''}
            ${toast.type === 'success' ? 'bg-green-500/90 text-white' : ''}
            ${toast.type === 'warning' ? 'bg-amber-500/90 text-white' : ''}
            ${toast.type === 'info' ? 'bg-blue-500/90 text-white' : ''}
          `}
        >
          {/* Icon */}
          <span className="text-lg">
            {toast.type === 'error' && '⚠️'}
            {toast.type === 'success' && '✅'}
            {toast.type === 'warning' && '⚡'}
            {toast.type === 'info' && 'ℹ️'}
          </span>

          {/* Message */}
          <p className="flex-1 text-sm font-medium text-right">{toast.message}</p>

          {/* Close button */}
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
