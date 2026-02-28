"use client";

/**
 * Toast — lightweight notification system.
 *
 * Usage:
 *   import { showToast } from '@/components/Toast';
 *   showToast('Portfolio created!', 'success');
 */

import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import { TOAST_DURATION } from "@/lib/constants";

const ToastContext = createContext(null);

let _globalShowToast = () => {};

/**
 * Show a toast notification from anywhere (even outside React).
 */
export function showToast(message, type = "info") {
  _globalShowToast(message, type);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  // Expose globally
  useEffect(() => {
    _globalShowToast = addToast;
  }, [addToast]);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map((t) => (
            <div key={t.id} className={`toast ${t.type}`}>
              {t.message}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
