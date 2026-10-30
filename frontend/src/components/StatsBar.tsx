import React from 'react';
import { Users, Calendar, Phone, Search, LayoutGrid, List } from 'lucide-react';
import { Teacher } from '../types';

interface StatsBarProps {
  teachers: Teacher[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  teachers,
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
}) => {
  const total = teachers.length;
  const avgAge = 25;

  return (
    <div className="stats-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-blue">
            <Users size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Faculty</span>
            <span className="stat-value">{total}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-purple">
            <Calendar size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Average Age</span>
            <span className="stat-value">{avgAge !== null ? `${avgAge} yrs` : '—'}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-emerald">
            <Phone size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Contacts</span>
            <span className="stat-value">
              {teachers.filter((t) => t.ph && t.ph.trim().length > 0).length}
            </span>
          </div>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, phone, or date..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="clear-search-btn"
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="view-toggle">
          <button
            onClick={() => onViewModeChange('table')}
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            title="Table View"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            title="Card Grid View"
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
