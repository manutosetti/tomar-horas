import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const { sidebarOpen } = useApp();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-dark text-white">
      {/* Header */}
      <Header />
      
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`
            flex-1 transition-all duration-300 ease-in-out
            ${sidebarOpen ? 'ml-64' : 'ml-16'}
            p-6 overflow-y-auto bg-black/20
          `}
        >
          {/* Content Container */}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;