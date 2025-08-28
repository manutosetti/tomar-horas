import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Award,
  BookOpen
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Button, Card, Input, Modal, Badge } from '@/components/ui';
import { useDebouncedSearch } from '@/hooks/useDebounce';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ProfessorsPage = () => {
  const { appData, addProfessor, updateProfessor, deleteProfessor } = useApp();
  const { isManager } = useAuth();
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'add', 'edit', 'delete'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Simular función de búsqueda
  const mockSearchFunction = async (query) => {
    return appData.professors.filter(prof => 
      prof.firstName.toLowerCase().includes(query.toLowerCase()) ||
      prof.lastName.toLowerCase().includes(query.toLowerCase()) ||
      prof.email.toLowerCase().includes(query.toLowerCase()) ||
      prof.department.toLowerCase().includes(query.toLowerCase())
    );
  };

  const { query, setQuery, results } = useDebouncedSearch(mockSearchFunction, 300);

  // Filtrar profesores
  const filteredProfessors = useMemo(() => {
    let filtered = query ? results : appData.professors;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(prof => prof.isActive === (statusFilter === 'active'));
    }
    
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(prof => prof.department === departmentFilter);
    }
    
    return filtered;
  }, [query, results, appData.professors, statusFilter, departmentFilter]);

  // Obtener departamentos únicos
  const departments = useMemo(() => {
    return [...new Set(appData.professors.map(prof => prof.department))];
  }, [appData.professors]);

  const handleAddProfessor = () => {
    setSelectedProfessor(null);
    setModalType('add');
    setShowModal(true);
  };

  const handleViewProfessor = (professor) => {
    setSelectedProfessor(professor);
    setModalType('view');
    setShowModal(true);
  };

  const handleEditProfessor = (professor) => {
    setSelectedProfessor(professor);
    setModalType('edit');
    setShowModal(true);
  };

  const handleDeleteProfessor = (professor) => {
    setSelectedProfessor(professor);
    setModalType('delete');
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (selectedProfessor) {
      deleteProfessor(selectedProfessor.id);
      setShowModal(false);
      setSelectedProfessor(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-400" />
            Gestión de Profesores
          </h1>
          <p className="text-gray-400">
            Administra la información y asignaciones de los profesores
          </p>
        </div>
        
        {isManager && (
          <Button
            variant="primary"
            onClick={handleAddProfessor}
            className="flex items-center space-x-2 mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Profesor</span>
          </Button>
        )}
      </motion.div>

      {/* Filtros y búsqueda */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o departamento..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass rounded-lg border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Filtros */}
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass rounded-lg px-4 py-3 text-white bg-transparent border-0 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all" className="bg-gray-800">Todos los estados</option>
              <option value="active" className="bg-gray-800">Activos</option>
              <option value="inactive" className="bg-gray-800">Inactivos</option>
            </select>
            
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="glass rounded-lg px-4 py-3 text-white bg-transparent border-0 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all" className="bg-gray-800">Todos los departamentos</option>
              {departments.map(dept => (
                <option key={dept} value={dept} className="bg-gray-800">{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de profesores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProfessors.map((professor) => (
            <ProfessorCard
              key={professor.id}
              professor={professor}
              onView={handleViewProfessor}
              onEdit={handleEditProfessor}
              onDelete={handleDeleteProfessor}
              isManager={isManager}
            />
          ))}
        </AnimatePresence>
        
        {filteredProfessors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12"
          >
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No se encontraron profesores</p>
            <p className="text-gray-500 text-sm">
              {query ? 'Intenta con otros términos de búsqueda' : 'Agrega profesores para comenzar'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        size="lg"
      >
        {modalType === 'view' && selectedProfessor && (
          <ProfessorDetailModal
            professor={selectedProfessor}
            onClose={() => setShowModal(false)}
          />
        )}
        {modalType === 'add' && (
          <ProfessorFormModal
            onClose={() => setShowModal(false)}
            onSave={addProfessor}
            title="Agregar Nuevo Profesor"
          />
        )}
        {modalType === 'edit' && selectedProfessor && (
          <ProfessorFormModal
            professor={selectedProfessor}
            onClose={() => setShowModal(false)}
            onSave={(data) => updateProfessor(selectedProfessor.id, data)}
            title="Editar Profesor"
          />
        )}
        {modalType === 'delete' && selectedProfessor && (
          <DeleteConfirmModal
            professor={selectedProfessor}
            onConfirm={confirmDelete}
            onCancel={() => setShowModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};

// Componente de tarjeta de profesor
const ProfessorCard = ({ professor, onView, onEdit, onDelete, isManager }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative"
    >
      <Card className="p-6 hover-lift group">
        {/* Header con acciones */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          
          {isManager && (
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {showActions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 glass-strong rounded-lg shadow-lg z-10"
                  >
                    <div className="p-2">
                      <button
                        onClick={() => onView(professor)}
                        className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded"
                      >
                        <Eye className="w-4 h-4 mr-3" />
                        Ver detalles
                      </button>
                      <button
                        onClick={() => onEdit(professor)}
                        className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded"
                      >
                        <Edit className="w-4 h-4 mr-3" />
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(professor)}
                        className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                      >
                        <Trash2 className="w-4 h-4 mr-3" />
                        Eliminar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Información principal */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-white">
              {professor.firstName} {professor.lastName}
            </h3>
            <p className="text-gray-400 text-sm">{professor.specialization}</p>
          </div>
          
          <div className="flex items-center text-gray-300 text-sm">
            <BookOpen className="w-4 h-4 mr-2" />
            {professor.department}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-300 text-sm">
              <Award className="w-4 h-4 mr-2" />
              <span>{professor.totalScore} pts</span>
            </div>
            
            <Badge variant={professor.isActive ? 'success' : 'gray'} size="sm">
              {professor.isActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
          
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                <span className="truncate">{professor.email}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Modal de detalles del profesor
const ProfessorDetailModal = ({ professor, onClose }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-2xl font-bold text-white">Detalles del Profesor</h3>
      <Button variant="ghost" size="sm" onClick={onClose}>
        ✕
      </Button>
    </div>
    
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nombre completo
          </label>
          <p className="text-white">
            {professor.firstName} {professor.lastName}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <p className="text-white">{professor.email}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Departamento
          </label>
          <p className="text-white">{professor.department}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Especialización
          </label>
          <p className="text-white">{professor.specialization}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Puntuación Total
          </label>
          <p className="text-white">{professor.totalScore} puntos</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Estado
          </label>
          <Badge variant={professor.isActive ? 'success' : 'gray'}>
            {professor.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </div>
    </div>
  </div>
);

// Modal de formulario para agregar/editar profesor
const ProfessorFormModal = ({ professor, onClose, onSave, title }) => {
  const [formData, setFormData] = useState({
    firstName: professor?.firstName || '',
    lastName: professor?.lastName || '',
    email: professor?.email || '',
    department: professor?.department || '',
    specialization: professor?.specialization || '',
    phone: professor?.phone || '',
    isActive: professor?.isActive ?? true
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo
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
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'El departamento es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await onSave(formData);
      onClose();
      toast.success(professor ? 'Profesor actualizado' : 'Profesor creado');
    } catch (error) {
      toast.error('Error al guardar profesor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />
          
          <Input
            label="Apellido"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
        </div>
        
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={Mail}
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Departamento"
            name="department"
            value={formData.department}
            onChange={handleChange}
            error={errors.department}
            required
          />
          
          <Input
            label="Especialización"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
          />
        </div>
        
        <Input
          label="Teléfono"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          icon={Phone}
        />
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 bg-transparent border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="text-sm text-gray-300">
            Profesor activo
          </label>
        </div>
        
        <div className="flex justify-end space-x-3 pt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {professor ? 'Actualizar' : 'Crear'} Profesor
          </Button>
        </div>
      </form>
    </div>
  );
};

// Modal de confirmación de eliminación
const DeleteConfirmModal = ({ professor, onConfirm, onCancel }) => (
  <div className="text-center">
    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
      <Trash2 className="h-6 w-6 text-red-600" />
    </div>
    
    <h3 className="text-lg font-medium text-white mb-2">
      Eliminar Profesor
    </h3>
    
    <p className="text-gray-400 mb-6">
      ¿Estás seguro de que deseas eliminar a{' '}
      <strong className="text-white">
        {professor.firstName} {professor.lastName}
      </strong>?
      Esta acción no se puede deshacer.
    </p>
    
    <div className="flex justify-center space-x-3">
      <Button variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        Eliminar
      </Button>
    </div>
  </div>
);

export default ProfessorsPage;