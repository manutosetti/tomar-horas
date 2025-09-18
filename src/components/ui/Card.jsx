import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = ({ 
  children, 
  className, 
  hover = true,
  padding = 'md',
  variant = 'default',
  ...props 
}) => {
  const paddingSizes = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const variants = {
    default: 'glass border border-white/10',
    solid: 'bg-gray-800/90 border border-gray-700/50',
    outlined: 'bg-transparent border-2 border-white/20',
    elevated: 'glass border border-white/10 shadow-2xl shadow-black/20',
    gradient: 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-white/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'rounded-xl backdrop-blur-lg',
        variants[variant],
        paddingSizes[padding],
        hover && 'hover-lift hover:bg-white/5 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Componentes derivados para casos específicos
export const CardHeader = ({ children, className, ...props }) => (
  <div 
    className={clsx(
      'pb-4 border-b border-white/10 mb-4',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, className, level = 2, ...props }) => {
  const Component = `h${level}`;
  const sizes = {
    1: 'text-2xl font-bold',
    2: 'text-xl font-semibold',
    3: 'text-lg font-medium',
    4: 'text-base font-medium',
    5: 'text-sm font-medium',
    6: 'text-xs font-medium'
  };

  return (
    <Component 
      className={clsx(
        'text-white',
        sizes[level],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export const CardDescription = ({ children, className, ...props }) => (
  <p 
    className={clsx(
      'text-gray-400 text-sm mt-1',
      className
    )}
    {...props}
  >
    {children}
  </p>
);

export const CardContent = ({ children, className, ...props }) => (
  <div 
    className={clsx(
      'space-y-4',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div 
    className={clsx(
      'pt-4 border-t border-white/10 mt-4 flex items-center justify-between',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Tarjeta con estadísticas
export const StatCard = ({ 
  title, 
  value, 
  change, 
  trend = 'neutral',
  icon: Icon,
  className,
  ...props 
}) => {
  const trendColors = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-gray-400'
  };

  const trendIcons = {
    positive: '↗',
    negative: '↘',
    neutral: '→'
  };

  return (
    <Card 
      className={clsx('relative overflow-hidden', className)}
      hover={true}
      {...props}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            {title}
          </h3>
          {Icon && (
            <div className="p-2 bg-white/5 rounded-lg">
              <Icon className="w-5 h-5 text-blue-400" />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-3xl font-bold text-white">
            {value}
          </p>
          
          {change && (
            <div className="flex items-center space-x-1">
              <span className={clsx('text-sm', trendColors[trend])}>
                {trendIcons[trend]} {change}
              </span>
              <span className="text-xs text-gray-500">vs período anterior</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Tarjeta interactiva
export const InteractiveCard = ({ 
  children, 
  onClick, 
  className,
  selected = false,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={clsx(
        'cursor-pointer transition-all duration-300',
        selected && 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black'
      )}
    >
      <Card 
        className={clsx(
          'hover:bg-white/10',
          className
        )}
        hover={false}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
};

// Tarjeta con imagen
export const ImageCard = ({ 
  src, 
  alt, 
  children, 
  className,
  imageClassName,
  overlay = false,
  ...props 
}) => {
  return (
    <Card 
      className={clsx('overflow-hidden', className)}
      padding="none"
      {...props}
    >
      <div className="relative">
        <img 
          src={src} 
          alt={alt}
          className={clsx(
            'w-full h-48 object-cover',
            imageClassName
          )}
        />
        
        {overlay && (
          <div className="absolute inset-0 bg-black/50" />
        )}
        
        {children && (
          <div className={clsx(
            'p-6',
            overlay && 'absolute bottom-0 left-0 right-0 text-white'
          )}>
            {children}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;