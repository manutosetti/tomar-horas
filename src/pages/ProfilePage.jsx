import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Key,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Settings,
  Award,
  BookOpen,
  Clock,
  Activity
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { Button, Card, Input, Modal, Badge } from '@/components/ui';
import { useDebounce } from '@/hooks/useDebounce';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { addNotification } = useApp();
  const { effectiveTheme, toggleTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'preferences', label: 'Preferencias', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <User className="w-8 h-8 mr-3 text-blue-400" />
            Mi Perfil
          </h1>
          <p className="text-gray-400">
            Gestiona tu información personal y preferencias
          </p>
        </div>
      </motion.div>

      {/* Profile Overview Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {user?.profile?.firstName?.[0]}{user?.profile?.lastName?.[0]}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              {user?.profile?.firstName} {user?.profile?.lastName}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {user?.email}
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                {user?.profile?.department || 'No especificado'}
              </div>
              <Badge variant="primary" size="sm">
                {user?.role === 'manager' ? 'Administrador' : 'Profesor'}
              </Badge>
            </div>
            <div className="mt-3">
              <p className="text-gray-400 text-sm">
                {user?.profile?.specialization || 'Sin especialización definida'}
              </p>
            </div>
          </div>

          {/* Quick Stats for Professors */}
          {user?.role === 'professor' && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-white">0</div>
                <div className="text-xs text-gray-400">Materias</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">0</div>
                <div className="text-xs text-gray-400">Horas</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">0</div>
                <div className="text-xs text-gray-400">Puntos</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="border-b border-white/10">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'preferences' && <PreferencesTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Tab de Perfil
const ProfileTab = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    department: user?.profile?.department || '',
    specialization: user?.profile?.specialization || '',
    phone: user?.profile?.phone || '',
    address: user?.profile?.address || '',
    bio: user?.profile?.bio || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const debouncedFormData = useDebounce(formData, 300);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      department: user?.profile?.department || '',
      specialization: user?.profile?.specialization || '',
      phone: user?.profile?.phone || '',
      address: user?.profile?.address || '',
      bio: user?.profile?.bio || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Información Personal</h3>
        <Button
          variant={isEditing ? "outline" : "primary"}
          onClick={isEditing ? handleCancel : () => setIsEditing(true)}
          className="flex items-center space-x-2"
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nombre"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.firstName}
            icon={User}
            required
          />
          
          <Input
            label="Apellido"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.lastName}
            icon={User}
            required
          />
          
          <Input
            label="Departamento"
            name="department"
            value={formData.department}
            onChange={handleChange}
            disabled={!isEditing}
            icon={BookOpen}
            placeholder="ej: Matemáticas, Física..."
          />
          
          <Input
            label="Especialización"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            disabled={!isEditing}
            icon={Award}
            placeholder="ej: Cálculo, Mecánica Cuántica..."
          />
          
          <Input
            label="Teléfono"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            icon={Phone}
            placeholder="+54 280 123-4567"
          />
          
          <Input
            label="Dirección"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing}
            icon={MapPin}
            placeholder="Dirección completa"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Biografía
          </label>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Cuéntanos un poco sobre ti..."
            className={`w-full px-4 py-3 glass rounded-lg border-0 text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        )}
      </form>

      {/* Account Information */}
      <div className="mt-8 pt-8 border-t border-white/10">
        <h4 className="text-lg font-semibold text-white mb-4">Información de la Cuenta</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <p className="text-white bg-white/5 px-4 py-3 rounded-lg">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rol</label>
            <Badge variant="primary">
              {user?.role === 'manager' ? 'Administrador' : 'Profesor'}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Tab de Seguridad
const SecurityTab = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    return score;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(passwordData.newPassword));
  }, [passwordData.newPassword]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (passwordStrength < 75) {
      toast.error('La contraseña debe ser más segura');
      return;
    }

    setLoading(true);
    
    try {
      // Simular cambio de contraseña
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Contraseña actualizada correctamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500';
    if (passwordStrength < 50) return 'bg-orange-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Muy débil';
    if (passwordStrength < 50) return 'Débil';
    if (passwordStrength < 75) return 'Aceptable';
    return 'Fuerte';
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Key className="w-5 h-5 mr-2" />
          Cambiar Contraseña
        </h3>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="relative">
            <Input
              label="Contraseña Actual"
              name="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-white"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Nueva Contraseña"
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-white"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {passwordData.newPassword && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Seguridad:</span>
                <span className={`font-medium ${
                  passwordStrength < 50 ? 'text-red-400' : 
                  passwordStrength < 75 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
            </div>
          )}

          <div className="relative">
            <Input
              label="Confirmar Nueva Contraseña"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-white"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <Button type="submit" variant="primary" loading={loading} className="w-full">
            Actualizar Contraseña
          </Button>
        </form>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Configuración de Seguridad</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Autenticación de dos factores</p>
              <p className="text-sm text-gray-400">Agrega una capa extra de seguridad</p>
            </div>
            <Button variant="outline" size="sm">
              Configurar
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Sesiones activas</p>
              <p className="text-sm text-gray-400">Administra tus sesiones abiertas</p>
            </div>
            <Button variant="outline" size="sm">
              Ver sesiones
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Tab de Notificaciones
const NotificationsTab = () => {
  const [notifications, setNotifications] = useState({
    email: {
      assignments: true,
      updates: true,
      reminders: false,
      newsletter: false,
    },
    push: {
      assignments: true,
      updates: false,
      reminders: true,
    },
    desktop: {
      assignments: true,
      updates: true,
    }
  });

  const handleNotificationChange = (type, setting, value) => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [setting]: value
      }
    }));
    toast.success('Configuración actualizada');
  };

  const NotificationSection = ({ title, type, settings }) => (
    <div className="space-y-4">
      <h4 className="font-medium text-white">{title}</h4>
      {Object.entries(settings).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 capitalize">
              {key === 'assignments' ? 'Asignaciones' :
               key === 'updates' ? 'Actualizaciones' :
               key === 'reminders' ? 'Recordatorios' : 'Newsletter'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleNotificationChange(type, key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <Bell className="w-5 h-5 mr-2" />
        Preferencias de Notificación
      </h3>

      <div className="space-y-8">
        <NotificationSection
          title="📧 Notificaciones por Email"
          type="email"
          settings={notifications.email}
        />
        
        <NotificationSection
          title="📱 Notificaciones Push"
          type="push"
          settings={notifications.push}
        />
        
        <NotificationSection
          title="💻 Notificaciones de Escritorio"
          type="desktop"
          settings={notifications.desktop}
        />
      </div>
    </Card>
  );
};

// Tab de Preferencias
const PreferencesTab = () => {
  const { effectiveTheme, setTheme, THEME_PRESETS } = useTheme();
  const [preferences, setPreferences] = useState({
    language: 'es',
    timezone: 'America/Argentina/Buenos_Aires',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  });

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('Preferencia actualizada');
  };

  return (
    <div className="space-y-6">
      {/* Tema */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Apariencia</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Tema</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(THEME_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => setTheme(preset.theme)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    effectiveTheme === preset.theme
                      ? 'border-blue-400 bg-blue-500/20'
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <div className="text-white font-medium text-sm">{preset.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Idioma y Región */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Idioma y Región</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Idioma</label>
            <select
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="w-full px-4 py-3 glass rounded-lg border-0 text-white bg-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="es" className="bg-gray-800">Español</option>
              <option value="en" className="bg-gray-800">English</option>
              <option value="pt" className="bg-gray-800">Português</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Zona horaria</label>
            <select
              value={preferences.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
              className="w-full px-4 py-3 glass rounded-lg border-0 text-white bg-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="America/Argentina/Buenos_Aires" className="bg-gray-800">Buenos Aires</option>
              <option value="America/Mexico_City" className="bg-gray-800">Ciudad de México</option>
              <option value="Europe/Madrid" className="bg-gray-800">Madrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Formato de fecha</label>
            <select
              value={preferences.dateFormat}
              onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
              className="w-full px-4 py-3 glass rounded-lg border-0 text-white bg-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="DD/MM/YYYY" className="bg-gray-800">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY" className="bg-gray-800">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD" className="bg-gray-800">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Formato de hora</label>
            <select
              value={preferences.timeFormat}
              onChange={(e) => handlePreferenceChange('timeFormat', e.target.value)}
              className="w-full px-4 py-3 glass rounded-lg border-0 text-white bg-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h" className="bg-gray-800">24 horas</option>
              <option value="12h" className="bg-gray-800">12 horas (AM/PM)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Datos y Privacidad */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Datos y Privacidad</h3>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Activity className="w-4 h-4 mr-2" />
            Descargar mis datos
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <AlertCircle className="w-4 h-4 mr-2" />
            Eliminar cuenta
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;