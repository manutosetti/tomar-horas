import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Estado inicial del tema
const initialState = {
  theme: 'dark', // 'light', 'dark', 'auto'
  systemTheme: 'dark',
  colors: {
    primary: 'blue',
    accent: 'purple',
  },
  animations: {
    enabled: true,
    speed: 'normal', // 'slow', 'normal', 'fast'
    reduceMotion: false,
  },
  layout: {
    sidebarCollapsed: false,
    density: 'comfortable', // 'compact', 'comfortable', 'spacious'
    borderRadius: 'medium', // 'none', 'small', 'medium', 'large'
  },
  accessibility: {
    highContrast: false,
    largeText: false,
    focusVisible: true,
  },
  preferences: {
    autoSave: true,
    showNotifications: true,
    soundEffects: false,
  }
};

// Tipos de acciones
const THEME_ACTIONS = {
  SET_THEME: 'SET_THEME',
  SET_SYSTEM_THEME: 'SET_SYSTEM_THEME',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_COLORS: 'SET_COLORS',
  UPDATE_ANIMATIONS: 'UPDATE_ANIMATIONS',
  UPDATE_LAYOUT: 'UPDATE_LAYOUT',
  UPDATE_ACCESSIBILITY: 'UPDATE_ACCESSIBILITY',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  RESET_TO_DEFAULT: 'RESET_TO_DEFAULT',
  LOAD_PREFERENCES: 'LOAD_PREFERENCES',
};

// Configuraciones de tema predefinidas
const THEME_PRESETS = {
  dark: {
    name: 'Oscuro',
    theme: 'dark',
    colors: { primary: 'blue', accent: 'purple' },
  },
  light: {
    name: 'Claro',
    theme: 'light',
    colors: { primary: 'blue', accent: 'purple' },
  },
  highContrast: {
    name: 'Alto Contraste',
    theme: 'dark',
    colors: { primary: 'yellow', accent: 'white' },
    accessibility: { highContrast: true },
  },
  minimal: {
    name: 'Minimalista',
    theme: 'light',
    colors: { primary: 'gray', accent: 'blue' },
    layout: { density: 'compact', borderRadius: 'small' },
  },
};

// Reducer del tema
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.SET_THEME:
      return { ...state, theme: action.payload };
    
    case THEME_ACTIONS.SET_SYSTEM_THEME:
      return { ...state, systemTheme: action.payload };
    
    case THEME_ACTIONS.TOGGLE_THEME:
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      return { ...state, theme: newTheme };
    
    case THEME_ACTIONS.SET_COLORS:
      return {
        ...state,
        colors: { ...state.colors, ...action.payload }
      };
    
    case THEME_ACTIONS.UPDATE_ANIMATIONS:
      return {
        ...state,
        animations: { ...state.animations, ...action.payload }
      };
    
    case THEME_ACTIONS.UPDATE_LAYOUT:
      return {
        ...state,
        layout: { ...state.layout, ...action.payload }
      };
    
    case THEME_ACTIONS.UPDATE_ACCESSIBILITY:
      return {
        ...state,
        accessibility: { ...state.accessibility, ...action.payload }
      };
    
    case THEME_ACTIONS.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };
    
    case THEME_ACTIONS.RESET_TO_DEFAULT:
      return { ...initialState };
    
    case THEME_ACTIONS.LOAD_PREFERENCES:
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
};

// Crear contexto
const ThemeContext = createContext(null);

