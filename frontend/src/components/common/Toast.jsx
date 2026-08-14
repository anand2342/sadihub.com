import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
export const ToastContainer = ({ toasts, onClose }) => {
    return (<div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map(toast => (<ToastItem key={toast.id} toast={toast} onClose={() => onClose(toast.id)}/>))}
    </div>);
};
const ToastItem = ({ toast, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);
    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/>,
        error: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0"/>,
        info: <Info className="w-5 h-5 text-amber-600 shrink-0"/>
    };
    return (<div className="pointer-events-auto bg-[var(--bg-card)] border border-[var(--border-gold)] rounded-xl p-4 shadow-xl flex items-center gap-3 backdrop-blur-md transition-all duration-300 animate-slide-up">
      {icons[toast.type]}
      <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)] flex-1 leading-snug">
        {toast.message}
      </p>
      <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg transition-colors cursor-pointer">
        <X className="w-4 h-4"/>
      </button>
    </div>);
};
