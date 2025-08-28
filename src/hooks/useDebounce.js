import { useState, useEffect, useCallback, useRef } from 'react';

// Hook básico de debounce
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
};

// Hook para debounce de funciones
export const useDebouncedFunction = (func, delay, dependencies = []) => {
  const timeoutRef = useRef(null);

  const debouncedFunction = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay, ...dependencies]
  );

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Función para cancelar el debounce pendiente
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Función para ejecutar inmediatamente
  const flush = useCallback(
    (...args) => {
      cancel();
      func(...args);
    },
    [cancel, func]
  );

  return {
    debouncedFunction,
    cancel,
    flush,
    isPending: () => timeoutRef.current !== null
  };
};

// Hook para debounce de búsqueda
export const useDebouncedSearch = (searchFunction, delay = 300, minLength = 2) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length < minLength) {
        setResults([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const searchResults = await searchFunction(debouncedQuery);
        setResults(searchResults);
      } catch (err) {
        setError(err.message || 'Error en la búsqueda');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, searchFunction, minLength]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearSearch,
    hasResults: results.length > 0,
    hasQuery: query.length > 0,
    isSearching: loading && debouncedQuery.length >= minLength
  };
};

// Hook para debounce de efectos
export const useDebouncedEffect = (effect, delay, dependencies = []) => {
  useEffect(() => {
    const timeoutId = setTimeout(effect, delay);
    
    return () => clearTimeout(timeoutId);
  }, [...dependencies, delay]);
};

// Hook para debounce de callbacks
export const useDebouncedCallback = (callback, delay, dependencies = []) => {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  // Actualizar callback ref cuando cambie
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay, ...dependencies]
  );

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// Hook para debounce con estado de loading
export const useDebouncedState = (initialValue, delay, validator = null) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    setIsDebouncing(true);
    
    const timeoutId = setTimeout(async () => {
      // Validar si se proporciona un validador
      if (validator) {
        try {
          const validationResult = await validator(value);
          setIsValid(validationResult.isValid || true);
          setValidationError(validationResult.error || null);
        } catch (error) {
          setIsValid(false);
          setValidationError(error.message);
        }
      }
      
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      setIsDebouncing(false);
    };
  }, [value, delay, validator]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setDebouncedValue(initialValue);
    setIsDebouncing(false);
    setIsValid(true);
    setValidationError(null);
  }, [initialValue]);

  return {
    value,
    setValue,
    debouncedValue,
    isDebouncing,
    isValid,
    validationError,
    reset,
    hasChanged: value !== debouncedValue
  };
};

// Hook para debounce múltiple
export const useMultipleDebounce = (values, delay) => {
  const [debouncedValues, setDebouncedValues] = useState(values);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValues(values);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [values, delay]);

  return debouncedValues;
};

// Hook para debounce con throttle
export const useDebouncedThrottle = (func, delay, throttleDelay) => {
  const lastCallRef = useRef(0);
  const timeoutRef = useRef(null);

  const debouncedThrottledFunction = useCallback(
    (...args) => {
      const now = Date.now();
      const shouldThrottle = now - lastCallRef.current < throttleDelay;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (shouldThrottle) {
        // Si está dentro del período de throttle, usar debounce normal
        timeoutRef.current = setTimeout(() => {
          func(...args);
          lastCallRef.current = Date.now();
        }, delay);
      } else {
        // Si pasó el período de throttle, ejecutar inmediatamente
        func(...args);
        lastCallRef.current = now;
      }
    },
    [func, delay, throttleDelay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedThrottledFunction;
};

export default useDebounce;