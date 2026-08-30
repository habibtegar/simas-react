import React, { useState, useEffect } from "react";
import {
  IconMenu,
  IconPlus,
  IconRefresh,
  IconSchool
} from "./Icons";

export default function Navbar({ activeTab, onToggleSidebar, onNavigateToAdd, onResetData }) {
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric"
      };
      const dateStr = now.toLocaleDateString("id-ID", options);
      const timeStr = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
      });
      setCurrentDateTime(`${dateStr} • ${timeStr} WIB`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageInfo = () => {
    switch (activeTab) {
      case "dashboard":
        return {
          title: "Dashboard Utama",
          subtitle: "Ringkasan data & statistik siswa SMK"
        };
      case "students":
        return {
          title: "Data Siswa",
          subtitle: "Kelola, cari, dan filter seluruh data siswa"
        };
      case "add-student":
        return {
          title: "Tambah Siswa Baru",
          subtitle: "Formulir pendaftaran dan input data siswa"
        };
      default:
        return {
          title: "Sistem Informasi Siswa",
          subtitle: "Manajemen Data Siswa SMK PPLG"
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <header className="app-navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="mobile-menu-trigger"
          onClick={onToggleSidebar}
          aria-label="Buka Menu"
        >
          <IconMenu size={24} />
        </button>
        <div className="navbar-page-title">
          <h2>{pageInfo.title}</h2>
          <span className="navbar-subtitle">{pageInfo.subtitle}</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Real-time Clock Badge */}
        <div className="datetime-badge hidden-mobile">
          <span className="live-indicator"></span>
          <span>{currentDateTime}</span>
        </div>

        {/* Quick Add Button if not currently on add page */}
        {activeTab !== "add-student" && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onNavigateToAdd}
          >
            <IconPlus size={16} />
            <span>Tambah Siswa</span>
          </button>
        )}

        {/* User Profile Avatar */}
        <div className="user-profile-badge">
          <div className="avatar-circle">
            <span>AD</span>
          </div>
          <div className="user-details hidden-mobile">
            <span className="user-name">Admin SIMAS</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
