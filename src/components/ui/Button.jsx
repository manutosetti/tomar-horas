import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/common';
import clsx from 'clsx';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  fullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className, 
  onClick,
  ...props 
}, ref) => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium rounded-lg',
    'transition-all duration-300 focus:outline-none focus:ring-2',
    'focus:ring-offset-2 focus:ring-offset-black',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'select-none relative overflow-hidden'
  ].join(' ');
  
  const variants = {
    primary: [
      'bg-gradient-primary text-white shadow-lg',
      'hover:shadow-xl hover:shadow-blue-500/25',
      'focus:ring-blue-500 active:bg-blue-700'
    ].join(' '),
    
    secondary: [
      'glass text-white border border-white/10',
      'hover:bg-white/10 hover:border-white/20',
      'focus:ring-white/50 active:bg-white/20'
    ].join(' '),
    
    outline: [
      'border-2 border-white/20 text-white bg-transparent',
      'hover:bg-white/5 hover:border-white/40',
      'focus:ring-white/50 active:bg-white/10'
    ].join(' '),
    
    ghost: [
      'text-white bg-transparent',
      'hover:bg-white/5 active:bg-white/10',
      'focus:ring-white/50'
    ].join(' '),
    
    danger: [
      'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg',
      'hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-500/25',
      'focus:ring-red-500 active:from-red-800 active:to-red-900'
    ].join(' '),
    
    success: [
      'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg',
      'hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:shadow-green-500/25',
      'focus:ring-green-500 active:from-green-800 active:to-green-900'
    ].join(' '),
    
    warning: [
      'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg',
      'hover:from-yellow-700 hover:to-yellow-800 hover:shadow-xl hover:shadow-yellow-500/25',
      'focus:ring-yellow-500 active:from-yellow-800 active:to-yellow-900'
    ].join(' ')
  };
  
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs min-h-[28px]',
    sm: 'px-3 py-2 text-sm min-h-[32px]',
    md: 'px-4 py-2.5 text-sm min-h-[40px]',
    lg: 'px-6 py-3 text-base min-h-[44px]',
    xl: 'px-8 py-4 text-lg min-h-[52px]'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <motion.button
      ref={ref}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      disabled={disabled || loading}
      onClick={handleClick}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {/* Efecto de ripple */}
      <span className="absolute inset-0 overflow-hidden rounded-lg">
        <span className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-active:opacity-20" />
      </span>

      {/* Contenido del botón */}
      <span className="relative flex items-center justify-center space-x-2">
        {loading && (
          <LoadingSpinner 
            size="sm" 
            color="white" 
            className={iconSizes[size]} 
          />
        )}
        
        {LeftIcon && !loading && (
          <LeftIcon className={clsx(iconSizes[size], 'flex-shrink-0')} />
        )}
        
        {children && (
          <span className="truncate">{children}</span>
        )}
        
        {RightIcon && !loading && (
          <RightIcon className={clsx(iconSizes[size], 'flex-shrink-0')} />
        )}
      </span>
    </motion.button>
  );
});

Button.displayName = 'Button';

// Componentes derivados para casos de uso específicos
export const IconButton = forwardRef(({ 
  icon: Icon, 
  size = 'md', 
  variant = 'ghost',
  'aria-label': ariaLabel,
  ...props 
}, ref) => {
  const iconOnlySizes = {
    xs: 'p-1.5 min-h-[28px] w-7',
    sm: 'p-2 min-h-[32px] w-8',
    md: 'p-2.5 min-h-[40px] w-10',
    lg: 'p-3 min-h-[44px] w-11',
    xl: 'p-4 min-h-[52px] w-13'
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      className={clsx(iconOnlySizes[size], props.className)}
      aria-label={ariaLabel}
      {...props}
    >
      {Icon && <Icon className="w-full h-full" />}
    </Button>
  );
});

IconButton.displayName = 'IconButton';

export const ButtonGroup = ({ children, className, orientation = 'horizontal' }) => {
  return (
    <div 
      className={clsx(
        'flex',
        orientation === 'horizontal' ? 'space-x-2' : 'flex-col space-y-2',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Button;