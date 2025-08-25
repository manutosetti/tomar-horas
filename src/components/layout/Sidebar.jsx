import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Clock,
  Calendar,
  BarChart3,
  Settings,
  User,
  ChevronRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import clsx from 'clsx';

const Sidebar = () => {
  const { sidebarOpen } = useApp();
  const { user, isManager } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['manager', 'professor']
    },
    {
      name: 'Profesores',
      href: '/professors',
      icon: Users,
      roles: ['manager']
    },
    {
      name: 'Materias',
      href: '/subjects',
      icon: BookOpen,
      roles: ['manager', 'professor']
    },
    {
      name: 'Horarios',
      href: '/schedules',
      icon: Calendar,
      roles: ['manager', 'professor']
    },
    {
      name: 'Asignación de Horas',
      href: '/hours',
      icon: Clock,
      roles: ['manager', 'professor']
    },
    {
      name: 'Reportes',
      href: '/reports',
      icon: BarChart3,
      roles: ['manager']
    }
  ];

  const bottomItems = [
    {
      name: 'Mi Perfil',
      href: '/profile',
      icon: User,
      roles: ['manager', 'professor']
    },
    {
      name: 'Configuración',
      href: '/settings',
      icon: Settings,
      roles: ['manager', 'professor']
    }
  ];

  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const filteredBottomItems = bottomItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <motion.aside
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className={clsx(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] glass-strong border-r border-white/10 transition-all duration-300 z-40',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    clsx(
                      'group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                      'hover:bg-white/10 hover:text-white',
                      isActive
                        ? 'bg-gradient-primary text-white shadow-lg'
                        : 'text-gray-300'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={clsx(
                        'flex-shrink-0 w-5 h-5',
                        sidebarOpen ? 'mr-3' : 'mx-auto'
                      )} />
                      
                      {sidebarOpen && (
                        <span className="truncate">{item.name}</span>
                      )}
                      
                      {sidebarOpen && isActive && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                      
                      {/* Tooltip para sidebar colapsado */}
                      {!sidebarOpen && (
                        <div className="absolute left-16 px-3 py-2 ml-2 text-sm font-medium text-white bg-gray-900 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                          {item.name}
                          <div className="absolute top-1/2 left-0 w-0 h-0 -ml-1 border-r-4 border-r-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent transform -translate-y-1/2" />
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Separator */}
          <div className="border-t border-white/10 my-4" />

          {/* Statistics Panel (solo visible cuando sidebar abierto) */}
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 glass rounded-xl"
            >
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                Resumen Rápido
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Profesores Activos</span>
                  <span className="text-green-400">12</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Materias</span>
                  <span className="text-blue-400">24</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Horas Asignadas</span>
                  <span className="text-purple-400">156</span>
                </div>
              </div>
            </motion.div>
          )}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-white/10 space-y-1">
          {filteredBottomItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  clsx(
                    'group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                    'hover:bg-white/10 hover:text-white',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300'
                  )
                }
              >
                <item.icon className={clsx(
                  'flex-shrink-0 w-5 h-5',
                  sidebarOpen ? 'mr-3' : 'mx-auto'
                )} />
                
                {sidebarOpen && (
                  <span className="truncate">{item.name}</span>
                )}
                
                {/* Tooltip para sidebar colapsado */}
                {!sidebarOpen && (
                  <div className="absolute left-16 px-3 py-2 ml-2 text-sm font-medium text-white bg-gray-900 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.name}
                    <div className="absolute top-1/2 left-0 w-0 h-0 -ml-1 border-r-4 border-r-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent transform -translate-y-1/2" />
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Info (cuando sidebar está abierto) */}
        {sidebarOpen && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t border-white/10"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.profile?.firstName} {user.profile?.lastName}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {user.role === 'manager' ? 'Administrador' : 'Profesor'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;