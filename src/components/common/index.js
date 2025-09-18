// Exportar todos los componentes comunes
export { default as ErrorBoundary, withErrorBoundary, useErrorHandler, SimpleErrorFallback, ModuleErrorBoundary } from './ErrorBoundary';
export { 
  default as LoadingSpinner, 
  SmallSpinner, 
  LargeSpinner, 
  FullScreenSpinner, 
  PulseSpinner, 
  DotsSpinner, 
  SkeletonSpinner 
} from './LoadingSpinner';