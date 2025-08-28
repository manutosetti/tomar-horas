import React, { Component } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug, Mail } from 'lucide-react';
import { Button, Card } from '@/components/ui';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false
    };
  }

  static getDerivedStateFromError(error) {
    // Actualizar el estado para mostrar la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Capturar detalles del error
    this.setState({
      error,
      errorInfo
    });

    // Log del error (en producción enviarías esto a un servicio de monitoreo)
    this.logError(error, errorInfo);
  }

  logError = (error, errorInfo) => {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // En producción, enviarías esto a un servicio como Sentry
    console.error('Error Boundary caught an error:', errorDetails);
    
    // Simular envío de error a servicio de monitoreo
    if (process.env.NODE_ENV === 'production') {
      // this.sendErrorToService(errorDetails);
    }
  };

  handleRetry = () => {
    this.setState({ isRetrying: true });
    
    // Simular un reintento con un pequeño delay
    setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false
      });
    }, 1000);
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  handleReportBug = () => {
    const subject = encodeURIComponent('Error en Sistema de Gestión de Horas');
    const body = encodeURIComponent(`
Detalles del Error:
-------------------
Mensaje: ${this.state.error?.message || 'No disponible'}
Página: ${window.location.href}
Fecha: ${new Date().toLocaleString()}
Navegador: ${navigator.userAgent}

Descripción adicional:
(Por favor describe qué estabas haciendo cuando ocurrió el error)
    `);
    
    window.open(`mailto:soporte@sistema.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, showDetails = false } = this.props;
      
      // Si hay un componente fallback personalizado, usarlo
      if (Fallback) {
        return (
          <Fallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
            isRetrying={this.state.isRetrying}
          />
        );
      }

      // UI de error por defecto
      return (
        <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg"
          >
            <Card className="text-center p-8">
              {/* Icono de error animado */}
              <motion.div
                className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              >
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </motion.div>

              {/* Título del error */}
              <h1 className="text-2xl font-bold text-white mb-3">
                ¡Oops! Algo salió mal
              </h1>
              
              {/* Descripción */}
              <p className="text-gray-400 mb-6">
                Se ha producido un error inesperado. Nuestro equipo ha sido notificado 
                automáticamente. Puedes intentar recargar la página o volver al inicio.
              </p>

              {/* Mensaje de error (solo en desarrollo) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
                  <h3 className="text-red-400 font-medium mb-2">Error de Desarrollo:</h3>
                  <code className="text-sm text-red-300 break-all">
                    {this.state.error.message}
                  </code>
                </div>
              )}

              {/* Botones de acción */}
              <div className="space-y-3">
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="primary"
                    onClick={this.handleRetry}
                    disabled={this.state.isRetrying}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${this.state.isRetrying ? 'animate-spin' : ''}`} />
                    <span>{this.state.isRetrying ? 'Reintentando...' : 'Reintentar'}</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={this.handleGoHome}
                    className="flex items-center space-x-2"
                  >
                    <Home className="w-4 h-4" />
                    <span>Ir al Inicio</span>
                  </Button>
                </div>

                {/* Botón para reportar error */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={this.handleReportBug}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white"
                >
                  <Bug className="w-3 h-3" />
                  <span>Reportar este error</span>
                </Button>
              </div>

              {/* Detalles técnicos (solo si showDetails está habilitado) */}
              {showDetails && this.state.error && (
                <motion.details
                  className="mt-6 text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <summary className="cursor-pointer text-gray-400 hover:text-white font-medium">
                    Ver detalles técnicos
                  </summary>
                  <div className="mt-3 p-4 bg-gray-800/50 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">Mensaje:</h4>
                        <p className="text-xs text-gray-400 font-mono">
                          {this.state.error.message}
                        </p>
                      </div>
                      
                      {this.state.error.stack && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-300">Stack Trace:</h4>
                          <pre className="text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                      
                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-300">Component Stack:</h4>
                          <pre className="text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.details>
              )}

              {/* Footer con información adicional */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-500">
                  Si el problema persiste, contacta al soporte técnico: 
                  <button
                    onClick={() => window.open('mailto:soporte@sistema.com')}
                    className="text-blue-400 hover:text-blue-300 ml-1"
                  >
                    soporte@sistema.com
                  </button>
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      );
    }

    // Renderizar children normalmente si no hay error
    return this.props.children;
  }
}

// HOC para capturar errores en componentes funcionales
export const withErrorBoundary = (Component, errorBoundaryConfig = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryConfig}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook personalizado para manejar errores en componentes funcionales
export const useErrorHandler = () => {
  const throwError = (error) => {
    // Crear un error que será capturado por el Error Boundary
    throw error;
  };

  const handleAsyncError = (asyncFn) => {
    return async (...args) => {
      try {
        return await asyncFn(...args);
      } catch (error) {
        throwError(error);
      }
    };
  };

  return { throwError, handleAsyncError };
};

// Componente de error más simple para casos específicos
export const SimpleErrorFallback = ({ error, onRetry, isRetrying }) => (
  <div className="text-center p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
    <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
    <h3 className="text-lg font-semibold text-white mb-2">Error</h3>
    <p className="text-gray-400 mb-4">
      {error?.message || 'Ha ocurrido un error inesperado'}
    </p>
    <Button
      variant="outline"
      size="sm"
      onClick={onRetry}
      disabled={isRetrying}
      className="flex items-center space-x-2 mx-auto"
    >
      <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
      <span>{isRetrying ? 'Reintentando...' : 'Reintentar'}</span>
    </Button>
  </div>
);

// Error Boundary específico para módulos
export const ModuleErrorBoundary = ({ children, moduleName }) => (
  <ErrorBoundary
    fallback={({ error, onRetry, isRetrying }) => (
      <Card className="p-6 text-center">
        <Bug className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          Error en {moduleName}
        </h3>
        <p className="text-gray-400 mb-4">
          Este módulo ha encontrado un problema. Puedes intentar recargarlo.
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={onRetry}
          disabled={isRetrying}
          className="flex items-center space-x-2 mx-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Recargando...' : 'Recargar Módulo'}</span>
        </Button>
      </Card>
    )}
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;