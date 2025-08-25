import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Estado inicial
const initialState = {
  theme: 'dark',
  sidebarOpen: true,
  notifications: [],
  settings: {
    language: 'es',
    timeFormat: '24h',
    notifications: {
      email: true,
      push: true,
      desktop: true
    }
  },
  appData: {
    professors: [],
    subjects: [],
    schedules: [],
    hours: [],
    stats: {
      totalProfessors: 0,
      totalSubjects: 0,
      totalHours: 0,
      averageScore: 0
    }
  }
};

// Tipos de acciones
const APP_ACTIONS = {
  SET_THEME: 'SET_THEME',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SIDEBAR: 'SET_SIDEBAR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  SET_PROFESSORS: 'SET_PROFESSORS',
  ADD_PROFESSOR: 'ADD_PROFESSOR',
  UPDATE_PROFESSOR: 'UPDATE_PROFESSOR',
  DELETE_PROFESSOR: 'DELETE_PROFESSOR',
  SET_SUBJECTS: 'SET_SUBJECTS',
  ADD_SUBJECT: 'ADD_SUBJECT',
  UPDATE_SUBJECT: 'UPDATE_SUBJECT',
  DELETE_SUBJECT: 'DELETE_SUBJECT',
  SET_SCHEDULES: 'SET_SCHEDULES',
  ADD_SCHEDULE: 'ADD_SCHEDULE',
  UPDATE_SCHEDULE: 'UPDATE_SCHEDULE',
  DELETE_SCHEDULE: 'DELETE_SCHEDULE',
  SET_HOURS: 'SET_HOURS',
  ADD_HOUR_ASSIGNMENT: 'ADD_HOUR_ASSIGNMENT',
  UPDATE_HOUR_ASSIGNMENT: 'UPDATE_HOUR_ASSIGNMENT',
  DELETE_HOUR_ASSIGNMENT: 'DELETE_HOUR_ASSIGNMENT',
  UPDATE_STATS: 'UPDATE_STATS',
};

// Reducer de la aplicación
const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.SET_THEME:
      return { ...state, theme: action.payload };
    
    case APP_ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    
    case APP_ACTIONS.SET_SIDEBAR:
      return { ...state, sidebarOpen: action.payload };
    
    case APP_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, { 
          id: Date.now(), 
          timestamp: new Date().toISOString(),
          ...action.payload 
        }]
      };
    
    case APP_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case APP_ACTIONS.CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [] };
    
    case APP_ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    case APP_ACTIONS.SET_PROFESSORS:
      return {
        ...state,
        appData: { 
          ...state.appData, 
          professors: action.payload 
        }
      };
    
    case APP_ACTIONS.ADD_PROFESSOR:
      return {
        ...state,
        appData: {
          ...state.appData,
          professors: [...state.appData.professors, action.payload]
        }
      };
    
    case APP_ACTIONS.UPDATE_PROFESSOR:
      return {
        ...state,
        appData: {
          ...state.appData,
          professors: state.appData.professors.map(p => 
            p.id === action.payload.id ? { ...p, ...action.payload } : p
          )
        }
      };
    
    case APP_ACTIONS.DELETE_PROFESSOR:
      return {
        ...state,
        appData: {
          ...state.appData,
          professors: state.appData.professors.filter(p => p.id !== action.payload)
        }
      };
    
    case APP_ACTIONS.SET_SUBJECTS:
      return {
        ...state,
        appData: { 
          ...state.appData, 
          subjects: action.payload 
        }
      };
    
    case APP_ACTIONS.ADD_SUBJECT:
      return {
        ...state,
        appData: {
          ...state.appData,
          subjects: [...state.appData.subjects, action.payload]
        }
      };
    
    case APP_ACTIONS.UPDATE_SUBJECT:
      return {
        ...state,
        appData: {
          ...state.appData,
          subjects: state.appData.subjects.map(s => 
            s.id === action.payload.id ? { ...s, ...action.payload } : s
          )
        }
      };
    
    case APP_ACTIONS.DELETE_SUBJECT:
      return {
        ...state,
        appData: {
          ...state.appData,
          subjects: state.appData.subjects.filter(s => s.id !== action.payload)
        }
      };
    
    case APP_ACTIONS.SET_HOURS:
      return {
        ...state,
        appData: { 
          ...state.appData, 
          hours: action.payload 
        }
      };
    
    case APP_ACTIONS.ADD_HOUR_ASSIGNMENT:
      return {
        ...state,
        appData: {
          ...state.appData,
          hours: [...state.appData.hours, action.payload]
        }
      };
    
    case APP_ACTIONS.UPDATE_HOUR_ASSIGNMENT:
      return {
        ...state,
        appData: {
          ...state.appData,
          hours: state.appData.hours.map(h => 
            h.id === action.payload.id ? { ...h, ...action.payload } : h
          )
        }
      };
    
    case APP_ACTIONS.DELETE_HOUR_ASSIGNMENT:
      return {
        ...state,
        appData: {
          ...state.appData,
          hours: state.appData.hours.filter(h => h.id !== action.payload)
        }
      };
    
    case APP_ACTIONS.UPDATE_STATS:
      return {
        ...state,
        appData: {
          ...state.appData,
          stats: { ...state.appData.stats, ...action.payload }
        }
      };
    
    default:
      return state;
  }
};

