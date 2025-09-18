// src/utils/formatters.js

/**
 * Formateadores de datos para la aplicación
 */

// ===== FORMATEO DE FECHAS =====

/**
 * Formatea una fecha a formato legible en español
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires'
  };
  
  const formatOptions = { ...defaultOptions, ...options };
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', formatOptions);
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return '';
  }
};

/**
 * Formatea una fecha a formato corto (DD/MM/YYYY)
 */
export const formatDateShort = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return '';
  }
};

/**
 * Formatea una fecha relativa (hace X días, hace X horas, etc.)
 */
export const formatRelativeDate = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    
    const intervals = [
      { label: 'año', seconds: 31536000 },
      { label: 'mes', seconds: 2592000 },
      { label: 'semana', seconds: 604800 },
      { label: 'día', seconds: 86400 },
      { label: 'hora', seconds: 3600 },
      { label: 'minuto', seconds: 60 }
    ];
    
    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count > 0) {
        const plural = count === 1 ? '' : 's';
        return `Hace ${count} ${interval.label}${plural}`;
      }
    }
    
    return 'Hace un momento';
  } catch (error) {
    return '';
  }
};

// ===== FORMATEO DE TIEMPO =====

/**
 * Formatea un tiempo a formato de 12 horas
 */
export const formatTime12Hour = (time) => {
  if (!time) return '';
  
  try {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    
    return `${hour12}:${minutes} ${ampm}`;
  } catch (error) {
    return time;
  }
};

/**
 * Formatea un tiempo a formato de 24 horas
 */
export const formatTime24Hour = (time) => {
  if (!time) return '';
  
  try {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  } catch (error) {
    return time;
  }
};

/**
 * Formatea una duración en minutos a formato legible
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes === 0) return '0 min';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes} min`;
  } else if (remainingMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${remainingMinutes}min`;
  }
};

// ===== FORMATEO DE NOMBRES =====

/**
 * Formatea un nombre completo
 */
export const formatFullName = (firstName, lastName, format = 'full') => {
  if (!firstName && !lastName) return '';
  
  const first = firstName || '';
  const last = lastName || '';
  
  switch (format) {
    case 'full':
      return `${first} ${last}`.trim();
    case 'lastFirst':
      return `${last}, ${first}`.trim().replace(/^,\s*/, '');
    case 'initials':
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    case 'firstInitial':
      return `${first} ${last.charAt(0)}.`.trim();
    default:
      return `${first} ${last}`.trim();
  }
};

/**
 * Capitaliza la primera letra de cada palabra
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Capitaliza solo la primera letra
 */
