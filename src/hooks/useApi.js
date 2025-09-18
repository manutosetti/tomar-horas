import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

// Configuración de la API
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
};

// Tipos de errores de API
const API_ERRORS = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN',
};

// Simulador de respuestas de API (para desarrollo)
const MOCK_RESPONSES = {
  '/professors': {
    GET: {
      data: [],
      status: 200,
      message: 'Profesores obtenidos exitosamente'
    },
    POST: {
      data: { id: Date.now().toString() },
      status: 201,
      message: 'Profesor creado exitosamente'
    }
  },
  '/subjects': {
    GET: {
      data: [],
      status: 200,
      message: 'Materias obtenidas exitosamente'
    }
  },
  '/hours': {
    GET: {
      data: [],
      status: 200,
      message: 'Asignaciones obtenidas exitosamente'
    }
  }
};

// Hook principal para API
export const useApi = (options = {}) => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  
  const abortControllerRef = useRef(null);
  const retryCountRef = useRef(0);

  const {
    baseURL = API_CONFIG.baseURL,
    timeout = API_CONFIG.timeout,
    retries = API_CONFIG.retries,
    retryDelay = API_CONFIG.retryDelay,
    mockMode = true, // Cambiar a false para usar API real
    showSuccessToast = true,
    showErrorToast = true,
    onSuccess,
    onError,
  } = options;

  // Función para crear headers de autenticación
  const createAuthHeaders = useCallback(() => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (user?.token) {
      headers.Authorization = `Bearer ${user.token}`;
    }

    return headers;
  }, [user]);

  // Función para manejar respuestas simuladas
  const handleMockResponse = useCallback(async (endpoint, method, requestData) => {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const mockResponse = MOCK_RESPONSES[endpoint]?.[method];
    
    if (!mockResponse) {
      throw new Error(`Mock no encontrado para ${method} ${endpoint}`);
    }

    // Simular errores ocasionales
    if (Math.random() < 0.1) {
      throw new Error('Error simulado de red');
    }

    return {
      ...mockResponse,
      data: method === 'POST' || method === 'PUT' ? 
        { ...mockResponse.data, ...requestData } : 
        mockResponse.data
    };
  }, []);

  // Función para determinar el tipo de error
  const getErrorType = useCallback((error) => {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return API_ERRORS.TIMEOUT;
      }
      return API_ERRORS.NETWORK_ERROR;
    }

    const status = error.response.status;
    
    switch (status) {
      case 401:
        return API_ERRORS.UNAUTHORIZED;
      case 403:
        return API_ERRORS.FORBIDDEN;
      case 404:
        return API_ERRORS.NOT_FOUND;
      case 422:
        return API_ERRORS.VALIDATION_ERROR;
      case 500:
      case 502:
      case 503:
        return API_ERRORS.SERVER_ERROR;
      default:
        return API_ERRORS.UNKNOWN;
    }
  }, []);

  // Función para manejar errores de API
  const handleApiError = useCallback((error) => {
    const errorType = getErrorType(error);
    let errorMessage = 'Error desconocido';

    switch (errorType) {
      case API_ERRORS.NETWORK_ERROR:
        errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
        break;
      case API_ERRORS.TIMEOUT:
        errorMessage = 'La petición tardó demasiado. Inténtalo de nuevo.';
        break;
      case API_ERRORS.UNAUTHORIZED:
        errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        logout();
        break;
      case API_ERRORS.FORBIDDEN:
        errorMessage = 'No tienes permisos para realizar esta acción.';
        break;
      case API_ERRORS.NOT_FOUND:
        errorMessage = 'Recurso no encontrado.';
        break;
      case API_ERRORS.VALIDATION_ERROR:
        errorMessage = error.response?.data?.message || 'Datos no válidos.';
        break;
      case API_ERRORS.SERVER_ERROR:
        errorMessage = 'Error del servidor. Inténtalo más tarde.';
        break;
      default:
        errorMessage = error.message || 'Error desconocido';
    }

    const apiError = {
      type: errorType,
      message: errorMessage,
      originalError: error,
      status: error.response?.status,
      data: error.response?.data,
    };

    setError(apiError);
    
    if (showErrorToast) {
      toast.error(errorMessage);
    }
    
    if (onError) {
      onError(apiError);
    }

    return apiError;
  }, [getErrorType, logout, showErrorToast, onError]);

  // Función principal para hacer peticiones
  const request = useCallback(async (endpoint, options = {}) => {
    const {
      method = 'GET',
      data: requestData,
      params,
      headers: customHeaders = {},
      skipAuth = false,
      skipErrorToast = false,
      skipSuccessToast = false,
    } = options;

    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo controlador de aborto
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);
    retryCountRef.current = 0;

    const attemptRequest = async () => {
      try {
        let response;

        if (mockMode) {
          // Usar respuestas simuladas
          response = await handleMockResponse(endpoint, method.toUpperCase(), requestData);
        } else {
          // Hacer petición real
          const url = new URL(endpoint, baseURL);
          
          // Agregar parámetros de consulta
          if (params) {
            Object.entries(params).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                url.searchParams.append(key, value.toString());
              }
            });
          }

          const fetchOptions = {
            method: method.toUpperCase(),
            headers: {
              ...(skipAuth ? {} : createAuthHeaders()),
              ...customHeaders,
            },
            signal: abortControllerRef.current.signal,
          };

          // Agregar body para métodos que lo requieren
          if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && requestData) {
            fetchOptions.body = JSON.stringify(requestData);
          }

          // Crear timeout
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), timeout);
          });

          const fetchPromise = fetch(url.toString(), fetchOptions);
          const fetchResponse = await Promise.race([fetchPromise, timeoutPromise]);
          
          if (!fetchResponse.ok) {
            const errorData = await fetchResponse.json().catch(() => ({}));
            const error = new Error(errorData.message || `HTTP ${fetchResponse.status}`);
            error.response = {
              status: fetchResponse.status,
              data: errorData,
            };
            throw error;
          }

          const responseData = await fetchResponse.json();
          response = {
            data: responseData.data || responseData,
            status: fetchResponse.status,
            message: responseData.message || 'Operación exitosa',
          };
        }

        setData(response.data);
        
        if (showSuccessToast && !skipSuccessToast && response.message) {
          toast.success(response.message);
        }
        
        if (onSuccess) {
          onSuccess(response.data, response);
        }

        return response;

      } catch (error) {
        if (error.name === 'AbortError') {
          return null; // Petición cancelada
        }

        // Reintentar si es necesario
        if (retryCountRef.current < retries && 
            !error.response?.status || 
            error.response.status >= 500) {
          
          retryCountRef.current++;
          await new Promise(resolve => 
            setTimeout(resolve, retryDelay * retryCountRef.current)
          );
          
          return attemptRequest();
        }

        throw error;
      }
    };

    try {
      const response = await attemptRequest();
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [
    baseURL,
    timeout,
    retries,
    retryDelay,
    mockMode,
    showSuccessToast,
    showErrorToast,
    onSuccess,
    onError,
    createAuthHeaders,
    handleMockResponse,
    handleApiError
  ]);

  // Funciones de conveniencia para métodos HTTP
  const get = useCallback((endpoint, options = {}) => {
    return request(endpoint, { ...options, method: 'GET' });
  }, [request]);

  const post = useCallback((endpoint, data, options = {}) => {
    return request(endpoint, { ...options, method: 'POST', data });
  }, [request]);

  const put = useCallback((endpoint, data, options = {}) => {
    return request(endpoint, { ...options, method: 'PUT', data });
  }, [request]);

  const patch = useCallback((endpoint, data, options = {}) => {
    return request(endpoint, { ...options, method: 'PATCH', data });
  }, [request]);

  const del = useCallback((endpoint, options = {}) => {
    return request(endpoint, { ...options, method: 'DELETE' });
  }, [request]);

  // Función para cancelar peticiones
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Función para limpiar estado
  const reset = useCallback(() => {
    cancel();
    setLoading(false);
    setError(null);
    setData(null);
    retryCountRef.current = 0;
  }, [cancel]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    // Estado
    loading,
    error,
    data,
    
    // Métodos HTTP
    request,
    get,
    post,
    put,
    patch,
    delete: del,
    
    // Utilidades
    cancel,
    reset,
    
    // Información adicional
    isLoading: loading,
    hasError: !!error,
    hasData: !!data,
    retryCount: retryCountRef.current,
  };
};

