import React from "react";
import logoSekolah from "../assets/logoskanic.png";
import {
  IconDashboard,
  IconUsers,
  IconSchool,
  IconUserPlus,
  IconClose,
  IconClipboardCheck
} from "./Icons";

export default function Sidebar({ activeTab, setActiveTab, totalStudents, isOpen, onClose }) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <IconDashboard size={18} />
    },
    {
      id: "students",
      label: "Data Siswa",
      icon: <IconUsers size={18} />
    },
    {
      id: "classes",
      label: "Data Kelas",
      icon: <IconSchool size={18} />
    },
    {
      id: "attendance",
      label: "Absensi Siswa",
      icon: <IconClipboardCheck size={18} />
    },
    {
      id: "add-student",
      label: "Tambah Siswa",
      icon: <IconUserPlus size={18} />
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
        {/* Sidebar Brand Header */}
        <div className="sidebar-header">
          <div className="brand-wrapper">
            <img
              src={logoSekolah}
              alt="Logo SMKN 1 Ciomas"
              className="brand-logo-img"
            />
            <div className="brand-info">
              <h1 className="brand-title">SIMAS</h1>
              <p className="brand-subtitle">SMKN 1 CIOMAS</p>
            </div>
          </div>
          <button 
            type="button"
            className="sidebar-close-btn" 
            onClick={onClose}
            aria-label="Tutup Menu"
          >
            <IconClose size={18} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">NAVIGASI UTAMA</div>
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
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Minimal Clean Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-meta-info">
            <span className="sidebar-meta-title">Sistem Informasi Siswa</span>
            <span className="sidebar-meta-version">v1.2.0 • 2024/2025</span>
          </div>
        </div>
      </aside>
    </>
  );
}
