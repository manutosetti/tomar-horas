import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import clsx from 'clsx';

const Input = forwardRef(({ 
  label, 
  error, 
  success,
  hint,
  icon: Icon,
  rightIcon: RightIcon,
  className,
  inputClassName,
  type = 'text',
  size = 'md',
  variant = 'default',
  fullWidth = true,
  required = false,
  showPasswordToggle = false,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const sizes = {
    sm: 'py-2 text-sm min-h-[36px]',
    md: 'py-3 text-sm min-h-[44px]',
    lg: 'py-4 text-base min-h-[52px]'
  };

  const variants = {
    default: [
      'glass border-0 bg-white/5',
      'focus:bg-white/10 focus:ring-2 focus:ring-blue-500'
    ].join(' '),
    
    outlined: [
      'bg-transparent border-2 border-white/20',
      'focus:border-blue-500 focus:bg-white/5'
    ].join(' '),
    
    filled: [
      'bg-gray-800/50 border border-gray-700/50',
      'focus:bg-gray-800/80 focus:border-blue-500'
    ].join(' ')
  };

  const baseInputClasses = [
    'block w-full rounded-lg text-white placeholder-gray-400',
    'transition-all duration-200 focus:outline-none',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ].join(' ');

  return (
    <div className={clsx('space-y-2', !fullWidth && 'inline-block')}>
      {/* Label */}
      {label && (
        <motion.label
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={clsx(
            'block text-sm font-medium text-gray-200',
            required && 'after:content-["*"] after:text-red-400 after:ml-1'
          )}
        >
          {label}
        </motion.label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={clsx(
              'text-gray-400',
              size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
            )} />
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={clsx(
            baseInputClasses,
            variants[variant],
            sizes[size],
            Icon && 'pl-10',
            (RightIcon || showPasswordToggle || type === 'password') && 'pr-10',
            error && 'ring-2 ring-red-500 border-red-500',
            success && 'ring-2 ring-green-500 border-green-500',
            focused && 'ring-offset-2 ring-offset-black',
            inputClassName
          )}
          {...props}
        />

        {/* Right Icons */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
          {/* Success Icon */}
          {success && !error && (
            <Check className="w-5 h-5 text-green-400" />
          )}

          {/* Error Icon */}
          {error && (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}

          {/* Password Toggle */}
          {(type === 'password' || showPasswordToggle) && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-white transition-colors focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Custom Right Icon */}
          {RightIcon && !error && !success && (
            <RightIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-1">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 flex items-center space-x-1"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.p>
        )}

        {success && !error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-green-400 flex items-center space-x-1"
          >
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </motion.p>
        )}

        {hint && !error && !success && (
          <p className="text-sm text-gray-400">{hint}</p>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';

// Componente Textarea
export const Textarea = forwardRef(({
  label,
  error,
  hint,
  className,
  rows = 4,
  resize = 'vertical',
  ...props
}, ref) => {
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-200">
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        className={clsx(
          'block w-full glass rounded-lg border-0 py-3 px-4 text-white placeholder-gray-400',
          'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black',
          'transition-all duration-200',
          resizeClasses[resize],
          error && 'ring-2 ring-red-500',
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-400 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </p>
      )}
      
      {hint && !error && (
        <p className="text-sm text-gray-400">{hint}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Componente Select
export const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = "Selecciona una opción",
  className,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-200">
          {label}
        </label>
      )}
      
      <select
        ref={ref}
        className={clsx(
          'block w-full glass rounded-lg border-0 py-3 px-4 text-white',
          'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black',
          'transition-all duration-200 cursor-pointer',
          error && 'ring-2 ring-red-500',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled className="bg-gray-800">
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option 
            key={option.value || index} 
            value={option.value}
            className="bg-gray-800"
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-sm text-red-400 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// Componente Checkbox
export const Checkbox = forwardRef(({
  label,
  error,
  className,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <input
          ref={ref}
          type="checkbox"
          className={clsx(
            'w-4 h-4 rounded border-gray-300 text-blue-600',
            'focus:ring-blue-500 focus:ring-offset-black',
            'bg-gray-700 border-gray-600',
            className
          )}
          {...props}
        />
        {label && (
          <label className="text-sm font-medium text-gray-200">
            {label}
          </label>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-400 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Input;