// Hook para múltiples peticiones simultáneas
export const useMultipleApi = (requests = [], options = {}) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [completed, setCompleted] = useState(0);
  
  const { 
    parallel = true, 
    stopOnError = false,
    showProgress = false 
  } = options;

  const executeRequests = useCallback(async () => {
    if (requests.length === 0) return;

    setLoading(true);
    setResults([]);
    setErrors([]);
    setCompleted(0);

    try {
      if (parallel) {
        // Ejecutar en paralelo
        const promises = requests.map(async (requestConfig, index) => {
          try {
            const api = useApi({ showErrorToast: false, showSuccessToast: false });
            const result = await api.request(requestConfig.endpoint, requestConfig.options);
            
            setCompleted(prev => prev + 1);
            return { success: true, data: result.data, index };
          } catch (error) {
            setCompleted(prev => prev + 1);
            return { success: false, error, index };
          }
        });

        const responses = await Promise.all(promises);
        
        const successResults = [];
        const errorResults = [];
        
        responses.forEach(response => {
          if (response.success) {
            successResults[response.index] = response.data;
          } else {
            errorResults[response.index] = response.error;
          }
        });

        setResults(successResults);
        setErrors(errorResults);
        
      } else {
        // Ejecutar secuencialmente
        const successResults = [];
        const errorResults = [];
        
        for (let i = 0; i < requests.length; i++) {
          try {
            const api = useApi({ showErrorToast: false, showSuccessToast: false });
            const result = await api.request(requests[i].endpoint, requests[i].options);
            
            successResults[i] = result.data;
            setCompleted(i + 1);
            
          } catch (error) {
            errorResults[i] = error;
            setCompleted(i + 1);
            
            if (stopOnError) break;
          }
        }

        setResults(successResults);
        setErrors(errorResults);
      }
      
    } finally {
      setLoading(false);
    }
  }, [requests, parallel, stopOnError]);

  return {
    results,
    errors,
    loading,
    completed,
    total: requests.length,
    progress: requests.length > 0 ? (completed / requests.length) * 100 : 0,
    execute: executeRequests,
    hasErrors: errors.some(error => error !== undefined),
    allCompleted: completed === requests.length,
  };
};

