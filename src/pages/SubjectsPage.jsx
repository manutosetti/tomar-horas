import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus } from 'lucide-react';
import { Button, Card } from '@/components/ui';

const SubjectsPage = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestión de Materias</h1>
          <p className="text-gray-400">Administra las materias del sistema educativo</p>
        </div>
        <Button variant="primary" className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nueva Materia</span>
        </Button>
      </motion.div>

      <Card>
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Módulo en desarrollo</p>
          <p className="text-gray-500 text-sm">Próximamente: Gestión completa de materias</p>
        </div>
      </Card>
    </div>
  );
};

export default SubjectsPage;