import { useToast } from '../context/ToastContext';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const G = '#1A4D2E';
const ACCENT = '#C8860A';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container" style={{
      position: 'fixed',
      top: 24,
      right: 24,
      zIndex: 100000,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      pointerEvents: 'none',
      width: 'calc(100% - 48px)',
      maxWidth: 380,
    }}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
      <style>{`
        @media (max-width: 480px) {
          .toast-container {
            top: 12px !important;
            right: 50% !important;
            transform: translateX(50%);
            width: calc(100% - 24px) !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  const icons = {
    success: <CheckCircle style={{ color: '#10B981' }} size={20} />,
    error: <AlertCircle style={{ color: '#EF4444' }} size={20} />,
    warning: <AlertTriangle style={{ color: '#F59E0B' }} size={20} />,
    info: <Info style={{ color: G }} size={20} />
  };

  const bgColors = {
    success: 'rgba(240, 253, 244, 0.95)',
    error: 'rgba(254, 242, 242, 0.95)',
    warning: 'rgba(255, 251, 235, 0.95)',
    info: 'rgba(240, 249, 255, 0.95)'
  };

  const borderColors = {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: G
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02 }}
      style={{
        pointerEvents: 'auto',
        background: '#fff',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.05)',
        borderRadius: 14,
        borderLeft: `4px solid ${borderColors[toast.type]}`,
        padding: '16px 20px',
        paddingRight: 48,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        overflow: 'hidden',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        {icons[toast.type]}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ 
          margin: 0, 
          fontSize: 14, 
          fontWeight: 600, 
          color: '#1A1A1A', 
          lineHeight: 1.5,
          fontFamily: 'Inter, sans-serif'
        }}>
          {toast.message}
        </p>
      </div>
      
      <button 
        onClick={onRemove}
        style={{
          position: 'absolute',
          top: '50%',
          right: 12,
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: '#9CA3AF',
          cursor: 'pointer',
          padding: 8,
          borderRadius: 8,
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#4B5563'; e.currentTarget.style.background = '#F3F4F6'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'none'; }}
      >
        <X size={16} />
      </button>

      {/* Progress Bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 3.5, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: borderColors[toast.type],
          transformOrigin: 'left',
          opacity: 0.6,
        }}
      />
    </motion.div>
  );
}
