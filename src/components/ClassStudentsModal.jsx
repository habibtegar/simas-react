import React from "react";
import {
  IconClose,
  IconSchool,
  IconUsers,
  IconMale,
  IconFemale,
  IconPhone,
  IconClipboardCheck
} from "./Icons";

export default function ClassStudentsModal({
  isOpen,
  onClose,
  targetClass,
  studentsInClass = [],
  onNavigateToAttendance
}) {
  if (!isOpen || !targetClass) return null;

  const maleCount = studentsInClass.filter((s) => s.gender === "Laki-laki").length;
  const femaleCount = studentsInClass.filter((s) => s.gender === "Perempuan").length;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" style={{ maxWidth: "780px" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <IconSchool size={20} />
            </div>
            <div>
              <h3 className="modal-title">Daftar Siswa Kelas {targetClass.nama}</h3>
              <p className="modal-subtitle">
                Wali Kelas: <strong>{targetClass.waliKelas || "-"}</strong> • Ruangan: {targetClass.ruangan || "-"}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Tutup modal"
          >
            <IconClose size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body p-0">
          {/* Quick Stats Bar */}
          <div className="class-students-stats-bar">
            <div className="stats-item">
              <IconUsers size={16} className="text-primary" />
              <span>Total: <strong>{studentsInClass.length}</strong> Siswa</span>
            </div>
            <div className="stats-item">
              <span className="gender-badge gender-badge-male">
                <IconMale size={13} />
                <span>{maleCount} Laki-laki</span>
              </span>
            </div>
            <div className="stats-item">
              <span className="gender-badge gender-badge-female">
                <IconFemale size={13} />
                <span>{femaleCount} Perempuan</span>
              </span>
            </div>
            {onNavigateToAttendance && (
              <button
                type="button"
                className="btn btn-outline-primary btn-sm ml-auto"
                onClick={() => {
                  onClose();
                  onNavigateToAttendance(targetClass.nama);
                }}
              >
                <IconClipboardCheck size={14} />
                <span>Buka Absensi Kelas</span>
              </button>
            )}
          </div>

          {/* Table */}
          {studentsInClass.length === 0 ? (
            <div className="empty-state-card" style={{ padding: "3rem 1.5rem" }}>
              <div className="empty-icon-wrapper">
                <IconUsers size={28} />
              </div>
              <h4 className="empty-title">Belum Ada Siswa Terdaftar</h4>
              <p className="empty-desc">
                Saat ini belum ada siswa yang terdaftar di kelas {targetClass.nama}. Anda dapat menambahkan siswa baru atau mengubah kelas siswa yang sudah ada.
              </p>
            </div>
          ) : (
            <div className="table-wrapper" style={{ maxHeight: "380px", overflowY: "auto" }}>
              <table className="student-table">
                <thead>
                  <tr>
                    <th style={{ width: "45px", textAlign: "center" }}>No</th>
                    <th style={{ width: "110px" }}>NIS</th>
                    <th>Nama Siswa</th>
                    <th style={{ width: "90px" }}>L/P</th>
                    <th>No. HP</th>
                    <th>Alamat</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsInClass.map((student, idx) => {
                    const isMale = student.gender === "Laki-laki";
                    return (
                      <tr key={student.id} className="student-table-row">
                        <td style={{ textAlign: "center", color: "var(--text-subtle)", fontWeight: 600 }}>
                          {idx + 1}
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
                              <span className="student-address-preview">{student.jurusan}</span>
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
                          <span className="phone-cell">
                            <IconPhone size={13} />
                            <span className="phone-text">{student.noHp || "-"}</span>
                          </span>
                        </td>
                        <td>
                          <span className="student-address-preview" title={student.alamat || "-"}>
                            {student.alamat || "-"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
