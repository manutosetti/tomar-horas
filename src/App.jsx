import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';


import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';


import Layout from '@/components/layout/Layout';


import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ProfessorsPage from '@/pages/ProfessorsPage';
import SubjectsPage from '@/pages/SubjectsPage';
import SchedulesPage from '@/pages/SchedulesPage';
import HoursPage from '@/pages/HoursPage';
import ProfilePage from '@/pages/ProfilePage';


import { useAuth } from '@/hooks/useAuth';


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};


const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : children;
};


const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-dark">

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />

            <AnimatePresence mode="wait">
              <Routes>
                {/* Ruta pública - Login */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <PageTransition>
                        <LoginPage />
                      </PageTransition>
                    </PublicRoute>
                  } 
                />

                {/* Rutas protegidas */}
                <Route 
                  path="/*" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AnimatePresence mode="wait">
                          <Routes>
                            <Route 
                              path="/" 
                              element={<Navigate to="/dashboard" replace />} 
                            />
                            <Route 
                              path="/dashboard" 
                              element={
                                <PageTransition>
                                  <DashboardPage />
                                </PageTransition>
                              } 
                            />
                            <Route 
                              path="/professors" 
                              element={
                                <PageTransition>
                                  <ProfessorsPage />
                                </PageTransition>
                              } 
                            />
                            <Route 
                              path="/subjects" 
                              element={
                                <PageTransition>
                                  <SubjectsPage />
                                </PageTransition>
                              } 
                            />
                            <Route 
                              path="/schedules" 
                              element={
                                <PageTransition>
                                  <SchedulesPage />
                                </PageTransition>
                              } 
                            />
                            <Route 
                              path="/hours" 
                              element={
                                <PageTransition>
                                  <HoursPage />
                                </PageTransition>
                              } 
                            />
                            <Route 
                              path="/profile" 
                              element={
                                <PageTransition>
                                  <ProfilePage />
                                </PageTransition>
                              } 
                            />
                            {/* Ruta 404 */}
                            <Route 
                              path="*" 
                              element={
                                <PageTransition>
                                  <div className="min-h-screen flex items-center justify-center">
                                    <div className="text-center">
                                      <h1 className="text-6xl font-bold text-gradient mb-4">404</h1>
                                      <p className="text-xl text-gray-400 mb-8">Página no encontrada</p>
                                      <button 
                                        onClick={() => window.history.back()}
                                        className="bg-gradient-primary px-6 py-3 rounded-lg text-white hover:shadow-lg transition-all"
                                      >
                                        Volver
                                      </button>
                                    </div>
                                  </div>
                                </PageTransition>
                              } 
                            />
                          </Routes>
                        </AnimatePresence>
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;