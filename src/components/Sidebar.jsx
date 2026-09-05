import React from "react";
import {
  IconDashboard,
  IconUsers,
  IconUserPlus,
  IconCode,
  IconClose,
  IconGraduationCap,
  IconBadgeCheck
} from "./Icons";

export default function Sidebar({ activeTab, setActiveTab, totalStudents, isOpen, onClose }) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <IconDashboard size={20} />,
      badge: null
    },
    {
      id: "students",
      label: "Data Siswa",
      icon: <IconUsers size={20} />,
      badge: null
    },
    {
      id: "add-student",
      label: "Tambah Siswa",
      icon: <IconUserPlus size={20} />,
      badge: null
    }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={onClose} 
          aria-hidden="true" 
        />
      )}

      <aside className={`app-sidebar ${isOpen ? "open" : ""}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="brand-wrapper">
            <div className="brand-icon">
              <IconGraduationCap size={24} className="text-white" />
            </div>
            <div className="brand-info">
              <h1 className="brand-title">SIMAS</h1>
              <p className="brand-subtitle">Manajemen Siswa SMKN 1 CIOMAS</p>
            </div>
          </div>
          <button 
            type="button"
            className="sidebar-close-btn" 
            onClick={onClose}
            aria-label="Tutup Menu"
          >
            <IconClose size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">MENU UTAMA</div>
          <ul className="nav-list">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li key={item.id} className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${isActive ? "active" : ""}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.label}</span>
                    {item.badge !== null && (
                      <span className={`nav-badge ${isActive ? "active-badge" : ""}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
