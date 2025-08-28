import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  text = null,
  fullScreen = false,
  className = '',
  ...props 
}) => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colors = {
    primary: 'text-blue-500',
    secondary: 'text-purple-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const SpinnerComponent = (
    <motion.div
      className={clsx(
        'flex flex-col items-center justify-center',
        fullScreen && 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50',
        !fullScreen && 'p-4',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      {...props}
    >
      {/* Spinner principal */}
      <motion.div
        className={clsx(
          'relative',
          sizes[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Círculo exterior */}
        <div className={clsx(
          'absolute inset-0 rounded-full border-4 border-transparent',
          `border-t-current ${colors[color]}`,
          'opacity-75'
        )} />
        
        {/* Círculo interior para efecto doble */}
        <motion.div
          className={clsx(
            'absolute inset-2 rounded-full border-2 border-transparent',
            `border-b-current ${colors[color]}`,
            'opacity-50'
          )}
          animate={{ rotate: -360 }}
          transition={{
            duration: 0.75,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>

      {/* Texto de carga */}
      {text && (
        <motion.p
          className={clsx(
            'mt-4 font-medium',
            colors[color],
            textSizes[size]
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}

      {/* Puntos animados debajo del texto */}
      {text && (
        <div className="flex space-x-1 mt-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={clsx(
                'w-1 h-1 rounded-full',
                colors[color].replace('text-', 'bg-')
              )}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );

  return SpinnerComponent;
};

// Variantes específicas del spinner
export const SmallSpinner = (props) => (
  <LoadingSpinner size="sm" {...props} />
);

export const LargeSpinner = (props) => (
  <LoadingSpinner size="lg" text="Cargando..." {...props} />
);

export const FullScreenSpinner = (props) => (
  <LoadingSpinner 
    size="xl" 
    fullScreen 
    text="Cargando sistema..." 
    {...props} 
  />
);

// Spinner con efecto de pulso
export const PulseSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colors = {
    primary: 'bg-blue-500',
    secondary: 'bg-purple-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div className="relative">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={clsx(
              'absolute inset-0 rounded-full',
              colors[color],
              sizes[size]
            )}
            animate={{
              scale: [1, 2, 1],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2
            }}
          />
        ))}
        <div className={clsx(
          'relative rounded-full',
          colors[color],
          sizes[size]
        )} />
      </div>
    </div>
  );
};

// Spinner tipo dots
export const DotsSpinner = ({ color = 'primary', className = '' }) => {
  const colors = {
    primary: 'bg-blue-500',
    secondary: 'bg-purple-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className={clsx('flex items-center space-x-2', className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={clsx(
            'w-3 h-3 rounded-full',
            colors[color]
          )}
          animate={{
            y: [-8, 8, -8],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.15
          }}
        />
      ))}
    </div>
  );
};

// Spinner tipo skeleton para cargar contenido
export const SkeletonSpinner = ({ lines = 3, className = '' }) => {
  return (
    <div className={clsx('space-y-3 animate-pulse', className)}>
      {Array.from({ length: lines }, (_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;