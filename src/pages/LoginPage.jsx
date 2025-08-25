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

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-600/20 via-blue-600/20 to-transparent rounded-full blur-3xl" />
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
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
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
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-blue-400" />
                <span className="text-gray-300">Gestión completa de profesores</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-purple-400" />
                <span className="text-gray-300">Asignación inteligente de horarios</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">★</span>
                </div>
                <span className="text-gray-300">Sistema de puntuación avanzado</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-gradient">150+</div>
              <div className="text-sm text-gray-400">Profesores</div>
            </div>
            <div className="glass p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-gradient">300+</div>
              <div className="text-sm text-gray-400">Materias</div>
            </div>
            <div className="glass p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-gradient">1200+</div>
              <div className="text-sm text-gray-400">Horas</div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full"
        >
          <Card className="max-w-md mx-auto p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
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
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-300 mb-2 font-medium">Credenciales de prueba:</p>
                <div className="text-xs text-gray-300 space-y-1">
                  <div><strong>Manager:</strong> manager@sistema.com / manager123</div>
                  <div><strong>Profesor:</strong> profesor@sistema.com / profesor123</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isRegister && (
                <>
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
                </>
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
                  className="absolute right-3 top-9 text-gray-400 hover:text-white"
                  onClick={() =>