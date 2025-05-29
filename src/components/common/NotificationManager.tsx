
import React from 'react';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const showNotification = (
  type: NotificationType,
  message: string,
  options: NotificationOptions = {}
) => {
  const { title, description, duration = 4000, action } = options;
  
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };
  
  const colors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  };
  
  const Icon = icons[type];
  
  const toastContent = (
    <div className="flex items-start space-x-3">
      <Icon className={`h-5 w-5 mt-0.5 ${colors[type]}`} />
      <div className="flex-1">
        {title && <div className="font-medium text-gray-900">{title}</div>}
        <div className={title ? 'text-sm text-gray-600' : 'text-gray-900'}>{message}</div>
        {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
      </div>
    </div>
  );
  
  const toastOptions: any = {
    duration,
    className: 'bg-white border shadow-lg'
  };
  
  if (action) {
    toastOptions.action = {
      label: action.label,
      onClick: action.onClick
    };
  }
  
  switch (type) {
    case 'success':
      toast.success(toastContent, toastOptions);
      break;
    case 'error':
      toast.error(toastContent, toastOptions);
      break;
    case 'warning':
      toast.warning(toastContent, toastOptions);
      break;
    case 'info':
      toast.info(toastContent, toastOptions);
      break;
  }
};

// Convenience functions
export const showSuccess = (message: string, options?: NotificationOptions) => 
  showNotification('success', message, options);

export const showError = (message: string, options?: NotificationOptions) => 
  showNotification('error', message, options);

export const showWarning = (message: string, options?: NotificationOptions) => 
  showNotification('warning', message, options);

export const showInfo = (message: string, options?: NotificationOptions) => 
  showNotification('info', message, options);

const NotificationManager: React.FC = () => {
  return null; // This component just exports utility functions
};

export default NotificationManager;
