import React, { useState, useEffect } from 'react';
import { X, User, Calendar, Phone, Save, Loader2 } from 'lucide-react';
import { Teacher, ModalMode } from '../types';

interface TeacherFormModalProps {
  mode: ModalMode;
  initialData?: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teacherData: Omit<Teacher, 'id'>) => Promise<void>;
}

export const TeacherFormModal: React.FC<TeacherFormModalProps> = ({
  mode,
  initialData,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [ph, setPh] = useState('');
  const [errors, setErrors] = useState<{ name?: string; dob?: string; ph?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setName(initialData.name || '');
        setDob(initialData.dob || '');
        setPh(initialData.ph || '');
      } else {
        setName('');
        setDob('');
        setPh('');
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { name?: string; dob?: string; ph?: string } = {};

    if (!name.trim()) {
      errs.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!dob) {
      errs.dob = 'Date of birth is required';
    } else {
      const selected = new Date(dob);
      const today = new Date();
      if (selected > today) {
        errs.dob = 'Date of birth cannot be in the future';
      }
    }

    if (!ph.trim()) {
      errs.ph = 'Phone number is required';
    } else if (!/^[0-9+()\- ]{7,20}$/.test(ph.trim())) {
      errs.ph = 'Please enter a valid phone number';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: name.trim(),
        dob,
        ph: ph.trim(),
      });
      onClose();
    } catch {
      // Handled by parent toast notification
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {mode === 'create' ? 'Add New Teacher' : 'Edit Teacher Profile'}
            </h2>
            <p className="modal-subtitle">
              {mode === 'create'
                ? 'Fill in the details to register a new faculty member'
                : `Updating details for ${initialData?.name || 'teacher'}`}
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn" title="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Name Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="teacher-name">
              Full Name <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                id="teacher-name"
                type="text"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Dr. Jane Smith"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                autoFocus
              />
            </div>
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          {/* DOB Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="teacher-dob">
              Date of Birth <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <Calendar size={18} className="input-icon" />
              <input
                id="teacher-dob"
                type="date"
                className={`form-input ${errors.dob ? 'input-error' : ''}`}
                value={dob}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  setDob(e.target.value);
                  if (errors.dob) setErrors((prev) => ({ ...prev, dob: undefined }));
                }}
              />
            </div>
            {errors.dob && <p className="error-message">{errors.dob}</p>}
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="teacher-ph">
              Phone Number <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <Phone size={18} className="input-icon" />
              <input
                id="teacher-ph"
                type="tel"
                className={`form-input ${errors.ph ? 'input-error' : ''}`}
                placeholder="e.g. +1 (555) 234-5678"
                value={ph}
                onChange={(e) => {
                  setPh(e.target.value);
                  if (errors.ph) setErrors((prev) => ({ ...prev, ph: undefined }));
                }}
              />
            </div>
            {errors.ph && <p className="error-message">{errors.ph}</p>}
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spinning" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{mode === 'create' ? 'Create Teacher' : 'Save Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
