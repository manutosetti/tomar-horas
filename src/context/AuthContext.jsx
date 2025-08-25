import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

// Estado inicial
const initialState = {
  user: null,
  loading: true,
  error: null,
};

// Tipos de acciones
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case AUTH_ACTIONS.SET_USER:
      return { 
        ...state, 
        user: action.payload, 
        loading: false, 
        error: null 
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return { 
        ...state, 
        error: action.payload, 
        loading: false 
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return { 
        ...state, 
        user: null, 
        loading: false, 
        error: null 
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// Crear contexto
const AuthContext = createContext(null);

// Provider de autenticación
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Simular almacenamiento local (ya que no podemos usar localStorage)
  let userStorage = null;

  // Función para login
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Simular API call - En producción esto sería una llamada real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usuarios de ejemplo
      const mockUsers = [
        {
          id: '1',
          email: 'manager@sistema.com',
          password: 'manager123',
          role: 'manager',
          profile: {
            firstName: 'Admin',
            lastName: 'Manager',
            department: 'Administración',
            avatar: null
          }
        },
        {
          id: '2', 
          email: 'profesor@sistema.com',
          password: 'profesor123',
          role: 'professor',
          profile: {
            firstName: 'Juan',
            lastName: 'Pérez',
            department: 'Matemáticas',
            specialization: 'Cálculo y Álgebra',
            avatar: null
          }
        }
      ];

      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Crear token simulado
      const token = btoa(JSON.stringify({ 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
      }));

      const userData = {
        ...user,
        token
      };

      // Simular almacenamiento
      userStorage = userData;
      
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: userData });
      toast.success(`Bienvenido, ${user.profile.firstName}!`);
      
      return userData;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      toast.error(error.message);
      throw error;
    }
  };

  // Función para register
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        role: userData.role || 'professor',
        profile: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          department: userData.department,
          specialization: userData.specialization,
          phone: userData.phone,
          avatar: null
        }
      };

      const token = btoa(JSON.stringify({ 
        userId: newUser.id, 
        email: newUser.email, 
        role: newUser.role,
        exp: Date.now() + (24 * 60 * 60 * 1000)
      }));

      const registeredUser = { ...newUser, token };
      
      // Simular almacenamiento
      userStorage = registeredUser;
      
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: registeredUser });
      toast.success(`Registro exitoso. Bienvenido, ${newUser.profile.firstName}!`);
      
      return registeredUser;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      toast.error(error.message);
      throw error;
    }
  };

  // Función para logout
  const logout = () => {
    userStorage = null;
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.success('Sesión cerrada correctamente');
  };

  // Función para actualizar perfil
  const updateProfile = async (profileData) => {
    if (!state.user) return;
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = {
        ...state.user,
        profile: {
          ...state.user.profile,
          ...profileData
        }
      };
      
      userStorage = updatedUser;
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: updatedUser });
      toast.success('Perfil actualizado correctamente');
      
      return updatedUser;
    } catch (error) {
      toast.error('Error al actualizar el perfil');
      throw error;
    }
  };

  // Función para verificar si el token es válido
  const isTokenValid = (token) => {
    try {
      const decoded = JSON.parse(atob(token));
      return decoded.exp > Date.now();
    } catch {
      return false;
    }
  };

  // Función para verificar autenticación al cargar
  const checkAuth = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Simular verificación de token
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (userStorage && userStorage.token && isTokenValid(userStorage.token)) {
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: userStorage });
      } else {
        userStorage = null;
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, []);

  // Limpiar errores automáticamente
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.error]);

  const value = {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!state.user,
    isManager: state.user?.role === 'manager',
    isProfessor: state.user?.role === 'professor',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  
  return context;
};