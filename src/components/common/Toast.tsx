import React, { useEffect, useState } from 'react';
import { useToast, Toast as ToastType } from '../../contexts/ToastContext';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface ToastItemProps {
  toast: ToastType;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Handle auto-dismiss
    if (toast.duration && toast.duration > 0) {
      const exitTimer = setTimeout(() => {
        handleClose();
      }, toast.duration - 300); // Start exit animation 300ms before removal

      return () => clearTimeout(exitTimer);
    }
  }, [toast.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 300); // Match animation duration
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" aria-hidden="true" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" aria-hidden="true" />;
      case 'info':
        return <Info className="w-5 h-5" aria-hidden="true" />;
      default:
        return null;
    }
  };

  const getStyles = () => {
    const baseStyles = 'min-w-[320px] max-w-md p-4 rounded-lg shadow-lg backdrop-blur-sm border-l-4 flex items-start gap-3 transition-all duration-300 ease-in-out';
    
    const typeStyles = {
      success: 'bg-green-50 border-green-500 text-green-900',
      error: 'bg-red-50 border-red-500 text-red-900',
      warning: 'bg-yellow-50 border-yellow-500 text-yellow-900',
      info: 'bg-blue-50 border-blue-500 text-blue-900',
    };

    const animationClasses = isExiting
      ? 'translate-x-full opacity-0'
      : isVisible
      ? 'translate-x-0 opacity-100'
      : 'translate-x-full opacity-0';

    return `${baseStyles} ${typeStyles[toast.type]} ${animationClasses}`;
  };

  const getIconColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={getStyles()}
    >
      <div className={`flex-shrink-0 ${getIconColor()}`}>
        {getIcon()}
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button
        onClick={handleClose}
        className={`flex-shrink-0 rounded-md p-1 inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
          toast.type === 'success'
            ? 'hover:bg-green-200 focus:ring-green-500'
            : toast.type === 'error'
            ? 'hover:bg-red-200 focus:ring-red-500'
            : toast.type === 'warning'
            ? 'hover:bg-yellow-200 focus:ring-yellow-500'
            : 'hover:bg-blue-200 focus:ring-blue-500'
        }`}
        aria-label="Dismiss notification"
      >
        <X className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