// Hook para peticiones paginadas
export const usePaginatedApi = (endpoint, options = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  
  const api = useApi(options);

  const fetchPage = useCallback(async (page = 1, limit = pagination.limit) => {
    try {
      const response = await api.get(endpoint, {
        params: { page, limit, ...options.params }
      });

      const responseData = response.data || response;
      const items = responseData.items || responseData.data || responseData;
      
      setData(items);
      setPagination({
        page: responseData.page || page,
        limit: responseData.limit || limit,
        total: responseData.total || items.length,
        totalPages: responseData.totalPages || Math.ceil((responseData.total || items.length) / limit),
        hasNext: responseData.hasNext ?? page < Math.ceil((responseData.total || items.length) / limit),
        hasPrev: responseData.hasPrev ?? page > 1,
      });

      return response;
    } catch (error) {
      throw error;
    }
  }, [api, endpoint, pagination.limit, options.params]);

  const nextPage = useCallback(() => {
    if (pagination.hasNext) {
      return fetchPage(pagination.page + 1);
    }
  }, [fetchPage, pagination.hasNext, pagination.page]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrev) {
      return fetchPage(pagination.page - 1);
    }
  }, [fetchPage, pagination.hasPrev, pagination.page]);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      return fetchPage(page);
    }
  }, [fetchPage, pagination.totalPages]);

  const refresh = useCallback(() => {
    return fetchPage(pagination.page);
  }, [fetchPage, pagination.page]);

  // Cargar primera página automáticamente
  useEffect(() => {
    fetchPage(1);
  }, [endpoint]);

  return {
    data,
    pagination,
    loading: api.loading,
    error: api.error,
    fetchPage,
    nextPage,
    prevPage,
    goToPage,
    refresh,
    hasData: data.length > 0,
  };
};

