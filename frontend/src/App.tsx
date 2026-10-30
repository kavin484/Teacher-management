import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  fetchTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher as apiDeleteTeacher,
} from './api';
import { Teacher, ModalMode, ToastMessage } from './types';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { TeacherTable } from './components/TeacherTable';
import { TeacherCard } from './components/TeacherCard';
import { TeacherFormModal } from './components/TeacherFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';
import {
  Search,
  Plus,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ServerOff,
} from 'lucide-react';

export function App() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals state
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTeachers();
      setTeachers(data);
      setIsBackendConnected(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to backend server';
      setError(msg);
      setIsBackendConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered teachers list based on search term
  const filteredTeachers = useMemo(() => {
    if (!searchTerm.trim()) return teachers;
    const term = searchTerm.toLowerCase().trim();
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(term) ||
        (t.ph && t.ph.toLowerCase().includes(term)) ||
        (t.dob && t.dob.toLowerCase().includes(term))
    );
  }, [teachers, searchTerm]);

  // Modal Handlers
  const handleOpenCreate = () => {
    setSelectedTeacher(null);
    setModalMode('create');
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setModalMode('edit');
  };

  const handleCloseFormModal = () => {
    setModalMode(null);
    setSelectedTeacher(null);
  };

  const handleSaveTeacher = async (teacherData: Omit<Teacher, 'id'>) => {
    if (modalMode === 'create') {
      try {
        const created = await createTeacher(teacherData);
        setTeachers((prev) => [...prev, created]);
        addToast('success', `Teacher "${created.name}" created successfully!`);
        setIsBackendConnected(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error creating teacher';
        addToast('error', msg);
        throw err;
      }
    } else if (modalMode === 'edit' && selectedTeacher?.id) {
      try {
        const updated = await updateTeacher(selectedTeacher.id, teacherData);
        setTeachers((prev) =>
          prev.map((t) => (t.id === selectedTeacher.id ? updated : t))
        );
        addToast('success', `Teacher "${updated.name}" updated successfully!`);
        setIsBackendConnected(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error updating teacher';
        addToast('error', msg);
        throw err;
      }
    }
  };

  const handleDeleteConfirm = async (id: number) => {
    try {
      await apiDeleteTeacher(id);
      const deletedTeacherName = teacherToDelete?.name || 'Teacher';
      setTeachers((prev) => prev.filter((t) => t.id !== id));
      addToast('info', `Teacher "${deletedTeacherName}" deleted.`);
      setIsBackendConnected(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting teacher';
      addToast('error', msg);
      throw err;
    }
  };

  return (
    <div className="app-layout">
      {/* Top Header */}
      <Header
        onAddTeacher={handleOpenCreate}
        onRefresh={loadData}
        isLoading={loading}
        isBackendConnected={isBackendConnected}
      />

      <main className="main-content">
        {/* Backend offline warning banner */}
        {isBackendConnected === false && (
          <div className="banner banner-warning">
            <div className="banner-icon">
              <ServerOff size={22} />
            </div>
            <div className="banner-body">
              <h4 className="banner-title">Cannot connect to Spring Boot server</h4>
              <p className="banner-desc">
                Ensure your Spring Boot backend is running on <code>http://localhost:8080</code>.
                You can run <code>TeacherApplication</code> in IntelliJ or run{' '}
                <code>./mvnw spring-boot:run</code> in the terminal.
              </p>
            </div>
            <button onClick={loadData} className="btn btn-secondary banner-btn">
              <RotateCcw size={15} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Top Summary & Search / Filter Controls */}
        <StatsBar
          teachers={teachers}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Content Area */}
        <div className="content-container">
          {loading && teachers.length === 0 ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p className="loading-text">Loading faculty records...</p>
            </div>
          ) : error && teachers.length === 0 ? (
            <div className="error-card">
              <AlertTriangle size={36} className="error-icon" />
              <h3 className="error-title">Unable to Load Data</h3>
              <p className="error-detail">{error}</p>
              <button onClick={loadData} className="btn btn-primary mt-4">
                <RotateCcw size={16} />
                <span>Retry Connection</span>
              </button>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="empty-state">
              {searchTerm ? (
                <>
                  <div className="empty-icon-circle">
                    <Search size={32} />
                  </div>
                  <h3 className="empty-title">No matching teachers found</h3>
                  <p className="empty-desc">
                    We couldn't find any teacher matching "<strong>{searchTerm}</strong>".
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="btn btn-secondary"
                  >
                    Clear Search Filter
                  </button>
                </>
              ) : (
                <>
                  <div className="empty-icon-circle empty-sparkle">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="empty-title">No faculty records yet</h3>
                  <p className="empty-desc">
                    Get started by adding your first teacher profile to the database.
                  </p>
                  <button onClick={handleOpenCreate} className="btn btn-primary">
                    <Plus size={18} />
                    <span>Add First Teacher</span>
                  </button>
                </>
              )}
            </div>
          ) : viewMode === 'table' ? (
            <TeacherTable
              teachers={filteredTeachers}
              onEdit={handleOpenEdit}
              onDelete={(t) => setTeacherToDelete(t)}
            />
          ) : (
            <div className="cards-grid">
              {filteredTeachers.map((teacher) => (
                <TeacherCard
                  key={teacher.id || teacher.name}
                  teacher={teacher}
                  onEdit={handleOpenEdit}
                  onDelete={(t) => setTeacherToDelete(t)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Teacher Management System • Spring Boot 3 & React 19 • Connected to PostgreSQL
        </p>
      </footer>

      {/* Add / Edit Modal */}
      <TeacherFormModal
        mode={modalMode}
        initialData={selectedTeacher}
        isOpen={modalMode !== null}
        onClose={handleCloseFormModal}
        onSubmit={handleSaveTeacher}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        teacher={teacherToDelete}
        isOpen={teacherToDelete !== null}
        onClose={() => setTeacherToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Floating Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
