// src/utils/constants.js

// Roles de usuario
export const USER_ROLES = {
  MANAGER: 'manager',
  PROFESSOR: 'professor'
};

// Estados de entidades
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  ARCHIVED: 'archived'
};

// Tipos de notificación
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100
};

// Configuración de búsqueda
export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 300,
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100
};

// Horarios académicos
export const ACADEMIC_TIME = {
  DAYS_OF_WEEK: [
    { key: 'monday', label: 'Lunes', short: 'L' },
    { key: 'tuesday', label: 'Martes', short: 'M' },
    { key: 'wednesday', label: 'Miércoles', short: 'X' },
    { key: 'thursday', label: 'Jueves', short: 'J' },
    { key: 'friday', label: 'Viernes', short: 'V' },
    { key: 'saturday', label: 'Sábado', short: 'S' }
  ],
  TIME_SLOTS: [
    { value: '08:00', label: '08:00 AM' },
    { value: '09:00', label: '09:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '01:00 PM' },
    { value: '14:00', label: '02:00 PM' },
    { value: '15:00', label: '03:00 PM' },
    { value: '16:00', label: '04:00 PM' },
    { value: '17:00', label: '05:00 PM' },
    { value: '18:00', label: '06:00 PM' },
    { value: '19:00', label: '07:00 PM' },
    { value: '20:00', label: '08:00 PM' }
  ],
  SEMESTERS: [
    { key: 'first', label: '1er Semestre', months: [1, 2, 3, 4, 5, 6] },
    { key: 'second', label: '2do Semestre', months: [7, 8, 9, 10, 11, 12] }
  ]
};

// Departamentos académicos predefinidos
export const DEPARTMENTS = [
  'Matemáticas',
  'Física',
  'Química',
  'Biología',
  'Informática',
  'Ingeniería',
  'Humanidades',
  'Ciencias Sociales',
  'Artes',
  'Idiomas',
  'Educación Física',
  'Administración'
];

// Especializaciones comunes
export const SPECIALIZATIONS = [
  // Matemáticas
  'Cálculo',
  'Álgebra',
  'Geometría',
  'Estadística',
  'Matemática Aplicada',
  
  // Física
  'Mecánica',
  'Termodinámica',
  'Electromagnetismo',
  'Física Cuántica',
  'Óptica',
  
  // Química
  'Química Orgánica',
  'Química Inorgánica',
  'Bioquímica',
  'Fisicoquímica',
  
  // Informática
  'Programación',
  'Base de Datos',
  'Redes',
  'Inteligencia Artificial',
  'Desarrollo Web',
  'Ciberseguridad',
  
  // Otros
  'Historia',
  'Literatura',
  'Filosofía',
  'Psicología',
  'Economía',
  'Contabilidad'
];

// Configuración de puntuación
export const SCORING = {
  MIN_SCORE: 0,
  MAX_SCORE: 100,
  DEFAULT_SCORE: 0,
  SCORE_RANGES: {
    EXCELLENT: { min: 90, max: 100, label: 'Excelente', color: 'green' },
    GOOD: { min: 75, max: 89, label: 'Bueno', color: 'blue' },
    REGULAR: { min: 60, max: 74, label: 'Regular', color: 'yellow' },
    POOR: { min: 0, max: 59, label: 'Deficiente', color: 'red' }
  }
};

// Tipos de asignación de horas
export const HOUR_ASSIGNMENT_TYPES = {
  TEACHING: 'teaching', // Docencia
  RESEARCH: 'research', // Investigación
  ADMINISTRATIVE: 'administrative', // Administrativo
  EXTENSION: 'extension' // Extensión
};

// Estados de asignación
export const ASSIGNMENT_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  COMPLETED: 'completed'
};

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    TEXT: ['text/plain', 'text/csv']
  }
};

// Configuración de la interfaz
export const UI_CONFIG = {
  TOAST_DURATION: 4000,
  MODAL_ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  AUTO_SAVE_DELAY: 2000,
  REFRESH_INTERVAL: 30000 // 30 segundos
};

// Rutas de navegación
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFESSORS: '/professors',
  SUBJECTS: '/subjects',
  SCHEDULES: '/schedules',
  HOURS: '/hours',
  REPORTS: '/reports',
  PROFILE: '/profile',
  SETTINGS: '/settings'
};

// Configuración de la API (para uso futuro)
export const API_CONFIG = {
  BASE_URL: process.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// Mensajes predefinidos
export const MESSAGES = {
  SUCCESS: {
    PROFESSOR_CREATED: 'Profesor creado exitosamente',
    PROFESSOR_UPDATED: 'Profesor actualizado exitosamente',
    PROFESSOR_DELETED: 'Profesor eliminado exitosamente',
    SUBJECT_CREATED: 'Materia creada exitosamente',
    SUBJECT_UPDATED: 'Materia actualizada exitosamente',
    LOGIN_SUCCESS: 'Sesión iniciada correctamente',
    LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
    PROFILE_UPDATED: 'Perfil actualizado correctamente'
  },
  ERROR: {
    GENERIC: 'Ha ocurrido un error inesperado',
    NETWORK: 'Error de conexión. Verifica tu internet.',
    UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
    VALIDATION: 'Por favor verifica los datos ingresados',
    NOT_FOUND: 'El recurso solicitado no existe',
    SERVER: 'Error del servidor. Intenta más tarde.',
    LOGIN_FAILED: 'Credenciales incorrectas'
  },
  CONFIRMATION: {
    DELETE_PROFESSOR: '¿Estás seguro de eliminar este profesor?',
    DELETE_SUBJECT: '¿Estás seguro de eliminar esta materia?',
    UNSAVED_CHANGES: 'Tienes cambios sin guardar. ¿Deseas continuar?',
    LOGOUT: '¿Estás seguro de que deseas cerrar sesión?'
  }
};

// Patrones de validación
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  NAME: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
  TIME: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
};

// Configuración de localStorage keys
export const STORAGE_KEYS = {
  USER: 'sgh_user',
  TOKEN: 'sgh_token',
  PREFERENCES: 'sgh_preferences',
  THEME: 'sgh_theme',
  SIDEBAR_STATE: 'sgh_sidebar',
  LAST_ACTIVITY: 'sgh_last_activity'
};

// Configuración de tema
export const THEME_CONFIG = {
  DARK: 'dark',
  LIGHT: 'light',
  AUTO: 'auto'
};

// Configuración de reportes
export const REPORTS_CONFIG = {
  TYPES: {
    PROFESSORS: 'professors',
    SUBJECTS: 'subjects',
    HOURS: 'hours',
    SCHEDULES: 'schedules'
  },
  FORMATS: {
    PDF: 'pdf',
    EXCEL: 'excel',
    CSV: 'csv'
  },
  PERIODS: {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    SEMESTER: 'semester',
    YEARLY: 'yearly'
  }
};

export default {
  USER_ROLES,
  STATUS,
  NOTIFICATION_TYPES,
  PAGINATION,
  SEARCH_CONFIG,
  ACADEMIC_TIME,
  DEPARTMENTS,
  SPECIALIZATIONS,
  SCORING,
  HOUR_ASSIGNMENT_TYPES,
  ASSIGNMENT_STATUS,
  FILE_CONFIG,
  UI_CONFIG,
  ROUTES,
  API_CONFIG,
  MESSAGES,
  VALIDATION_PATTERNS,
  STORAGE_KEYS,
  THEME_CONFIG,
  REPORTS_CONFIG
};