// Crear contexto
const AppContext = createContext(null);

// Provider de la aplicación
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Función para calcular estadísticas
  const calculateStats = () => {
    const { professors, subjects, hours } = state.appData;
    
    const totalHours = hours.reduce((sum, h) => sum + h.assignedHours, 0);
    const totalScore = hours.reduce((sum, h) => sum + (h.scoreValue || 0), 0);
    const averageScore = hours.length > 0 ? totalScore / hours.length : 0;
    
    dispatch({
      type: APP_ACTIONS.UPDATE_STATS,
      payload: {
        totalProfessors: professors.length,
        totalSubjects: subjects.length,
        totalHours,
        averageScore: Math.round(averageScore * 100) / 100
      }
    });
  };

  // Funciones para notificaciones
  const addNotification = (notification) => {
    dispatch({
      type: APP_ACTIONS.ADD_NOTIFICATION,
      payload: notification
    });
  };

  const removeNotification = (id) => {
    dispatch({
      type: APP_ACTIONS.REMOVE_NOTIFICATION,
      payload: id
    });
  };

  const clearNotifications = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_NOTIFICATIONS });
  };

  // Funciones para tema
  const toggleTheme = () => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    dispatch({ type: APP_ACTIONS.SET_THEME, payload: newTheme });
  };

  // Funciones para sidebar
  const toggleSidebar = () => {
    dispatch({ type: APP_ACTIONS.TOGGLE_SIDEBAR });
  };

  const setSidebarOpen = (isOpen) => {
    dispatch({ type: APP_ACTIONS.SET_SIDEBAR, payload: isOpen });
  };

  // Funciones para profesores
  const setProfessors = (professors) => {
    dispatch({ type: APP_ACTIONS.SET_PROFESSORS, payload: professors });
  };

  const addProfessor = (professor) => {
    const newProfessor = {
      id: Date.now().toString(),
      ...professor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: APP_ACTIONS.ADD_PROFESSOR, payload: newProfessor });
    addNotification({
      type: 'success',
      title: 'Profesor agregado',
      message: `${professor.firstName} ${professor.lastName} ha sido agregado exitosamente.`
    });
    return newProfessor;
  };

  const updateProfessor = (id, updates) => {
    const updatedProfessor = {
      id,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: APP_ACTIONS.UPDATE_PROFESSOR, payload: updatedProfessor });
    addNotification({
      type: 'success',
      title: 'Profesor actualizado',
      message: 'La información del profesor ha sido actualizada exitosamente.'
    });
    return updatedProfessor;
  };

  const deleteProfessor = (id) => {
    dispatch({ type: APP_ACTIONS.DELETE_PROFESSOR, payload: id });
    addNotification({
      type: 'warning',
      title: 'Profesor eliminado',
      message: 'El profesor ha sido eliminado del sistema.'
    });
  };

  // Funciones para materias
  const setSubjects = (subjects) => {
    dispatch({ type: APP_ACTIONS.SET_SUBJECTS, payload: subjects });
  };

  const addSubject = (subject) => {
    const newSubject = {
      id: Date.now().toString(),
      ...subject,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: APP_ACTIONS.ADD_SUBJECT, payload: newSubject });
    addNotification({
      type: 'success',
      title: 'Materia agregada',
      message: `${subject.name} ha sido agregada exitosamente.`
    });
    return newSubject;
  };

  // Funciones para asignaciones de horas
  const setHours = (hours) => {
    dispatch({ type: APP_ACTIONS.SET_HOURS, payload: hours });
  };

  const addHourAssignment = (assignment) => {
    const newAssignment = {
      id: Date.now().toString(),
      ...assignment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
    };
    dispatch({ type: APP_ACTIONS.ADD_HOUR_ASSIGNMENT, payload: newAssignment });
    addNotification({
      type: 'success',
      title: 'Horas asignadas',
      message: 'La asignación de horas ha sido creada exitosamente.'
    });
    return newAssignment;
  };

  // Cargar datos iniciales simulados
  useEffect(() => {
    // Simular carga de datos iniciales
    const loadInitialData = () => {
      // Profesores de ejemplo
      const mockProfessors = [
        {
          id: '1',
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@universidad.edu',
          department: 'Matemáticas',
          specialization: 'Cálculo y Álgebra',
          phone: '+54 280 123-4567',
          totalScore: 95,
          isActive: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-08-20T14:30:00Z'
        },
        {
          id: '2',
          firstName: 'María',
          lastName: 'González',
          email: 'maria.gonzalez@universidad.edu',
          department: 'Física',
          specialization: 'Mecánica Cuántica',
          phone: '+54 280 123-4568',
          totalScore: 87,
          isActive: true,
          createdAt: '2024-02-10T09:00:00Z',
          updatedAt: '2024-08-19T16:45:00Z'
        }
      ];

      // Materias de ejemplo
      const mockSubjects = [
        {
          id: '1',
          name: 'Cálculo I',
          code: 'MAT101',
          description: 'Introducción al cálculo diferencial e integral',
          credits: 6,
          department: 'Matemáticas',
          isActive: true,
          createdAt: '2024-01-10T08:00:00Z',
          updatedAt: '2024-08-15T12:00:00Z'
        },
        {
          id: '2',
          name: 'Física General',
          code: 'FIS101',
          description: 'Conceptos fundamentales de la física clásica',
          credits: 8,
          department: 'Física',
          isActive: true,
          createdAt: '2024-01-12T10:00:00Z',
          updatedAt: '2024-08-16T14:20:00Z'
        }
      ];

      // Asignaciones de horas de ejemplo
      const mockHours = [
        {
          id: '1',
          professorId: '1',
          subjectId: '1',
          semester: '2024-2',
          year: 2024,
          assignedHours: 6,
          scoreValue: 25,
          status: 'active',
          schedule: {
            dayOfWeek: 1, // Lunes
            startTime: '08:00',
            endTime: '10:00',
            room: 'Aula 101'
          },
          createdAt: '2024-08-01T10:00:00Z',
          updatedAt: '2024-08-20T16:00:00Z'
        }
      ];

      setProfessors(mockProfessors);
      setSubjects(mockSubjects);
      setHours(mockHours);
    };

    loadInitialData();
  }, []);

  // Recalcular estadísticas cuando cambian los datos
  useEffect(() => {
    calculateStats();
  }, [state.appData.professors, state.appData.subjects, state.appData.hours]);

  const value = {
    // Estado
    theme: state.theme,
    sidebarOpen: state.sidebarOpen,
    notifications: state.notifications,
    settings: state.settings,
    appData: state.appData,
    
    // Funciones generales
    toggleTheme,
    toggleSidebar,
    setSidebarOpen,
    
    // Funciones de notificaciones
    addNotification,
    removeNotification,
    clearNotifications,
    
    // Funciones de profesores
    setProfessors,
    addProfessor,
    updateProfessor,
    deleteProfessor,
    
    // Funciones de materias
    setSubjects,
    addSubject,
    
    // Funciones de horas
    setHours,
    addHourAssignment,
    
    // Estadísticas
    calculateStats,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useApp = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  
  return context;
};