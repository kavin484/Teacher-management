import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import { Teacher } from '../types';

interface DeleteConfirmModalProps {
  teacher: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  teacher,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !teacher) return null;

  const handleConfirm = async () => {
    if (!teacher.id) return;
    try {
      setIsDeleting(true);
      await onConfirm(teacher.id);
      onClose();
    } catch {
      // Handled by parent toast notification
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog modal-dialog-small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="delete-icon-wrapper">
            <AlertTriangle size={24} className="delete-icon" />
          </div>
          <button onClick={onClose} className="modal-close-btn" title="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="delete-content">
          <h3 className="delete-title">Delete Teacher Record?</h3>
          <p className="delete-desc">
            Are you sure you want to delete <strong>{teacher.name}</strong> (Faculty ID #{teacher.id})?
            This action cannot be undone.
          </p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="btn btn-danger"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="spinning" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Teacher</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
