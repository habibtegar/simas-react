import React, { useState, useEffect, useMemo } from "react";
import {
  IconCalendar,
  IconCheckCircle,
  IconSave,
  IconSearch,
  IconDownload,
  IconUsers,
  IconMale,
  IconFemale,
  IconAlertCircle
} from "../components/Icons";
import { loadAttendance, saveAttendance, formatDateIndonesia } from "../utils/storage";
import { KELAS_OPTIONS } from "../data/initialStudents";

export default function AttendancePage({ students, classes = [], showToast }) {
  // Today's date in YYYY-MM-DD format
  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // Available classes: extract unique from classes state, students, fallback to KELAS_OPTIONS
  const classOptions = useMemo(() => {
    const fromClasses = classes.map((c) => c.nama).filter(Boolean);
    const studentClasses = Array.from(new Set(students.map((s) => s.kelas).filter(Boolean)));
    const merged = Array.from(new Set([...fromClasses, ...studentClasses, ...KELAS_OPTIONS]));
    return merged.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [students, classes]);

  // Selected filters
  const [selectedClass, setSelectedClass] = useState(() => {
    // Default to first class that has students, or first in list
    const firstWithStudents = classOptions.find((c) =>
      students.some((s) => s.kelas === c)
    );
    return firstWithStudents || classOptions[0] || "XI PPLG 1";
  });

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'Hadir' | 'Sakit' | 'Izin' | 'Alpa'

  // Full attendance database from storage: { [dateKey]: { [studentId]: { status, note } } }
  const [allAttendance, setAllAttendance] = useState(() => loadAttendance());

  // Attendance state for current session: { [studentId]: { status: "Hadir"|"Sakit"|"Izin"|"Alpa", note: "" } }
  const [currentRecords, setCurrentRecords] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Filter students by selected class
  const classStudents = useMemo(() => {
    return students.filter((s) => s.kelas === selectedClass);
  }, [students, selectedClass]);

  // Load attendance records when selectedDate or selectedClass changes
  useEffect(() => {
    const dateData = allAttendance[selectedDate] || {};
    const initialRecords = {};

    classStudents.forEach((student) => {
      if (dateData[student.id]) {
        initialRecords[student.id] = {
          status: dateData[student.id].status || "Hadir",
          note: dateData[student.id].note || ""
        };
      } else {
        // Default to "Hadir"
        initialRecords[student.id] = {
          status: "Hadir",
          note: ""
        };
      }
    });

    setCurrentRecords(initialRecords);
    setHasUnsavedChanges(false);
  }, [selectedDate, selectedClass, classStudents, allAttendance]);

  // Handle individual student status change
  const handleStatusChange = (studentId, status) => {
    setCurrentRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        status
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Handle individual student note change
  const handleNoteChange = (studentId, note) => {
    setCurrentRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        note
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Set all students in current class to 'Hadir'
  const handleSetAllHadir = () => {
    const updated = { ...currentRecords };
    classStudents.forEach((student) => {
      updated[student.id] = {
        ...(updated[student.id] || {}),
        status: "Hadir"
      };
    });
    setCurrentRecords(updated);
    setHasUnsavedChanges(true);
    if (showToast) {
      showToast(`Semua siswa di ${selectedClass} disetel status "Hadir"`, "info");
    }
  };

  // Save current attendance to LocalStorage
  const handleSaveAttendance = () => {
    const updatedAttendance = {
      ...allAttendance,
      [selectedDate]: {
        ...(allAttendance[selectedDate] || {}),
        ...currentRecords
      }
    };

    setAllAttendance(updatedAttendance);
    saveAttendance(updatedAttendance);
    setHasUnsavedChanges(false);

    if (showToast) {
      showToast(
        `Absensi ${selectedClass} tanggal ${formatDateIndonesia(selectedDate)} berhasil disimpan!`,
        "success"
      );
    }
  };

  // Filtered students by search & status
  const displayedStudents = useMemo(() => {
    return classStudents.filter((student) => {
      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        student.nama?.toLowerCase().includes(q) ||
        student.nis?.toLowerCase().includes(q);

      // Status match
      const currentStatus = currentRecords[student.id]?.status || "Hadir";
      const matchStatus = filterStatus === "all" || currentStatus === filterStatus;

      return matchSearch && matchStatus;
    });
  }, [classStudents, searchQuery, filterStatus, currentRecords]);

  // Recap statistics calculation for current class
  const stats = useMemo(() => {
    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alpa = 0;

    classStudents.forEach((student) => {
      const status = currentRecords[student.id]?.status || "Hadir";
      if (status === "Hadir") hadir++;
      else if (status === "Sakit") sakit++;
      else if (status === "Izin") izin++;
      else if (status === "Alpa") alpa++;
    });

    const total = classStudents.length;
    const percentage = total > 0 ? Math.round((hadir / total) * 100) : 0;

    return { total, hadir, sakit, izin, alpa, percentage };
  }, [classStudents, currentRecords]);

  // Export Attendance to Excel (.xls)
  const handleExportExcel = () => {
    if (classStudents.length === 0) return;

    const headers = ["No", "NIS", "Nama Siswa", "L/P", "Kelas", "Jurusan", "Status Kehadiran", "Keterangan"];

    const rowsHtml = classStudents.map((s, idx) => {
      const record = currentRecords[s.id] || { status: "Hadir", note: "" };
      return `
        <tr>
          <td style="text-align: center; border: 1px solid #cbd5e1; padding: 8px;">${idx + 1}</td>
          <td style="mso-number-format:'\\@'; border: 1px solid #cbd5e1; padding: 8px;">${s.nis}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${s.nama}</td>
          <td style="text-align: center; border: 1px solid #cbd5e1; padding: 8px;">${s.gender === "Laki-laki" ? "L" : "P"}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${s.kelas}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${s.jurusan}</td>
          <td style="font-weight: bold; border: 1px solid #cbd5e1; padding: 8px;">${record.status}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${record.note || "-"}</td>
        </tr>
      `;
    }).join("");

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
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Absensi ${selectedClass}</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
          th { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
          td { border: 1px solid #cbd5e1; padding: 8px; }
        </style>
      </head>
      <body>
        <h2>Rekapitulasi Absensi Siswa - SIMAS SMK</h2>
        <p><strong>Kelas:</strong> ${selectedClass} | <strong>Tanggal:</strong> ${formatDateIndonesia(selectedDate)}</p>
        <p><strong>Rekap:</strong> Total: ${stats.total} | Hadir: ${stats.hadir} (${stats.percentage}%) | Sakit: ${stats.sakit} | Izin: ${stats.izin} | Alpa: ${stats.alpa}</p>
        <table>
          <thead>
            <tr>${headersHtml}</tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlTemplate], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `absensi_${selectedClass.replace(/\s+/g, "_")}_${selectedDate}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="attendance-page">
      {/* Page Header */}
      <div className="page-header-container">
        <div className="page-header-titles">
          <h2 className="page-main-title">Absensi Siswa</h2>
          <p className="page-main-desc">
            Pencatatan dan rekapitulasi kehadiran siswa harian terintegrasi data induk.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleExportExcel}
            disabled={classStudents.length === 0}
            title="Download rekap absensi kelas sebagai Excel"
          >
            <IconDownload size={16} />
            <span>Ekspor Excel</span>
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleSetAllHadir}
            disabled={classStudents.length === 0}
            title="Tandai seluruh siswa di kelas ini Hadir"
          >
            <IconCheckCircle size={16} />
            <span>Set Semua Hadir</span>
          </button>
          <button
            type="button"
            className={`btn btn-primary ${hasUnsavedChanges ? "btn-pulse-save" : ""}`}
            onClick={handleSaveAttendance}
            disabled={classStudents.length === 0}
          >
            <IconSave size={16} />
            <span>{hasUnsavedChanges ? "Simpan Perubahan" : "Simpan Absensi"}</span>
          </button>
        </div>
      </div>

      {/* Recap Stats Cards */}
      <div className="attendance-recap-grid">
        <div className="recap-card card-total">
          <div className="recap-card-header">
            <span className="recap-label">Total Siswa</span>
            <span className="recap-icon-box blue"><IconUsers size={18} /></span>
          </div>
          <div className="recap-value">{stats.total}</div>
          <div className="recap-footer">
            <span>Kelas {selectedClass}</span>
          </div>
        </div>

        <div className="recap-card card-hadir">
          <div className="recap-card-header">
            <span className="recap-label">Hadir (H)</span>
            <span className="recap-badge-pct">{stats.percentage}%</span>
          </div>
          <div className="recap-value text-emerald">{stats.hadir}</div>
          <div className="recap-footer">
            <span className="recap-subtext">Siswa hadir di kelas</span>
          </div>
        </div>

        <div className="recap-card card-sakit">
          <div className="recap-card-header">
            <span className="recap-label">Sakit (S)</span>
            <span className="recap-badge-status yellow">S</span>
          </div>
          <div className="recap-value text-amber">{stats.sakit}</div>
          <div className="recap-footer">
            <span className="recap-subtext">Keterangan sakit</span>
          </div>
        </div>

        <div className="recap-card card-izin">
          <div className="recap-card-header">
            <span className="recap-label">Izin (I)</span>
            <span className="recap-badge-status cyan">I</span>
          </div>
          <div className="recap-value text-cyan">{stats.izin}</div>
          <div className="recap-footer">
            <span className="recap-subtext">Keterangan izin</span>
          </div>
        </div>

        <div className="recap-card card-alpa">
          <div className="recap-card-header">
            <span className="recap-label">Alpa / Tanpa Ket (A)</span>
            <span className="recap-badge-status rose">A</span>
          </div>
          <div className="recap-value text-rose">{stats.alpa}</div>
          <div className="recap-footer">
            <span className="recap-subtext">Tanpa keterangan</span>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && (
        <div className="unsaved-changes-alert">
          <div className="unsaved-text">
            <IconAlertCircle size={18} />
            <span>Ada perubahan status absensi yang belum disimpan ke database.</span>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleSaveAttendance}
          >
            <IconSave size={14} />
            <span>Simpan Sekarang</span>
          </button>
        </div>
      )}

      {/* Toolbar: Kelas, Tanggal, Search & Status Filter */}
      <div className="attendance-toolbar-card">
        <div className="attendance-filters-row">
          {/* Kelas Picker */}
          <div className="filter-item-group">
            <label className="attendance-filter-label">PILIH KELAS</label>
            <div className="select-with-badge">
              <select
                className="form-select attendance-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {classOptions.map((c) => {
                  const countInClass = students.filter((s) => s.kelas === c).length;
                  return (
                    <option key={c} value={c}>
                      {c} ({countInClass} Siswa)
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Tanggal Picker */}
          <div className="filter-item-group">
            <label className="attendance-filter-label">TANGGAL ABSENSI</label>
            <div className="date-input-wrapper">
              <input
                type="date"
                className="form-control attendance-date-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              {selectedDate !== todayStr && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm btn-today"
                  onClick={() => setSelectedDate(todayStr)}
                  title="Kembali ke Hari Ini"
                >
                  Hari Ini
                </button>
              )}
            </div>
          </div>

          {/* Search Siswa */}
          <div className="filter-item-group filter-item-search">
            <label className="attendance-filter-label">CARI SISWA DI KELAS</label>
            <div className="search-input-wrapper">
              <span className="search-icon">
                <IconSearch size={16} />
              </span>
              <input
                type="text"
                className="search-input attendance-search-input"
                placeholder="Ketik nama atau NIS siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                  title="Hapus pencarian"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Status Tabs Filter */}
        <div className="attendance-status-tabs">
          <span className="status-tabs-label">Filter Tampilan:</span>
          <button
            type="button"
            className={`status-tab-btn ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            Semua ({classStudents.length})
          </button>
          <button
            type="button"
            className={`status-tab-btn tab-hadir ${filterStatus === "Hadir" ? "active" : ""}`}
            onClick={() => setFilterStatus("Hadir")}
          >
            Hadir ({stats.hadir})
          </button>
          <button
            type="button"
            className={`status-tab-btn tab-sakit ${filterStatus === "Sakit" ? "active" : ""}`}
            onClick={() => setFilterStatus("Sakit")}
          >
            Sakit ({stats.sakit})
          </button>
          <button
            type="button"
            className={`status-tab-btn tab-izin ${filterStatus === "Izin" ? "active" : ""}`}
            onClick={() => setFilterStatus("Izin")}
          >
            Izin ({stats.izin})
          </button>
          <button
            type="button"
            className={`status-tab-btn tab-alpa ${filterStatus === "Alpa" ? "active" : ""}`}
            onClick={() => setFilterStatus("Alpa")}
          >
            Alpa ({stats.alpa})
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="table-responsive-container attendance-table-container">
        {classStudents.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon-wrapper">
              <IconUsers size={32} />
            </div>
            <h3 className="empty-title">Belum Ada Siswa di {selectedClass}</h3>
            <p className="empty-desc">
              Silakan pilih kelas lain atau tambahkan siswa baru dengan kelas ini di menu "Tambah Siswa".
            </p>
          </div>
        ) : displayedStudents.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon-wrapper">
              <IconSearch size={32} />
            </div>
            <h3 className="empty-title">Tidak Ada Siswa yang Cocok</h3>
            <p className="empty-desc">
              Tidak ditemukan data siswa dengan filter pencarian "{searchQuery}" atau status "{filterStatus}".
            </p>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm mt-3"
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("all");
              }}
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="student-table attendance-table">
              <thead>
                <tr>
                  <th style={{ width: "50px", textAlign: "center" }}>No</th>
                  <th style={{ width: "120px" }}>NIS</th>
                  <th>Nama Siswa</th>
                  <th style={{ width: "100px" }}>L/P</th>
                  <th style={{ width: "120px" }}>Jurusan</th>
                  <th style={{ width: "340px", textAlign: "center" }}>Status Kehadiran</th>
                  <th style={{ minWidth: "180px" }}>Keterangan / Catatan</th>
                </tr>
              </thead>
              <tbody>
                {displayedStudents.map((student, index) => {
                  const record = currentRecords[student.id] || { status: "Hadir", note: "" };
                  const currentStatus = record.status;
                  const isMale = student.gender === "Laki-laki";

                  return (
                    <tr key={student.id} className={`student-table-row attendance-row status-is-${currentStatus.toLowerCase()}`}>
                      <td style={{ textAlign: "center", color: "var(--text-subtle)", fontWeight: 600 }}>
                        {index + 1}
                      </td>

                      <td>
                        <span className="nis-code">{student.nis}</span>
                      </td>

                      <td>
                        <div className="student-name-cell">
                          <div className={`student-avatar ${isMale ? "avatar-male" : "avatar-female"}`}>
                            {student.nama ? student.nama.charAt(0).toUpperCase() : "S"}
                          </div>
                          <div className="student-name-info">
                            <span className="student-name-text">{student.nama}</span>
                            <span className="student-address-preview">{student.kelas}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={`gender-badge ${isMale ? "gender-badge-male" : "gender-badge-female"}`}>
                          {isMale ? <IconMale size={13} /> : <IconFemale size={13} />}
                          <span>{isMale ? "L" : "P"}</span>
                        </span>
                      </td>

                      <td>
                        <span className={`jurusan-badge badge-jurusan-${student.jurusan?.toLowerCase()}`}>
                          {student.jurusan}
                        </span>
                      </td>

                      {/* Interactive Segmented Status Radio Buttons */}
                      <td>
                        <div className="attendance-status-group">
                          <button
                            type="button"
                            className={`status-btn btn-hadir ${currentStatus === "Hadir" ? "active" : ""}`}
                            onClick={() => handleStatusChange(student.id, "Hadir")}
                            title="Tandai Hadir"
                          >
                            <span className="status-dot-mini"></span>
                            <span>Hadir</span>
                          </button>

                          <button
                            type="button"
                            className={`status-btn btn-sakit ${currentStatus === "Sakit" ? "active" : ""}`}
                            onClick={() => handleStatusChange(student.id, "Sakit")}
                            title="Tandai Sakit"
                          >
                            <span className="status-dot-mini"></span>
                            <span>Sakit</span>
                          </button>

                          <button
                            type="button"
                            className={`status-btn btn-izin ${currentStatus === "Izin" ? "active" : ""}`}
                            onClick={() => handleStatusChange(student.id, "Izin")}
                            title="Tandai Izin"
                          >
                            <span className="status-dot-mini"></span>
                            <span>Izin</span>
                          </button>

                          <button
                            type="button"
                            className={`status-btn btn-alpa ${currentStatus === "Alpa" ? "active" : ""}`}
                            onClick={() => handleStatusChange(student.id, "Alpa")}
                            title="Tandai Alpa"
                          >
                            <span className="status-dot-mini"></span>
                            <span>Alpa</span>
                          </button>
                        </div>
                      </td>

                      {/* Note / Keterangan Input */}
                      <td>
                        <input
                          type="text"
                          className="form-control attendance-note-input"
                          placeholder={
                            currentStatus === "Hadir"
                              ? "Catatan opsional..."
                              : currentStatus === "Sakit"
                              ? "Cth: Demam / Surat dokter"
                              : currentStatus === "Izin"
                              ? "Cth: Acara keluarga / Lomba"
                              : "Cth: Tanpa kabar"
                          }
                          value={record.note || ""}
                          onChange={(e) => handleNoteChange(student.id, e.target.value)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {classStudents.length > 0 && (
          <div className="attendance-table-footer">
            <div className="footer-left">
              <span>
                Menampilkan <strong>{displayedStudents.length}</strong> dari <strong>{classStudents.length}</strong> siswa di <strong>{selectedClass}</strong>
              </span>
              <span className="footer-date-tag">
                <IconCalendar size={13} />
                <span>{formatDateIndonesia(selectedDate)}</span>
              </span>
            </div>
            <div className="footer-right">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSaveAttendance}
              >
                <IconSave size={14} />
                <span>Simpan Absensi</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
