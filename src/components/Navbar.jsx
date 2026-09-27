import React, { useState, useEffect } from "react";
import { IconMenu, IconPlus } from "./Icons";

export default function Navbar({ activeTab, onToggleSidebar, onNavigateToAdd }) {
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
      });
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
          title: "Dashboard",
          category: "Overview"
        };
      case "students":
        return {
          title: "Data Siswa",
          category: "Manajemen Siswa"
        };
      case "classes":
        return {
          title: "Data Kelas",
          category: "Rombongan Belajar"
        };
      case "attendance":
        return {
          title: "Absensi Siswa",
          category: "Kehadiran Harian"
        };
      case "add-student":
        return {
          title: "Tambah Siswa Baru",
          category: "Pendaftaran"
        };
      default:
        return {
          title: "SIMAS",
          category: "Sistem Manajemen"
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
          aria-label="Buka Menu Navigasi"
        >
          <IconMenu size={20} />
        </button>
        <div className="navbar-breadcrumb">
          <span className="breadcrumb-category">{pageInfo.category}</span>
          <span className="breadcrumb-divider">/</span>
          <h2 className="breadcrumb-title">{pageInfo.title}</h2>
        </div>
      </div>

      <div className="navbar-right">
        {/* Real-time Clock */}
        <div className="navbar-clock hidden-mobile">
          <span>{currentDateTime}</span>
        </div>

        {/* Quick Add Button if not on Add page */}
        {activeTab !== "add-student" && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onNavigateToAdd}
          >
            <IconPlus size={15} />
            <span>Tambah Siswa</span>
          </button>
        )}

        {/* User Profile */}
        <div className="navbar-user-profile">
          <div className="user-avatar-initials">
            <span>AD</span>
          </div>
          <div className="user-info-text hidden-mobile">
            <span className="user-name-title">Administrator</span>
            <span className="user-school-tag">SMKN 1 Ciomas</span>
          </div>
        </div>
      </div>
    </header>
  );
}
