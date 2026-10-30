import React from 'react';
import { Edit2, Trash2, Phone, Calendar } from 'lucide-react';
import { Teacher } from '../types';
import { formatDate, calculateAge, getAvatarStyle, getInitials } from '../utils';

interface TeacherCardProps {
  teacher: Teacher;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onEdit, onDelete }) => {
  const avatar = getAvatarStyle(teacher.name);
  const age = calculateAge(teacher.dob);

  return (
    <div className="teacher-card">
      <div className="card-top">
        <div
          className="avatar-circle-large"
          style={{
            backgroundColor: avatar.bg,
            color: avatar.text,
            borderColor: avatar.border,
          }}
        >
          {getInitials(teacher.name)}
        </div>
        <div className="card-header-actions">
          <span className="card-id-tag">#{teacher.id}</span>
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-name">{teacher.name}</h3>
        <p className="card-role">Faculty Member</p>

        <div className="card-details">
          <div className="detail-item">
            <Calendar size={15} className="detail-icon" />
            <span className="detail-label">Born:</span>
            <span className="detail-value">{formatDate(teacher.dob)}</span>
            {age !== null && <span className="age-badge-small">{age}y</span>}
          </div>

          <div className="detail-item">
            <Phone size={15} className="detail-icon" />
            <span className="detail-label">Phone:</span>
            <a href={`tel:${teacher.ph}`} className="phone-link-card">
              {teacher.ph || '—'}
            </a>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <button
          onClick={() => onEdit(teacher)}
          className="card-btn card-btn-edit"
        >
          <Edit2 size={15} />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(teacher)}
          className="card-btn card-btn-delete"
        >
          <Trash2 size={15} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};
