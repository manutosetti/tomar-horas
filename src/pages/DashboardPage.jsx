import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  Clock,
  TrendingUp,
  Calendar,
  Award,
  Activity,
  Plus
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { Card, Button, Badge } from '@/components/ui';

const DashboardPage = () => {
  const { user, isManager } = useAuth();
  const { appData } = useApp();

  const stats = [
    {
      title: 'Total Profesores',
      value: appData.stats.totalProfessors,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Materias Activas',
      value: appData.stats.totalSubjects,
      icon: BookOpen,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Horas Asignadas',
      value: appData.stats.totalHours,
      icon: Clock,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Puntuación Promedio',
      value: appData.stats.averageScore,
      icon: Award,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      change: '+3%',
      changeType: 'positive'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'assignment',
      message: 'Nuevas horas asignadas a Juan Pérez para Cálculo I',
      time: 'Hace 2 horas',
      icon: Clock,
      color: 'text-blue-400'
    },
    {
      id: 2,
      type: 'professor',
      message: 'María González actualizó su perfil',
      time: 'Hace 4 horas',
      icon: Users,
      color: 'text-green-400'
    },
    {
      id: 3,
      type: 'subject',
      message: 'Nueva materia "Física Cuántica" agregada al sistema',
      time: 'Hace 1 día',
      icon: BookOpen,
      color: 'text-purple-400'
    },
    {
      id: 4,
      type: 'score',
      message: 'Puntuaciones actualizadas para el semestre 2024-2',
      time: 'Hace 2 días',
      icon: TrendingUp,
      color: 'text-yellow-400'
    }
  ];

  const upcomingSchedules = [
    {
      id: 1,
      subject: 'Cálculo I',
      professor: 'Juan Pérez',
      time: '08:00 - 10:00',
      room: 'Aula 101',
      day: 'Lunes'
    },
    {
      id: 2,
      subject: 'Física General',
      professor: 'María González',
      time: '10:00 - 12:00',
      room: 'Laboratorio A',
      day: 'Martes'
    },
    {
      id: 3,
      subject: 'Álgebra Lineal',
      professor: 'Carlos Ruiz',
      time: '14:00 - 16:00',
      room: 'Aula 205',
      day: 'Miércoles'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400">
            Bienvenido de vuelta, {user?.profile?.firstName}. 
            Aquí tienes un resumen de la actividad del sistema.
          </p>
        </div>
        {isManager && (
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button variant="primary" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nuevo Profesor</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Ver Calendario</span>
            </Button>
          </div>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs ${
                      stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs mes anterior</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-400" />
                Actividad Reciente
              </h3>
              <Button variant="ghost" size="sm">
                Ver todo
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 glass rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className={`w-8 h-8 ${activity.color.replace('text-', 'bg-').replace('400', '500/20')} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{activity.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Upcoming Schedules */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                Próximos Horarios
              </h3>
            </div>
            <div className="space-y-4">
              {upcomingSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="p-4 glass rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white text-sm">{schedule.subject}</h4>
                    <Badge variant="primary" size="sm">
                      {schedule.day}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">{schedule.professor}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{schedule.time}</span>
                    <span>{schedule.room}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              Ver Calendario Completo
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions for Managers */}
      {isManager && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="flex flex-col items-center p-6 h-auto">
                <Users className="w-8 h-8 text-blue-400 mb-2" />
                <span className="font-medium">Gestionar Profesores</span>
                <span className="text-xs text-gray-400 mt-1">Agregar, editar o eliminar</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center p-6 h-auto">
                <BookOpen className="w-8 h-8 text-green-400 mb-2" />
                <span className="font-medium">Administrar Materias</span>
                <span className="text-xs text-gray-400 mt-1">Crear nuevas materias</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center p-6 h-auto">
                <Clock className="w-8 h-8 text-purple-400 mb-2" />
                <span className="font-medium">Asignar Horas</span>
                <span className="text-xs text-gray-400 mt-1">Distribuir carga horaria</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center p-6 h-auto">
                <Activity className="w-8 h-8 text-yellow-400 mb-2" />
                <span className="font-medium">Ver Reportes</span>
                <span className="text-xs text-gray-400 mt-1">Análisis y estadísticas</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Professor Dashboard */}
      {!isManager && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-400" />
              Mis Asignaciones
            </h3>
            <div className="text-center py-8">
              <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No tienes asignaciones de horas activas</p>
              <Button variant="primary">
                Ver Mis Horarios
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardPage;