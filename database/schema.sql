-- =========================================
-- SISTEMA DE GESTIÓN DE HORAS ACADÉMICAS
-- Schema de Base de Datos SQLite
-- =========================================

-- Configuración de la base de datos
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = 1000;
PRAGMA temp_store = memory;

-- =========================================
-- TABLA DE USUARIOS (SISTEMA DE AUTENTICACIÓN)
-- =========================================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('manager', 'professor', 'admin')),
  is_active BOOLEAN DEFAULT 1,
  email_verified_at TIMESTAMP NULL,
  remember_token VARCHAR(100) NULL,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- =========================================
-- TABLA DE PERFILES DE USUARIO
-- =========================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NULL,
  avatar_url VARCHAR(500) NULL,
  bio TEXT NULL,
  birth_date DATE NULL,
  address TEXT NULL,
  emergency_contact VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_profiles_user_id ON user_profiles(user_id);

-- =========================================
-- TABLA DE DEPARTAMENTOS
-- =========================================
CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(10) NOT NULL UNIQUE,
  description TEXT NULL,
  head_professor_id INTEGER NULL,
  is_active BOOLEAN DEFAULT 1,
  budget DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (head_professor_id) REFERENCES professors(id) ON DELETE SET NULL
);

CREATE INDEX idx_departments_active ON departments(is_active);
CREATE INDEX idx_departments_code ON departments(code);

-- =========================================
-- TABLA DE PROFESORES
-- =========================================
CREATE TABLE IF NOT EXISTS professors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  employee_id VARCHAR(50) NOT NULL UNIQUE,
  department_id INTEGER NOT NULL,
  specialization VARCHAR(200) NULL,
  academic_degree VARCHAR(100) NULL,
  hire_date DATE NOT NULL,
  salary DECIMAL(10,2) DEFAULT 0.00,
  max_hours_per_week INTEGER DEFAULT 40,
  total_score DECIMAL(5,2) DEFAULT 0.00,
  years_experience INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated')),
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
);

-- Índices para profesores
CREATE UNIQUE INDEX idx_professors_user_id ON professors(user_id);
CREATE UNIQUE INDEX idx_professors_employee_id ON professors(employee_id);
CREATE INDEX idx_professors_department ON professors(department_id);
CREATE INDEX idx_professors_status ON professors(status);

-- =========================================
-- TABLA DE MATERIAS/ASIGNATURAS
-- =========================================
CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(200) NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT NULL,
  department_id INTEGER NOT NULL,
  credits INTEGER NOT NULL DEFAULT 1,
  semester VARCHAR(20) NULL,
  year INTEGER NOT NULL,
  is_mandatory BOOLEAN DEFAULT 1,
  prerequisites TEXT NULL, -- JSON array de subject_ids
  max_students INTEGER DEFAULT 30,
  min_hours_per_week INTEGER DEFAULT 2,
  max_hours_per_week INTEGER DEFAULT 6,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
);

-- Índices para materias
CREATE UNIQUE INDEX idx_subjects_code ON subjects(code);
CREATE INDEX idx_subjects_department ON subjects(department_id);
CREATE INDEX idx_subjects_active ON subjects(is_active);
CREATE INDEX idx_subjects_year_semester ON subjects(year, semester);

-- =========================================
-- TABLA DE AULAS/SALONES
-- =========================================
CREATE TABLE IF NOT EXISTS classrooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  building VARCHAR(100) NULL,
  floor INTEGER NULL,
  capacity INTEGER NOT NULL DEFAULT 30,
  type VARCHAR(50) DEFAULT 'standard' CHECK (type IN ('standard', 'laboratory', 'auditorium', 'workshop')),
  equipment TEXT NULL, -- JSON array de equipamiento
  is_available BOOLEAN DEFAULT 1,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_classrooms_available ON classrooms(is_available);
CREATE INDEX idx_classrooms_type ON classrooms(type);

-- =========================================
-- TABLA DE HORARIOS/SCHEDULES
-- =========================================
CREATE TABLE IF NOT EXISTS schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL,
  classroom_id INTEGER NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Domingo, 1=Lunes...
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  semester VARCHAR(20) NOT NULL,
  year INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE RESTRICT,
  
  -- Constraint para evitar solapamiento de horarios en el mismo aula
  UNIQUE(classroom_id, day_of_week, start_time, semester, year)
);

-- Índices para horarios
CREATE INDEX idx_schedules_subject ON schedules(subject_id);
CREATE INDEX idx_schedules_classroom ON schedules(classroom_id);
CREATE INDEX idx_schedules_time ON schedules(day_of_week, start_time);
CREATE INDEX idx_schedules_semester_year ON schedules(semester, year);

-- =========================================
-- TABLA DE ASIGNACIONES DE HORAS
-- =========================================
CREATE TABLE IF NOT EXISTS hour_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  professor_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  schedule_id INTEGER NULL,
  assigned_hours INTEGER NOT NULL DEFAULT 1,
  score_value DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  semester VARCHAR(20) NOT NULL,
  year INTEGER NOT NULL,
  assignment_type VARCHAR(50) DEFAULT 'regular' CHECK (assignment_type IN ('regular', 'extra', 'substitute', 'coordination')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'completed', 'cancelled')),
  start_date DATE NOT NULL,
  end_date DATE NULL,
  notes TEXT NULL,
  created_by INTEGER NOT NULL,
  approved_by INTEGER NULL,
  approved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (professor_id) REFERENCES professors(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  
  -- Un profesor no puede tener múltiples asignaciones activas para la misma materia en el mismo período
  UNIQUE(professor_id, subject_id, semester, year, status)
);

-- Índices para asignaciones
CREATE INDEX idx_assignments_professor ON hour_assignments(professor_id);
CREATE INDEX idx_assignments_subject ON hour_assignments(subject_id);
CREATE INDEX idx_assignments_semester_year ON hour_assignments(semester, year);
CREATE INDEX idx_assignments_status ON hour_assignments(status);
CREATE INDEX idx_assignments_dates ON hour_assignments(start_date, end_date);

-- =========================================
-- TABLA DE CRITERIOS DE PUNTUACIÓN
-- =========================================
CREATE TABLE IF NOT EXISTS scoring_criteria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  weight DECIMAL(3,2) NOT NULL DEFAULT 1.00 CHECK (weight > 0),
  category VARCHAR(50) NOT NULL CHECK (category IN ('academic', 'experience', 'performance', 'extra')),
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scoring_criteria_category ON scoring_criteria(category);
CREATE INDEX idx_scoring_criteria_active ON scoring_criteria(is_active);

-- =========================================
-- TABLA DE PUNTUACIONES DE PROFESORES
-- =========================================
CREATE TABLE IF NOT EXISTS professor_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  professor_id INTEGER NOT NULL,
  criteria_id INTEGER NOT NULL,
  score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  semester VARCHAR(20) NOT NULL,
  year INTEGER NOT NULL,
  evaluated_by INTEGER NOT NULL,
  comments TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (professor_id) REFERENCES professors(id) ON DELETE CASCADE,
  FOREIGN KEY (criteria_id) REFERENCES scoring_criteria(id) ON DELETE RESTRICT,
  FOREIGN KEY (evaluated_by) REFERENCES users(id) ON DELETE RESTRICT,
  
  -- Un profesor solo puede tener una puntuación por criterio por período
  UNIQUE(professor_id, criteria_id, semester, year)
);

-- Índices para puntuaciones
CREATE INDEX idx_professor_scores_professor ON professor_scores(professor_id);
CREATE INDEX idx_professor_scores_criteria ON professor_scores(criteria_id);
CREATE INDEX idx_professor_scores_period ON professor_scores(semester, year);

-- =========================================
-- TABLA DE NOTIFICACIONES
-- =========================================
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT 0,
  action_url VARCHAR(500) NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para notificaciones
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- =========================================
-- TABLA DE ACTIVIDAD/LOGS
-- =========================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INTEGER NULL,
  old_values TEXT NULL, -- JSON
  new_values TEXT NULL, -- JSON
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para logs
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);

-- =========================================
-- TABLA DE CONFIGURACIÓN DEL SISTEMA
-- =========================================
CREATE TABLE IF NOT EXISTS system_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT NULL,
  description TEXT NULL,
  type VARCHAR(50) DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
  is_public BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_system_settings_key ON system_settings(key);

-- =========================================
-- VISTAS ÚTILES
-- =========================================

-- Vista de profesores con información completa
CREATE VIEW IF NOT EXISTS professor_details AS
SELECT 
  p.id,
  p.employee_id,
  u.email,
  up.first_name,
  up.last_name,
  CONCAT(up.first_name, ' ', up.last_name) as full_name,
  up.phone,
  d.name as department_name,
  d.code as department_code,
  p.specialization,
  p.academic_degree,
  p.hire_date,
  p.total_score,
  p.years_experience,
  p.status,
  p.max_hours_per_week,
  p.created_at,
  p.updated_at
FROM professors p
JOIN users u ON p.user_id = u.id
JOIN user_profiles up ON u.id = up.user_id
JOIN departments d ON p.department_id = d.id;

-- Vista de asignaciones con detalles completos
CREATE VIEW IF NOT EXISTS assignment_details AS
SELECT 
  ha.id,
  ha.assigned_hours,
  ha.score_value,
  ha.semester,
  ha.year,
  ha.assignment_type,
  ha.status,
  ha.start_date,
  ha.end_date,
  p.employee_id,
  CONCAT(up.first_name, ' ', up.last_name) as professor_name,
  s.name as subject_name,
  s.code as subject_code,
  d.name as department_name,
  c.name as classroom_name,
  sch.day_of_week,
  sch.start_time,
  sch.end_time,
  ha.created_at,
  ha.updated_at
FROM hour_assignments ha
JOIN professors p ON ha.professor_id = p.id
JOIN users u ON p.user_id = u.id
JOIN user_profiles up ON u.id = up.user_id
JOIN subjects s ON ha.subject_id = s.id
JOIN departments d ON s.department_id = d.id
LEFT JOIN schedules sch ON ha.schedule_id = sch.id
LEFT JOIN classrooms c ON sch.classroom_id = c.id;

-- =========================================
-- TRIGGERS PARA AUDITORÍA
-- =========================================

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER IF NOT EXISTS update_users_timestamp
  AFTER UPDATE ON users
  FOR EACH ROW
  BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_professors_timestamp
  AFTER UPDATE ON professors
  FOR EACH ROW
  BEGIN
    UPDATE professors SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_subjects_timestamp
  AFTER UPDATE ON subjects
  FOR EACH ROW
  BEGIN
    UPDATE subjects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_assignments_timestamp
  AFTER UPDATE ON hour_assignments
  FOR EACH ROW
  BEGIN
    UPDATE hour_assignments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- Trigger para calcular puntuación total del profesor
CREATE TRIGGER IF NOT EXISTS update_professor_total_score
  AFTER INSERT ON professor_scores
  FOR EACH ROW
  BEGIN
    UPDATE professors 
    SET total_score = (
      SELECT COALESCE(SUM(ps.score * sc.weight), 0)
      FROM professor_scores ps
      JOIN scoring_criteria sc ON ps.criteria_id = sc.id
      WHERE ps.professor_id = NEW.professor_id
        AND ps.semester = NEW.semester
        AND ps.year = NEW.year
        AND sc.is_active = 1
    )
    WHERE id = NEW.professor_id;
  END;

-- =========================================
-- DATOS INICIALES DE CONFIGURACIÓN
-- =========================================

-- Insertar configuraciones básicas del sistema
INSERT OR IGNORE INTO system_settings (key, value, description, type) VALUES
('app_name', 'Sistema de Gestión de Horas', 'Nombre de la aplicación', 'string'),
('max_hours_per_professor', '40', 'Máximo de horas por profesor por semana', 'number'),
('min_score_for_assignment', '50', 'Puntuación mínima para asignación de horas', 'number'),
('current_semester', '2024-2', 'Semestre actual del sistema', 'string'),
('current_year', '2024', 'Año académico actual', 'number'),
('notification_retention_days', '30', 'Días para retener notificaciones', 'number'),
('auto_calculate_scores', 'true', 'Calcular puntuaciones automáticamente', 'boolean');

-- Insertar criterios de puntuación por defecto
INSERT OR IGNORE INTO scoring_criteria (name, description, weight, category) VALUES
('Experiencia Académica', 'Años de experiencia en educación superior', 1.5, 'experience'),
('Grado Académico', 'Nivel de estudios alcanzado', 2.0, 'academic'),
('Evaluación Estudiantil', 'Puntuación promedio de evaluaciones de estudiantes', 1.8, 'performance'),
('Investigación y Publicaciones', 'Actividad investigativa y publicaciones', 1.3, 'academic'),
('Puntualidad y Asistencia', 'Cumplimiento de horarios y asistencia', 1.2, 'performance'),
('Actividades Extracurriculares', 'Participación en comités y actividades', 1.0, 'extra');

-- =========================================
-- COMENTARIOS FINALES
-- =========================================

/*
NOTAS SOBRE EL ESQUEMA:

1. INTEGRIDAD REFERENCIAL: 
   - Se utilizan foreign keys para mantener la integridad
   - Triggers automáticos para auditoría y cálculos

2. OPTIMIZACIÓN:
   - Índices en campos críticos para consultas
   - Vistas para simplificar consultas complejas
   - Configuración WAL para mejor concurrencia

3. EXTENSIBILIDAD:
   - Sistema de configuración flexible
   - Logs de actividad para auditoría
   - Criterios de puntuación configurables

4. SEGURIDAD:
   - Constraints para validar datos
   - Separación de perfiles y usuarios
   - Sistema de roles y permisos

5. MANTENIMIENTO:
   - Timestamps automáticos
   - Sistema de notificaciones
   - Estados y flags para control

Para usar este esquema:
1. Crear base de datos SQLite
2. Ejecutar este script
3. Insertar datos de prueba si es necesario
4. Configurar aplicación para conectar

Ejemplo de conexión:
sqlite3 sistema_gestion_horas.db < schema.sql
*/