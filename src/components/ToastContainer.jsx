import { useToast } from '../context/ToastContext';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  const icons = {
    success: <CheckCircle className="text-brand-success" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
    info: <Info className="text-brand-primary" size={20} />
  };

  const borderColors = {
    success: 'border-l-brand-success',
    error: 'border-l-red-500',
    warning: 'border-l-amber-500',
    info: 'border-l-brand-primary'
  };

  const progressColors = {
    success: 'bg-brand-success',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-brand-primary'
  };

  return (
    <div className={`pointer-events-auto w-80 bg-white shadow-card rounded-md border-l-4 ${borderColors[toast.type]} overflow-hidden animate-slide-in relative flex items-start p-4 pr-10`}>
      <div className="flex-shrink-0 mr-3 mt-0.5">
        {icons[toast.type]}
      </div>
      <p className="text-[14px] font-medium text-brand-textPrimary flex-1">{toast.message}</p>
      
      <button 
        onClick={onRemove}
        className="absolute top-4 right-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>

      <div className={`absolute bottom-0 left-0 h-1 ${progressColors[toast.type]} animate-[shrink_3.5s_linear_forwards] w-full origin-left`}></div>
    </div>
  );
}
