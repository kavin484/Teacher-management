import React from 'react';
import { Edit2, Trash2, Phone, Calendar, Hash } from 'lucide-react';
import { Teacher } from '../types';
import { formatDate, calculateAge, getAvatarStyle, getInitials } from '../utils';

interface TeacherTableProps {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
}

export const TeacherTable: React.FC<TeacherTableProps> = ({ teachers, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="teacher-table">
        <thead>
          <tr>
            <th style={{ width: '80px' }}>
              <span className="th-content">
                <Hash size={14} /> ID
              </span>
            </th>
            <th>Faculty Member</th>
            <th>
              <span className="th-content">
                <Calendar size={14} /> Date of Birth
              </span>
            </th>
            <th>
              <span className="th-content">
                <Phone size={14} /> Phone Number
              </span>
            </th>
            <th style={{ width: '130px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => {
            const avatar = getAvatarStyle(teacher.name);
            const age = calculateAge(teacher.dob);

            return (
              <tr key={teacher.id || teacher.name} className="table-row">
                <td className="id-cell">#{teacher.id}</td>
                <td>
                  <div className="member-cell">
                    <div
                      className="avatar-circle"
                      style={{
                        backgroundColor: avatar.bg,
                        color: avatar.text,
                        borderColor: avatar.border,
                      }}
                    >
                      {getInitials(teacher.name)}
                    </div>
                    <div>
                      <div className="member-name">{teacher.name}</div>
                      <div className="member-sub">Faculty ID #{teacher.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="dob-cell">
                    <span className="dob-text">{formatDate(teacher.dob)}</span>
                    {age !== null && <span className="age-badge">{age} yrs</span>}
                  </div>
                </td>
                <td>
                  <a
                    href={`tel:${teacher.ph}`}
                    className="phone-link"
                    title={`Call ${teacher.name}`}
                  >
                    <Phone size={14} className="phone-icon" />
                    <span>{teacher.ph || '—'}</span>
                  </a>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="action-buttons">
                    <button
                      onClick={() => onEdit(teacher)}
                      className="action-btn action-edit"
                      title="Edit teacher"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(teacher)}
                      className="action-btn action-delete"
                      title="Delete teacher"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