// Hook para cache de API
export const useApiCache = (key, fetchFunction, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const {
    cacheTime = 5 * 60 * 1000, // 5 minutos
    staleTime = 0,
    refetchOnWindowFocus = false,
    refetchOnReconnect = false,
  } = options;

  // Simulador de cache (en memoria)
  const cache = useRef({});

  const isStale = useCallback(() => {
    if (!lastFetch) return true;
    return Date.now() - lastFetch > staleTime;
  }, [lastFetch, staleTime]);

  const isCacheValid = useCallback(() => {
    const cached = cache.current[key];
    if (!cached) return false;
    return Date.now() - cached.timestamp < cacheTime;
  }, [key, cacheTime]);

  const fetchData = useCallback(async (force = false) => {
    // Usar cache si es válido y no es forzado
    if (!force && isCacheValid() && !isStale()) {
      const cached = cache.current[key];
      setData(cached.data);
      return cached.data;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();
      
      // Guardar en cache
      cache.current[key] = {
        data: result,
        timestamp: Date.now(),
      };
      
      setData(result);
      setLastFetch(Date.now());
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [key, fetchFunction, isCacheValid, isStale]);

  const invalidate = useCallback(() => {
    delete cache.current[key];
    setData(null);
    setLastFetch(null);
  }, [key]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Fetch inicial
  useEffect(() => {
    fetchData();
  }, [key]);

  // Refetch en focus de ventana
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (isStale()) {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, fetchData, isStale]);

  // Refetch en reconexión
  useEffect(() => {
    if (!refetchOnReconnect) return;

    const handleOnline = () => {
      if (isStale()) {
        fetchData();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [refetchOnReconnect, fetchData, isStale]);

  return {
    data,
    loading,
    error,
    lastFetch,
    isStale: isStale(),
    isCached: isCacheValid(),
    refetch: fetchData,
    refresh,
    invalidate,
  };
};

// Hook para operaciones CRUD
export const useCrudApi = (baseEndpoint, options = {}) => {
  const api = useApi(options);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const {
    onItemCreated,
    onItemUpdated,
    onItemDeleted,
    autoRefresh = true,
  } = options;

  // Obtener todos los elementos
  const fetchAll = useCallback(async (params = {}) => {
    try {
      const response = await api.get(baseEndpoint, { params });
      const data = response.data || response;
      setItems(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      setItems([]);
      throw error;
    }
  }, [api, baseEndpoint]);

  // Obtener un elemento por ID
  const fetchById = useCallback(async (id) => {
    try {
      const response = await api.get(`${baseEndpoint}/${id}`);
      const data = response.data || response;
      setSelectedItem(data);
      return data;
    } catch (error) {
      setSelectedItem(null);
      throw error;
    }
  }, [api, baseEndpoint]);

  // Crear nuevo elemento
  const create = useCallback(async (itemData) => {
    try {
      const response = await api.post(baseEndpoint, itemData);
      const newItem = response.data || response;
      
      if (autoRefresh) {
        setItems(prev => [...prev, newItem]);
      }
      
      if (onItemCreated) {
        onItemCreated(newItem);
      }
      
      return newItem;
    } catch (error) {
      throw error;
    }
  }, [api, baseEndpoint, autoRefresh, onItemCreated]);

  // Actualizar elemento
  const update = useCallback(async (id, itemData) => {
    try {
      const response = await api.put(`${baseEndpoint}/${id}`, itemData);
      const updatedItem = response.data || response;
      
      if (autoRefresh) {
        setItems(prev => prev.map(item => 
          item.id === id ? updatedItem : item
        ));
      }
      
      if (selectedItem?.id === id) {
        setSelectedItem(updatedItem);
      }
      
      if (onItemUpdated) {
        onItemUpdated(updatedItem);
      }
      
      return updatedItem;
    } catch (error) {
      throw error;
    }
  }, [api, baseEndpoint, autoRefresh, selectedItem, onItemUpdated]);

  // Eliminar elemento
  const remove = useCallback(async (id) => {
    try {
      await api.delete(`${baseEndpoint}/${id}`);
      
      if (autoRefresh) {
        setItems(prev => prev.filter(item => item.id !== id));
      }
      
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
      
      if (onItemDeleted) {
        onItemDeleted(id);
      }
      
      return id;
    } catch (error) {
      throw error;
    }
  }, [api, baseEndpoint, autoRefresh, selectedItem, onItemDeleted]);

  // Actualizar elemento parcialmente
  const patch = useCallback(async (id, changes) => {
    try {
      const response = await api.patch(`${baseEndpoint}/${id}`, changes);
      const updatedItem = response.data || response;
      
      if (autoRefresh) {
        setItems(prev => prev.map(item => 
          item.id === id ? { ...item, ...updatedItem } : item
        ));
      }
      
      if (selectedItem?.id === id) {
        setSelectedItem(prev => ({ ...prev, ...updatedItem }));
      }
      
      return updatedItem;
    } catch (error) {
      throw error;
    }
  }, [api, baseEndpoint, autoRefresh, selectedItem]);

  // Buscar elementos
  const search = useCallback(async (query, params = {}) => {
    try {
      const response = await api.get(`${baseEndpoint}/search`, {
        params: { q: query, ...params }
      });
      return response.data || response;
    } catch (error) {
      throw error;
    }
  }, [api, baseEndpoint]);

  return {
    // Estado
    items,
    selectedItem,
    loading: api.loading,
    error: api.error,
    
    // Operaciones CRUD
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    patch,
    search,
    
    // Utilidades
    setSelectedItem,
    refresh: fetchAll,
    reset: api.reset,
  };
};

export default useApi;