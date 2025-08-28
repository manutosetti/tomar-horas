import { useState, useEffect, useCallback } from 'react';

// NOTA IMPORTANTE: Este hook está diseñado para uso fuera de artifacts
// En artifacts de Claude.ai, localStorage no está disponible, por lo que
// se simula con variables en memoria

// Simulador de localStorage para artifacts
let memoryStorage = {};

const storageWrapper = {
  getItem: (key) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return memoryStorage[key] || null;
  },
  setItem: (key, value) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    } else {
      memoryStorage[key] = value;
    }
  },
  removeItem: (key) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    } else {
      delete memoryStorage[key];
    }
  },
  clear: () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
    } else {
      memoryStorage = {};
    }
  }
};

// Hook principal para localStorage
export const useLocalStorage = (key, initialValue, options = {}) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    syncAcrossTabs = false,
    onError = console.error
  } = options;

  // Función para obtener el valor del storage
  const getStoredValue = useCallback(() => {
    try {
      const item = storageWrapper.getItem(key);
      if (item === null) {
        return initialValue;
      }
      return deserialize(item);
    } catch (error) {
      onError(error);
      return initialValue;
    }
  }, [key, initialValue, deserialize, onError]);

  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Función para actualizar el valor
  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = typeof value === 'function' ? value(storedValue) : value;
        setStoredValue(valueToStore);
        
        if (valueToStore === undefined) {
          storageWrapper.removeItem(key);
        } else {
          storageWrapper.setItem(key, serialize(valueToStore));
        }
      } catch (error) {
        onError(error);
      }
    },
    [key, storedValue, serialize, onError]
  );

  // Función para remover el valor
  const removeValue = useCallback(() => {
    try {
      storageWrapper.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      onError(error);
    }
  }, [key, initialValue, onError]);

  // Escuchar cambios en localStorage (solo si está disponible y syncAcrossTabs está habilitado)
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') return;

    const handleStorageChange = (e) => {
      if (e.key === key && e.oldValue !== e.newValue) {
        try {
          const newValue = e.newValue ? deserialize(e.newValue) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          onError(error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue, deserialize, onError, syncAcrossTabs]);

  return [storedValue, setValue, removeValue];
};

// Hook para múltiples valores de localStorage
export const useMultipleLocalStorage = (items) => {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadValues = () => {
      const loadedValues = {};
      
      Object.entries(items).forEach(([key, defaultValue]) => {
        try {
          const item = storageWrapper.getItem(key);
          loadedValues[key] = item ? JSON.parse(item) : defaultValue;
        } catch (error) {
          console.error(`Error loading ${key} from localStorage:`, error);
          loadedValues[key] = defaultValue;
        }
      });
      
      setValues(loadedValues);
      setLoading(false);
    };

    loadValues();
  }, [items]);

  const updateValue = useCallback((key, value) => {
    try {
      const valueToStore = typeof value === 'function' ? value(values[key]) : value;
      
      setValues(prev => ({ ...prev, [key]: valueToStore }));
      
      if (valueToStore === undefined) {
        storageWrapper.removeItem(key);
      } else {
        storageWrapper.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error updating ${key} in localStorage:`, error);
    }
  }, [values]);

  const updateMultiple = useCallback((updates) => {
    const newValues = { ...values };
    
    Object.entries(updates).forEach(([key, value]) => {
      try {
        const valueToStore = typeof value === 'function' ? value(values[key]) : value;
        newValues[key] = valueToStore;
        
        if (valueToStore === undefined) {
          storageWrapper.removeItem(key);
        } else {
          storageWrapper.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error updating ${key} in localStorage:`, error);
      }
    });
    
    setValues(newValues);
  }, [values]);

  return {
    values,
    loading,
    updateValue,
    updateMultiple
  };
};

// Hook para localStorage con expiración
export const useLocalStorageWithExpiry = (key, initialValue, expiryTime) => {
  const getStoredValue = useCallback(() => {
    try {
      const item = storageWrapper.getItem(key);
      if (!item) return initialValue;
      
      const { value, expiry } = JSON.parse(item);
      
      if (Date.now() > expiry) {
        storageWrapper.removeItem(key);
        return initialValue;
      }
      
      return value;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(getStoredValue);

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = typeof value === 'function' ? value(storedValue) : value;
        const expiry = Date.now() + expiryTime;
        
        setStoredValue(valueToStore);
        storageWrapper.setItem(key, JSON.stringify({ value: valueToStore, expiry }));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    [key, storedValue, expiryTime]
  );

  const removeValue = useCallback(() => {
    try {
      storageWrapper.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }, [key, initialValue]);

  const isExpired = useCallback(() => {
    try {
      const item = storageWrapper.getItem(key);
      if (!item) return true;
      
      const { expiry } = JSON.parse(item);
      return Date.now() > expiry;
    } catch (error) {
      return true;
    }
  }, [key]);

  return [storedValue, setValue, removeValue, isExpired];
};

// Hook para localStorage con validación
export const useValidatedLocalStorage = (key, initialValue, validator) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = storageWrapper.getItem(key);
      if (!item) return initialValue;
      
      const parsed = JSON.parse(item);
      return validator(parsed) ? parsed : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const [isValid, setIsValid] = useState(true);
  const [validationError, setValidationError] = useState(null);

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = typeof value === 'function' ? value(storedValue) : value;
        
        if (validator(valueToStore)) {
          setStoredValue(valueToStore);
          setIsValid(true);
          setValidationError(null);
          storageWrapper.setItem(key, JSON.stringify(valueToStore));
        } else {
          setIsValid(false);
          setValidationError('Valor no válido');
        }
      } catch (error) {
        setIsValid(false);
        setValidationError(error.message);
        console.error('Error saving to localStorage:', error);
      }
    },
    [key, storedValue, validator]
  );

  const removeValue = useCallback(() => {
    try {
      storageWrapper.removeItem(key);
      setStoredValue(initialValue);
      setIsValid(true);
      setValidationError(null);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue, { isValid, validationError }];
};

// Hook para sincronizar estado con localStorage
export const useLocalStorageState = (key, initialState) => {
  const [state, setState] = useLocalStorage(key, initialState);

  const updateState = useCallback((updates) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, [setState]);

  const resetState = useCallback(() => {
    setState(initialState);
  }, [setState, initialState]);

  return [state, setState, updateState, resetState];
};

// Utilidad para limpiar localStorage
export const useLocalStorageCleaner = () => {
  const clearAll = useCallback(() => {
    storageWrapper.clear();
  }, []);

  const clearByPattern = useCallback((pattern) => {
    const regex = new RegExp(pattern);
    
    if (typeof window !== 'undefined' && window.localStorage) {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && regex.test(key)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } else {
      // Para memoria simulada
      Object.keys(memoryStorage).forEach(key => {
        if (regex.test(key)) {
          delete memoryStorage[key];
        }
      });
    }
  }, []);

  const getStorageSize = useCallback(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    }
    return JSON.stringify(memoryStorage).length;
  }, []);

  return { clearAll, clearByPattern, getStorageSize };
};

export default useLocalStorage;