import { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X, Clock, ThumbsUp } from 'lucide-react';
import { haptics } from '../utils/haptics';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  action?: ToastAction;
  duration?: number;
  onDismiss: (id: string) => void;
}

export function Toast({ 
  id, 
  type, 
  title, 
  message, 
  action, 
  duration = 5000, 
  onDismiss 
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <div
      className={`
        bg-white dark:bg-[#1A1A1A] 
        border border-gray-200 dark:border-[#333333] 
        border-l-4 ${getBorderColor()}
        rounded-lg shadow-lg dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)]
        p-4 min-w-[320px] max-w-[420px]
        animate-slide-in-right
      `}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm text-gray-900 dark:text-white">
              {title}
            </h4>
            <button
              onClick={() => {
                haptics.light();
                onDismiss(id);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {message && (
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
              {message}
            </p>
          )}
          
          {action && (
            <button
              onClick={() => {
                haptics.medium();
                action.onClick();
                onDismiss(id);
              }}
              className="mt-2 text-xs text-[#ec1e24] hover:text-[#ec1e24]/80 font-medium"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Toast container component
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message?: string;
    action?: ToastAction;
    duration?: number;
  }>;
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            action={toast.action}
            duration={toast.duration}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </div>
  );
}
