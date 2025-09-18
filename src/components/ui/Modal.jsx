import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Check, Info, AlertCircle } from 'lucide-react';
import Button from './Button';
import clsx from 'clsx';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  variant = 'default',
  closeOnEscape = true,
  closeOnBackdrop = true,
  showCloseButton = true,
  className,
  ...props 
}) => {
  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  const variants = {
    default: 'glass-strong',
    solid: 'bg-gray-800 border border-gray-700',
    blur: 'glass-strong backdrop-blur-xl'
  };

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
                      <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />

          {/* Modal Container */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={clsx(
                'relative w-full rounded-xl shadow-2xl',
                variants[variant],
                sizes[size],
                className
              )}
              {...props}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  {title && (
                    <h3 className="text-xl font-semibold text-white">
                      {title}
                    </h3>
                  )}
                  {showCloseButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="p-2 hover:bg-white/10 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className={clsx(
                'p-6',
                (title || showCloseButton) && 'pt-0'
              )}>
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Modal de confirmación
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Estás seguro?",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = 'danger',
  loading = false
}) => {
  const typeConfig = {
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-red-400',
      confirmVariant: 'danger'
    },
    warning: {
      icon: AlertCircle,
      iconColor: 'text-yellow-400',
      confirmVariant: 'warning'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-400',
      confirmVariant: 'primary'
    },
    success: {
      icon: Check,
      iconColor: 'text-green-400',
      confirmVariant: 'success'
    }
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnEscape={!loading}
      closeOnBackdrop={!loading}
    >
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-gray-800/50 mb-4">
          <IconComponent className={clsx('w-6 h-6', config.iconColor)} />
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">
          {title}
        </h3>
        
        {message && (
          <p className="text-gray-400 mb-6">
            {message}
          </p>
        )}
        
        <div className="flex space-x-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Modal de formulario
export const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitText = "Guardar",
  cancelText = "Cancelar",
  loading = false,
  size = 'md'
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      closeOnEscape={!loading}
      closeOnBackdrop={!loading}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {children}
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {submitText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Modal drawer (deslizable desde el lado)
export const DrawerModal = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md'
}) => {
  const positions = {
    right: {
      containerClass: 'justify-end',
      motionProps: {
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { x: '100%' }
      }
    },
    left: {
      containerClass: 'justify-start',
      motionProps: {
        initial: { x: '-100%' },
        animate: { x: 0 },
        exit: { x: '-100%' }
      }
    },
    top: {
      containerClass: 'items-start',
      motionProps: {
        initial: { y: '-100%' },
        animate: { y: 0 },
        exit: { y: '-100%' }
      }
    },
    bottom: {
      containerClass: 'items-end',
      motionProps: {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' }
      }
    }
  };

  const drawerSizes = {
    sm: position === 'right' || position === 'left' ? 'w-80' : 'h-80',
    md: position === 'right' || position === 'left' ? 'w-96' : 'h-96',
    lg: position === 'right' || position === 'left' ? 'w-[32rem]' : 'h-[32rem]',
    xl: position === 'right' || position === 'left' ? 'w-[40rem]' : 'h-[40rem]'
  };

  const config = positions[position];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Container */}
          <div className={clsx('fixed inset-0 flex', config.containerClass)}>
            <motion.div
              {...config.motionProps}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className={clsx(
                'h-full glass-strong shadow-2xl flex flex-col',
                drawerSizes[size],
                (position === 'top' || position === 'bottom') && 'w-full'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white">
                  {title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;