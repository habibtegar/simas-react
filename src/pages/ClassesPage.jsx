import React, { useState, useMemo } from "react";
import StatisticCard from "../components/StatisticCard";
import {
  IconSchool,
  IconPlus,
  IconSearch,
  IconFilter,
  IconUsers,
  IconEdit,
  IconTrash,
  IconEye,
  IconDownload,
  IconGraduationCap,
  IconBadgeCheck,
  IconMale,
  IconFemale
} from "../components/Icons";
import ClassModal from "../components/ClassModal";
import ClassStudentsModal from "../components/ClassStudentsModal";
import DeleteClassModal from "../components/DeleteClassModal";
import { JURUSAN_OPTIONS } from "../data/initialStudents";

export default function ClassesPage({
  classes,
  students,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onNavigateToAttendance
}) {
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTingkat, setFilterTingkat] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingClass, setDeletingClass] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClassForStudents, setSelectedClassForStudents] = useState(null);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);

  // Filter logic
  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.nama.toLowerCase().includes(q) ||
        c.waliKelas?.toLowerCase().includes(q) ||
        c.ruangan?.toLowerCase().includes(q);

      const matchTingkat = !filterTingkat || c.tingkat === filterTingkat;
      const matchJurusan = !filterJurusan || c.jurusan === filterJurusan;

      return matchSearch && matchTingkat && matchJurusan;
    });
  }, [classes, searchQuery, filterTingkat, filterJurusan]);

  // Helper to count students in class
  const getStudentsInClass = (className) => {
    return students.filter((s) => s.kelas === className);
  };

  // Helper stats
  const stats = useMemo(() => {
    const totalClasses = classes.length;
    const totalStudentsEnrolled = students.length;
    const avgStudents = totalClasses > 0 ? (totalStudentsEnrolled / totalClasses).toFixed(1) : 0;
    const uniqueJurusan = new Set(classes.map((c) => c.jurusan)).size;

    return { totalClasses, totalStudentsEnrolled, avgStudents, uniqueJurusan };
  }, [classes, students]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterTingkat("");
    setFilterJurusan("");
  };

  // Open Edit
  const handleOpenEdit = (classItem) => {
    setEditingClass(classItem);
    setIsEditModalOpen(true);
  };

  // Open Delete
  const handleOpenDelete = (classItem) => {
    setDeletingClass(classItem);
    setIsDeleteModalOpen(true);
  };

  // Open Students Detail
  const handleOpenStudentsList = (classItem) => {
    setSelectedClassForStudents(classItem);
    setIsStudentsModalOpen(true);
  };

  // Export to Excel
  const handleExportExcel = () => {
    if (filteredClasses.length === 0) return;

    const headers = ["No", "Nama Kelas", "Tingkat", "Jurusan", "Wali Kelas", "Ruangan", "Jumlah Siswa", "Tahun Ajaran"];

    const rowsHtml = filteredClasses
      .map((c, idx) => {
        const studentCount = getStudentsInClass(c.nama).length;
        return `
          <tr>
            <td style="text-align: center; border: 1px solid #cbd5e1; padding: 8px;">${idx + 1}</td>
            <td style="font-weight: bold; border: 1px solid #cbd5e1; padding: 8px;">${c.nama}</td>
            <td style="text-align: center; border: 1px solid #cbd5e1; padding: 8px;">${c.tingkat || "-"}</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">${c.jurusan}</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">${c.waliKelas || "-"}</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">${c.ruangan || "-"}</td>
            <td style="text-align: center; font-weight: bold; border: 1px solid #cbd5e1; padding: 8px;">${studentCount}</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">${c.tahunAjaran || "-"}</td>
          </tr>
        `;
      })
      .join("");

    const headersHtml = headers
      .map(
        (h) =>
          `<th style="background-color: #4f46e5; color: #ffffff; font-weight: bold; border: 1px solid #cbd5e1; padding: 10px; text-align: left;">${h}</th>`
      )
      .join("");

    const htmlTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
          th { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
          td { border: 1px solid #cbd5e1; padding: 8px; }
        </style>
      </head>
      <body>
        <h2>Data Rombongan Belajar (Kelas) - SIMAS SMK</h2>
        <p>Tanggal Ekspor: ${new Date().toLocaleDateString("id-ID")}</p>
        <table>
          <thead><tr>${headersHtml}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlTemplate], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `data_kelas_smk_${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isFiltering = searchQuery !== "" || filterTingkat !== "" || filterJurusan !== "";

  return (
    <div className="classes-page">
      {/* Page Header */}
      <div className="page-header-container">
        <div className="page-header-titles">
          <h2 className="page-main-title">Data Rombongan Belajar & Kelas</h2>
          <p className="page-main-desc">
            Kelola data kelas, penetapan wali kelas, serta pantau distribusi siswa per rombel.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleExportExcel}
            disabled={filteredClasses.length === 0}
            title="Download data kelas sebagai Excel"
          >
            <IconDownload size={16} />
            <span>Ekspor Excel</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <IconPlus size={16} />
            <span>Tambah Kelas</span>
          </button>
        </div>
      </div>

      {/* Recap Stats Cards */}
      <div className="stats-grid">
        <StatisticCard
          title="Total Rombel Kelas"
          value={stats.totalClasses}
          icon={<IconSchool size={18} />}
          badgeText="Semua Jurusan"
          subtext="Tingkat X, XI, XII"
        />

        <StatisticCard
          title="Total Siswa Terdaftar"
          value={stats.totalStudentsEnrolled}
          icon={<IconUsers size={18} />}
          badgeText="Aktif"
          subtext="Siswa terdistribusi"
        />

        <StatisticCard
          title="Rata-rata Siswa / Kelas"
          value={stats.avgStudents}
          icon={<IconGraduationCap size={18} />}
          badgeText="Kapasitas"
          subtext="Siswa per rombel"
        />

        <StatisticCard
          title="Program Keahlian"
          value={stats.uniqueJurusan}
          icon={<IconBadgeCheck size={18} />}
          badgeText="Kompetensi"
          subtext="PPLG, Animasi, dll"
        />
      </div>

      {/* Toolbar: Search, Filters & View Switcher */}
      <div className="toolbar-container">
        <div className="classes-toolbar-header">
          <div className="search-bar-container" style={{ flex: 1 }}>
            <div className="search-input-wrapper">
              <span className="search-icon">
                <IconSearch size={18} />
              </span>
              <input
                type="text"
                className="search-input"
                placeholder="Cari nama kelas, wali kelas, atau ruangan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* View Mode Toggle Button Group */}
          <div className="view-mode-toggle">
            <button
              type="button"
              className={`btn-view-toggle ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Tampilan Kartu Grid"
            >
              Kartu Grid
            </button>
            <button
              type="button"
              className={`btn-view-toggle ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Tampilan Tabel"
            >
              Tabel
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="filter-bar">
          <div className="filter-label-group">
            <IconFilter size={14} className="text-muted" />
            <span className="filter-title">Filter:</span>
          </div>

          <div className="filter-controls">
            <select
              className="filter-select"
              value={filterTingkat}
              onChange={(e) => setFilterTingkat(e.target.value)}
            >
              <option value="">Semua Tingkat</option>
              <option value="X">Kelas X</option>
              <option value="XI">Kelas XI</option>
              <option value="XII">Kelas XII</option>
            </select>

            <select
              className="filter-select"
              value={filterJurusan}
              onChange={(e) => setFilterJurusan(e.target.value)}
            >
              <option value="">Semua Jurusan</option>
              {JURUSAN_OPTIONS.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.id} - {j.name.split("(")[0]}
                </option>
              ))}
            </select>

            {isFiltering && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleResetFilters}
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Active Indicator */}
      {isFiltering && (
        <div className="filter-active-indicator">
          <span>
            Menampilkan <strong>{filteredClasses.length}</strong> dari <strong>{classes.length}</strong> rombel kelas
          </span>
          <button type="button" className="btn-link" onClick={handleResetFilters}>
            Reset Semua
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {filteredClasses.length === 0 ? (
        <div className="card-panel empty-state-card">
          <div className="empty-icon-wrapper">
            <IconSchool size={32} />
          </div>
          <h3 className="empty-title">Tidak Ada Kelas Ditemukan</h3>
          <p className="empty-desc">
            {isFiltering
              ? "Tidak ada rombel kelas yang sesuai dengan filter pencarian Anda."
              : "Belum ada kelas yang terdaftar. Tambahkan kelas baru sekarang."}
          </p>
          {isFiltering ? (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm mt-3"
              onClick={handleResetFilters}
            >
              Reset Filter
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm mt-3"
              onClick={() => setIsAddModalOpen(true)}
            >
              <IconPlus size={16} />
              <span>Tambah Kelas Pertama</span>
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* GRID CARDS VIEW */
        <div className="classes-cards-grid">
          {filteredClasses.map((classItem) => {
            const studentsInClass = getStudentsInClass(classItem.nama);
            const studentCount = studentsInClass.length;
            const maleCount = studentsInClass.filter((s) => s.gender === "Laki-laki").length;
            const femaleCount = studentsInClass.filter((s) => s.gender === "Perempuan").length;

            return (
              <div
                key={classItem.id}
                className="class-card"
                onClick={() => handleOpenStudentsList(classItem)}
              >
                <div className="class-card-top">
                  <div className="class-card-header-info">
                    <div className="class-name-badge">
                      <IconSchool size={16} />
                      <span className="class-title-text">{classItem.nama}</span>
                    </div>
                    <span className={`jurusan-badge badge-jurusan-${classItem.jurusan?.toLowerCase()}`}>
                      {classItem.jurusan}
                    </span>
                  </div>

                  <div className="class-wali-info">
                    <span className="class-info-label">WALI KELAS:</span>
                    <span className="class-wali-name" title={classItem.waliKelas}>
                      {classItem.waliKelas || "Belum ditentukan"}
                    </span>
                  </div>

                  <div className="class-room-info">
                    <span className="class-room-tag">
                      📍 {classItem.ruangan || "Ruangan standar"}
                    </span>
                  </div>
                </div>

                <div className="class-card-bottom">
                  <div className="class-students-count-block">
                    <div className="students-count-number">
                      <span className="count-val">{studentCount}</span>
                      <span className="count-label">Siswa</span>
                    </div>
                    {studentCount > 0 && (
                      <div className="gender-mini-split">
                        <span className="mini-g male" title={`${maleCount} Laki-laki`}>
                          <IconMale size={11} /> {maleCount}
                        </span>
                        <span className="mini-g female" title={`${femaleCount} Perempuan`}>
                          <IconFemale size={11} /> {femaleCount}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="class-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="action-btn action-btn-view"
                      onClick={() => handleOpenStudentsList(classItem)}
                      title="Lihat Daftar Siswa di Kelas Ini"
                    >
                      <IconEye size={16} />
                    </button>
                    <button
                      type="button"
                      className="action-btn action-btn-edit"
                      onClick={() => handleOpenEdit(classItem)}
                      title="Edit Kelas"
                    >
                      <IconEdit size={16} />
                    </button>
                    <button
                      type="button"
                      className="action-btn action-btn-delete"
                      onClick={() => handleOpenDelete(classItem)}
                      title="Hapus Kelas"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="table-responsive-container">
          <div className="table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th style={{ width: "50px", textAlign: "center" }}>No</th>
                  <th>Nama Kelas</th>
                  <th style={{ width: "100px" }}>Tingkat</th>
                  <th style={{ width: "130px" }}>Jurusan</th>
                  <th>Wali Kelas</th>
                  <th>Ruangan</th>
                  <th style={{ width: "120px", textAlign: "center" }}>Jumlah Siswa</th>
                  <th style={{ width: "120px", textAlign: "center" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((classItem, idx) => {
                  const studentCount = getStudentsInClass(classItem.nama).length;
                  return (
                    <tr
                      key={classItem.id}
                      className="student-table-row cursor-pointer"
                      onClick={() => handleOpenStudentsList(classItem)}
                    >
                      <td style={{ textAlign: "center", color: "var(--text-subtle)", fontWeight: 600 }}>
                        {idx + 1}
                      </td>
                      <td>
                        <div className="flex-align-center gap-2">
                          <span className="font-bold text-main">{classItem.nama}</span>
                        </div>
                      </td>
                      <td>
                        <span className="class-badge">Kelas {classItem.tingkat}</span>
                      </td>
                      <td>
                        <span className={`jurusan-badge badge-jurusan-${classItem.jurusan?.toLowerCase()}`}>
                          {classItem.jurusan}
                        </span>
                      </td>
                      <td>
                        <span className="fw-medium text-main">{classItem.waliKelas || "-"}</span>
                      </td>
                      <td>
                        <span className="text-subtle" style={{ fontSize: "0.78rem" }}>
                          {classItem.ruangan || "-"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          className={`badge-students-count ${studentCount > 0 ? "has-students" : "empty-students"}`}
                        >
                          <IconUsers size={12} />
                          <span>{studentCount} Siswa</span>
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="action-btn action-btn-view"
                            onClick={() => handleOpenStudentsList(classItem)}
                            title="Lihat Siswa"
                          >
                            <IconEye size={16} />
                          </button>
                          <button
                            type="button"
                            className="action-btn action-btn-edit"
                            onClick={() => handleOpenEdit(classItem)}
                            title="Edit Kelas"
                          >
                            <IconEdit size={16} />
                          </button>
                          <button
                            type="button"
                            className="action-btn action-btn-delete"
                            onClick={() => handleOpenDelete(classItem)}
                            title="Hapus Kelas"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="table-footer-info">
            Menampilkan <strong>{filteredClasses.length}</strong> rombel kelas
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      <ClassModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        isEditMode={false}
        existingClasses={classes}
        onSubmit={onAddClass}
      />

      {/* Edit Class Modal */}
      <ClassModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingClass(null);
        }}
        classData={editingClass}
        isEditMode={true}
        existingClasses={classes}
        onSubmit={(updatedData) => {
          onUpdateClass(editingClass.id, updatedData);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteClassModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingClass(null);
        }}
        classData={deletingClass}
        studentCount={deletingClass ? getStudentsInClass(deletingClass.nama).length : 0}
        onConfirm={onDeleteClass}
      />

      {/* Student List in Class Modal */}
      <ClassStudentsModal
        isOpen={isStudentsModalOpen}
        onClose={() => {
          setIsStudentsModalOpen(false);
          setSelectedClassForStudents(null);
        }}
        targetClass={selectedClassForStudents}
        studentsInClass={
          selectedClassForStudents ? getStudentsInClass(selectedClassForStudents.nama) : []
        }
        onNavigateToAttendance={onNavigateToAttendance}
      />
    </div>
  );
}