// Provider del tema
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Simulador de almacenamiento (similar al usado en otros contextos)
  let themeStorage = null;

  // Función para detectar el tema del sistema
  const detectSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  };

  // Función para obtener el tema efectivo
  const getEffectiveTheme = () => {
    if (state.theme === 'auto') {
      return state.systemTheme;
    }
    return state.theme;
  };

  // Funciones para cambiar tema
  const setTheme = (theme) => {
    dispatch({ type: THEME_ACTIONS.SET_THEME, payload: theme });
    saveToStorage({ ...state, theme });
  };

  const toggleTheme = () => {
    dispatch({ type: THEME_ACTIONS.TOGGLE_THEME });
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    saveToStorage({ ...state, theme: newTheme });
  };

  // Funciones para colores
  const setColors = (colors) => {
    dispatch({ type: THEME_ACTIONS.SET_COLORS, payload: colors });
    saveToStorage({ ...state, colors: { ...state.colors, ...colors } });
  };

  const setPrimaryColor = (color) => {
    setColors({ primary: color });
  };

  const setAccentColor = (color) => {
    setColors({ accent: color });
  };

  // Funciones para animaciones
  const updateAnimations = (animations) => {
    dispatch({ type: THEME_ACTIONS.UPDATE_ANIMATIONS, payload: animations });
    saveToStorage({ ...state, animations: { ...state.animations, ...animations } });
  };

  const toggleAnimations = () => {
    updateAnimations({ enabled: !state.animations.enabled });
  };

  const setAnimationSpeed = (speed) => {
    updateAnimations({ speed });
  };

  // Funciones para layout
  const updateLayout = (layout) => {
    dispatch({ type: THEME_ACTIONS.UPDATE_LAYOUT, payload: layout });
    saveToStorage({ ...state, layout: { ...state.layout, ...layout } });
  };

  const toggleSidebarCollapsed = () => {
    updateLayout({ sidebarCollapsed: !state.layout.sidebarCollapsed });
  };

  const setDensity = (density) => {
    updateLayout({ density });
  };

  const setBorderRadius = (borderRadius) => {
    updateLayout({ borderRadius });
  };

  // Funciones para accesibilidad
  const updateAccessibility = (accessibility) => {
    dispatch({ type: THEME_ACTIONS.UPDATE_ACCESSIBILITY, payload: accessibility });
    saveToStorage({ ...state, accessibility: { ...state.accessibility, ...accessibility } });
  };

  const toggleHighContrast = () => {
    updateAccessibility({ highContrast: !state.accessibility.highContrast });
  };

  const toggleLargeText = () => {
    updateAccessibility({ largeText: !state.accessibility.largeText });
  };

  const toggleFocusVisible = () => {
    updateAccessibility({ focusVisible: !state.accessibility.focusVisible });
  };

  // Funciones para preferencias
  const updatePreferences = (preferences) => {
    dispatch({ type: THEME_ACTIONS.UPDATE_PREFERENCES, payload: preferences });
    saveToStorage({ ...state, preferences: { ...state.preferences, ...preferences } });
  };

  // Función para aplicar preset
  const applyPreset = (presetName) => {
    const preset = THEME_PRESETS[presetName];
    if (!preset) return;

    const newState = {
      ...state,
      theme: preset.theme,
      colors: { ...state.colors, ...preset.colors },
      ...(preset.accessibility && { accessibility: { ...state.accessibility, ...preset.accessibility } }),
      ...(preset.layout && { layout: { ...state.layout, ...preset.layout } }),
    };

    dispatch({ type: THEME_ACTIONS.LOAD_PREFERENCES, payload: newState });
    saveToStorage(newState);
  };

  // Función para resetear configuración
  const resetToDefault = () => {
    dispatch({ type: THEME_ACTIONS.RESET_TO_DEFAULT });
    clearStorage();
  };

  // Función para guardar en almacenamiento
  const saveToStorage = (themeData) => {
    try {
      themeStorage = themeData;
      // En un entorno real, aquí se guardaría en localStorage
    } catch (error) {
      console.error('Error saving theme preferences:', error);
    }
  };

  // Función para limpiar almacenamiento
  const clearStorage = () => {
    themeStorage = null;
  };

  // Función para cargar preferencias guardadas
  const loadSavedPreferences = () => {
    try {
      if (themeStorage) {
        dispatch({ type: THEME_ACTIONS.LOAD_PREFERENCES, payload: themeStorage });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading theme preferences:', error);
      return false;
    }
  };

  // Función para generar CSS variables
  const getCSSVariables = () => {
    const effectiveTheme = getEffectiveTheme();
    const { primary, accent } = state.colors;
    const { density, borderRadius } = state.layout;
    const { highContrast, largeText } = state.accessibility;

    const colorMap = {
      blue: { 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8' },
      purple: { 500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9' },
      green: { 500: '#10B981', 600: '#059669', 700: '#047857' },
      red: { 500: '#EF4444', 600: '#DC2626', 700: '#B91C1C' },
      yellow: { 500: '#F59E0B', 600: '#D97706', 700: '#B45309' },
      gray: { 500: '#6B7280', 600: '#4B5563', 700: '#374151' },
    };

    const densityMap = {
      compact: { spacing: '0.5rem', fontSize: '0.875rem' },
      comfortable: { spacing: '1rem', fontSize: '1rem' },
      spacious: { spacing: '1.5rem', fontSize: '1.125rem' },
    };

    const radiusMap = {
      none: '0',
      small: '0.25rem',
      medium: '0.5rem',
      large: '1rem',
    };

    return {
      '--theme': effectiveTheme,
      '--primary-500': colorMap[primary]?.[500] || colorMap.blue[500],
      '--primary-600': colorMap[primary]?.[600] || colorMap.blue[600],
      '--primary-700': colorMap[primary]?.[700] || colorMap.blue[700],
      '--accent-500': colorMap[accent]?.[500] || colorMap.purple[500],
      '--accent-600': colorMap[accent]?.[600] || colorMap.purple[600],
      '--accent-700': colorMap[accent]?.[700] || colorMap.purple[700],
      '--spacing': densityMap[density].spacing,
      '--font-size': largeText ? '1.125rem' : densityMap[density].fontSize,
      '--border-radius': radiusMap[borderRadius],
      '--high-contrast': highContrast ? '1' : '0',
    };
  };

  // Detectar cambios en el tema del sistema
  useEffect(() => {
    const systemTheme = detectSystemTheme();
    dispatch({ type: THEME_ACTIONS.SET_SYSTEM_THEME, payload: systemTheme });

    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        dispatch({ 
          type: THEME_ACTIONS.SET_SYSTEM_THEME, 
          payload: e.matches ? 'dark' : 'light' 
        });
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Cargar preferencias al inicializar
  useEffect(() => {
    loadSavedPreferences();
  }, []);

  // Aplicar CSS variables al documento
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const variables = getCSSVariables();
      
      Object.entries(variables).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });

      // Aplicar clase de tema
      root.className = root.className.replace(/theme-\w+/g, '');
      root.classList.add(`theme-${getEffectiveTheme()}`);
      
      // Aplicar clases de accesibilidad
      if (state.accessibility.highContrast) {
        root.classList.add('high-contrast');
      } else {
        root.classList.remove('high-contrast');
      }

      if (state.accessibility.largeText) {
        root.classList.add('large-text');
      } else {
        root.classList.remove('large-text');
      }

      if (state.animations.reduceMotion) {
        root.classList.add('reduce-motion');
      } else {
        root.classList.remove('reduce-motion');
      }
    }
  }, [state]);

  // Detectar preferencia de movimiento reducido
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      const handleChange = (e) => {
        updateAnimations({ reduceMotion: e.matches });
      };

      mediaQuery.addEventListener('change', handleChange);
      // Aplicar estado inicial
      if (mediaQuery.matches) {
        updateAnimations({ reduceMotion: true });
      }

      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const value = {
    // Estado
    theme: state.theme,
    systemTheme: state.systemTheme,
    effectiveTheme: getEffectiveTheme(),
    colors: state.colors,
    animations: state.animations,
    layout: state.layout,
    accessibility: state.accessibility,
    preferences: state.preferences,
    
    // Funciones de tema
    setTheme,
    toggleTheme,
    
    // Funciones de colores
    setColors,
    setPrimaryColor,
    setAccentColor,
    
    // Funciones de animaciones
    updateAnimations,
    toggleAnimations,
    setAnimationSpeed,
    
    // Funciones de layout
    updateLayout,
    toggleSidebarCollapsed,
    setDensity,
    setBorderRadius,
    
    // Funciones de accesibilidad
    updateAccessibility,
    toggleHighContrast,
    toggleLargeText,
    toggleFocusVisible,
    
    // Funciones de preferencias
    updatePreferences,
    
    // Utilidades
    applyPreset,
    resetToDefault,
    getCSSVariables,
    
    // Constantes
    THEME_PRESETS,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider');
  }
  
  return context;
};

// Hook para aplicar tema a componentes específicos
export const useComponentTheme = (componentName) => {
  const theme = useTheme();
  
  const getComponentStyles = () => {
    const baseStyles = {
      transition: theme.animations.enabled ? 'all 0.2s ease-in-out' : 'none',
      borderRadius: `var(--border-radius)`,
    };

    const componentStyles = {
      card: {
        ...baseStyles,
        backgroundColor: theme.effectiveTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(10px)',
      },
      button: {
        ...baseStyles,
        fontSize: theme.accessibility.largeText ? '1.125rem' : '1rem',
      },
      input: {
        ...baseStyles,
        fontSize: theme.accessibility.largeText ? '1.125rem' : '1rem',
      },
    };

    return componentStyles[componentName] || baseStyles;
  };

  return {
    styles: getComponentStyles(),
    theme: theme.effectiveTheme,
    isDark: theme.effectiveTheme === 'dark',
    isLight: theme.effectiveTheme === 'light',
  };
};

export default ThemeContext;