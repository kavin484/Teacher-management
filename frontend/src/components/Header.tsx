import React from 'react';
import { GraduationCap, Plus, RefreshCw, Server, AlertCircle, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onAddTeacher: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  isBackendConnected: boolean | null;
}

export const Header: React.FC<HeaderProps> = ({
  onAddTeacher,
  onRefresh,
  isLoading,
  isBackendConnected,
}) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-group">
          <div className="logo-box">
            <GraduationCap className="logo-icon" size={28} />
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">TeacherHub</h1>
              <span className="badge-tag">Spring Boot + React</span>
            </div>
            <p className="brand-subtitle">Manage faculty profiles, records, and contact details</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Backend Status Indicator */}
          <div
            className={`status-pill ${
              isBackendConnected === true
                ? 'status-online'
                : isBackendConnected === false
                ? 'status-offline'
                : 'status-checking'
            }`}
            title={
              isBackendConnected === true
                ? 'Connected to Spring Boot API (/api/teachers)'
                : isBackendConnected === false
                ? 'Cannot connect to backend. Please make sure Spring Boot is running.'
                : 'Checking backend status...'
            }
          >
            {isBackendConnected === true ? (
              <>
                <CheckCircle2 size={15} />
                <span>Backend Online</span>
              </>
            ) : isBackendConnected === false ? (
              <>
                <AlertCircle size={15} />
                <span>Backend Offline</span>
              </>
            ) : (
              <>
                <Server size={15} className="spin-slow" />
                <span>Connecting...</span>
              </>
            )}
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="btn btn-secondary"
            title="Refresh list"
          >
            <RefreshCw size={17} className={isLoading ? 'spinning' : ''} />
            <span className="btn-label-desktop">Refresh</span>
          </button>

          <button onClick={onAddTeacher} className="btn btn-primary">
            <Plus size={18} />
            <span>Add Teacher</span>
          </button>
        </div>
      </div>
    </header>
  );
};
