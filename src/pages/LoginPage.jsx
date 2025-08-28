import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Users, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Card } from '@/components/ui';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login, register, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    department: '',
    specialization: '',
    phone: '',
    role: 'professor'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isRegister) {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
          toast.error('Por favor completa todos los campos obligatorios');
          return;
        }
        await register(formData);
      } else {
        if (!formData.email || !formData.password) {
          toast.error('Por favor ingresa email y contraseña');
          return;
        }
        await login(formData.email, formData.password);
      }
    } catch (error) {
      console.error('Error en autenticación:', error);
    }
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      department: '',
      specialization: '',
      phone: '',
      role: 'professor'
    });
  };

  // Función para usar credenciales de demo
  const useDemo = (role) => {
    const credentials = {
      manager: {
        email: 'manager@sistema.com',
        password: 'manager123'
      },
      professor: {
        email: 'profesor@sistema.com',
        password: 'profesor123'
      }
    };

    setFormData(prev => ({
      ...prev,
      ...credentials[role]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-600/20 via-blue-600/20 to-transparent rounded-full blur-3xl" />
        
        {/* Floating particles */}
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block space-y-8"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              >
                <Clock className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-gradient">
                  Sistema de Gestión de Horas
                </h1>
                <p className="text-xl text-gray-300 mt-2">
                  Administración inteligente para instituciones educativas
                </p>
              </div>
            </div>
            
            <div className="space-y-4 pl-4">
              {[
                { icon: Users, text: 'Gestión completa de profesores', color: 'text-blue-400' },
                { icon: Clock, text: 'Asignación inteligente de horarios', color: 'text-purple-400' },
                { 
                  icon: () => (
                    <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">★</span>
                    </div>
                  ), 
                  text: 'Sistema de puntuación avanzado', 
                  color: 'text-yellow-400' 
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                  <span className="text-gray-300">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '150+', label: 'Profesores' },
              { value: '300+', label: 'Materias' },
              { value: '1200+', label: 'Horas' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="glass p-4 rounded-xl text-center hover-lift"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full"
        >
          <Card className="max-w-md mx-auto p-8 glass-strong">
            <div className="text-center mb-8">
              <motion.div 
                className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Lock className="w-6 h-6 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
              </h2>
              <p className="text-gray-400">
                {isRegister 
                  ? 'Completa tus datos para registrarte'
                  : 'Accede a tu cuenta del sistema'
                }
              </p>
            </div>

            {/* Demo Credentials */}
            {!isRegister && (
              <motion.div 
                className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-sm text-blue-300 mb-3 font-medium">Credenciales de prueba:</p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => useDemo('manager')}
                    className="w-full text-left p-2 rounded bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                  >
                    <div className="text-xs text-white font-medium">👨‍💼 Manager</div>
                    <div className="text-xs text-gray-300">manager@sistema.com / manager123</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => useDemo('professor')}
                    className="w-full text-left p-2 rounded bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
                  >
                    <div className="text-xs text-white font-medium">🎓 Profesor</div>
                    <div className="text-xs text-gray-300">profesor@sistema.com / profesor123</div>
                  </button>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Nombre"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Apellido"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <Input
                    label="Departamento"
                    name="department"
                    type="text"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="ej: Matemáticas, Física..."
                  />
                  
                  <Input
                    label="Especialización"
                    name="specialization"
                    type="text"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    placeholder="ej: Cálculo, Mecánica Cuántica..."
                  />
                  
                  <Input
                    label="Teléfono"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+54 280 123-4567"
                  />
                </motion.div>
              )}

              <Input
                label="Email"
                name="email"
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <div className="relative">
                <Input
                  label="Contraseña"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={switchMode}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                {isRegister 
                  ? '¿Ya tienes cuenta? Inicia sesión'
                  : '¿No tienes cuenta? Regístrate'
                }
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-gray-500">
                Al continuar, aceptas nuestros términos de servicio y política de privacidad
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;