export const capitalizeFirst = (str) => {
  if (!str) return '';
  
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// ===== FORMATEO DE NÚMEROS =====

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  
  return Number(num).toLocaleString('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formatea un número como porcentaje
 */
export const formatPercentage = (num, decimals = 1) => {
  if (num === null || num === undefined || isNaN(num)) return '0%';
  
  return `${Number(num).toFixed(decimals)}%`;
};

/**
 * Formatea una puntuación con su etiqueta correspondiente
 */
export const formatScore = (score) => {
  if (score === null || score === undefined || isNaN(score)) return 'Sin puntuación';
  
  const numScore = Number(score);
  
  if (numScore >= 90) return `${numScore} - Excelente`;
  if (numScore >= 75) return `${numScore} - Bueno`;
  if (numScore >= 60) return `${numScore} - Regular`;
  return `${numScore} - Deficiente`;
};

// ===== FORMATEO DE CONTACTO =====

/**
 * Formatea un número de teléfono
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remover todos los caracteres no numéricos excepto el +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Si empieza con +54 (Argentina)
  if (cleaned.startsWith('+54')) {
    const number = cleaned.slice(3);
    if (number.length === 10) {
      // Formato: +54 280 123-4567
      return `+54 ${number.slice(0, 3)} ${number.slice(3, 6)}-${number.slice(6)}`;
    }
  }
  
  // Si es un número local argentino
  if (cleaned.length === 10 && !cleaned.startsWith('+')) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Retornar como está si no coincide con ningún patrón
  return phone;
};

/**
 * Enmascara un email para privacidad
 */
export const maskEmail = (email) => {
  if (!email) return '';
  
  try {
    const [username, domain] = email.split('@');
    const maskedUsername = username.length <= 3 
      ? username[0] + '*'.repeat(username.length - 1)
      : username.slice(0, 2) + '*'.repeat(username.length - 4) + username.slice(-2);
    
    return `${maskedUsername}@${domain}`;
  } catch (error) {
    return email;
  }
};

// ===== FORMATEO DE TEXTO =====

/**
 * Trunca un texto a una longitud específica
 */
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Convierte texto a slug (URL-friendly)
 */
export const toSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
    .trim('-'); // Remover guiones al inicio y final
};

// ===== FORMATEO DE ARCHIVOS =====

/**
 * Formatea el tamaño de archivo
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

// ===== FORMATEO DE COLORES =====

/**
 * Genera un color basado en un string (para avatares, etc.)
 */
export const stringToColor = (str) => {
  if (!str) return '#6366f1';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 55%)`;
};

// ===== FORMATEO DE DATOS ACADÉMICOS =====

/**
 * Formatea el día de la semana
 */
export const formatDayOfWeek = (day, format = 'full') => {
  const days = {
    monday: { full: 'Lunes', short: 'Lun', minimal: 'L' },
    tuesday: { full: 'Martes', short: 'Mar', minimal: 'M' },
    wednesday: { full: 'Miércoles', short: 'Mié', minimal: 'X' },
    thursday: { full: 'Jueves', short: 'Jue', minimal: 'J' },
    friday: { full: 'Viernes', short: 'Vie', minimal: 'V' },
    saturday: { full: 'Sábado', short: 'Sáb', minimal: 'S' },
    sunday: { full: 'Domingo', short: 'Dom', minimal: 'D' }
  };
  
  return days[day]?.[format] || day;
};

/**
 * Formatea un semestre académico
 */
export const formatSemester = (year, semester) => {
  if (!year || !semester) return '';
  
  const semesterText = semester === 1 ? '1er Semestre' : '2do Semestre';
  return `${semesterText} ${year}`;
};

/**
 * Formatea el estado de una entidad
 */
export const formatStatus = (status) => {
  const statusMap = {
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    draft: 'Borrador',
    completed: 'Completado',
    cancelled: 'Cancelado'
  };
  
  return statusMap[status] || capitalizeFirst(status);
};

// ===== FORMATEO DE LISTAS =====

/**
 * Formatea una lista de elementos con conjunciones
 */
export const formatList = (items, conjunction = 'y') => {
  if (!items || !Array.isArray(items) || items.length === 0) return '';
  
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  
  return `${otherItems.join(', ')} ${conjunction} ${lastItem}`;
};

// ===== UTILIDADES DE VALIDACIÓN DE FORMATO =====

/**
 * Valida si un string es un email válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si un string es un teléfono válido
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
};

// Objeto con todos los formatters para export por defecto
export default {
  // Fechas
  formatDate,
  formatDateShort,
  formatRelativeDate,
  
  // Tiempo
  formatTime12Hour,
  formatTime24Hour,
  formatDuration,
  
  // Nombres
  formatFullName,
  capitalizeWords,
  capitalizeFirst,
  
  // Números
  formatNumber,
  formatPercentage,
  formatScore,
  
  // Contacto
  formatPhone,
  maskEmail,
  
  // Texto
  truncateText,
  toSlug,
  
  // Archivos
  formatFileSize,
  
  // Colores
  stringToColor,
  
  // Académicos
  formatDayOfWeek,
  formatSemester,
  formatStatus,
  
  // Listas
  formatList,
  
  // Validaciones
  isValidEmail,
  isValidPhone
};