import React from "react";
import {
  IconClose,
  IconMale,
  IconFemale,
  IconPhone,
  IconGraduationCap,
  IconEdit
} from "./Icons";
import { formatDateIndonesia } from "../utils/storage";

export default function StudentDetailModal({
  isOpen,
  student,
  onClose,
  onEdit
}) {
  if (!isOpen || !student) return null;

  const isMale = student.gender === "Laki-laki";

  const getInitials = (name) => {
    if (!name) return "S";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container modal-detail" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header border-none">
          <span className="badge-system-tag">Kartu Identitas Siswa</span>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Tutup modal"
          >
            <IconClose size={20} />
          </button>
        </div>

        <div className="modal-body pt-0">
          <div className="student-id-card">
            {/* ID Card Top Banner */}
            <div className="id-card-banner">
              <div className="school-brand">
                <IconGraduationCap size={24} />
                <span>SMK INFORMATIKA TERPADU</span>
              </div>
              <span className="id-card-tag">{student.jurusan}</span>
            </div>

            {/* Avatar & Main Info */}
            <div className="id-card-profile">
              <div className={`id-card-avatar ${isMale ? "avatar-male" : "avatar-female"}`}>
                {getInitials(student.nama)}
              </div>
              <h3 className="id-card-name">{student.nama}</h3>
              <span className="id-card-nis">NIS: {student.nis}</span>
            </div>

            {/* Detail Grid */}
            <div className="id-card-grid">
              <div className="id-card-item">
                <span className="id-label">Jenis Kelamin</span>
                <span className="id-value">
                  {isMale ? <IconMale size={14} className="text-blue" /> : <IconFemale size={14} className="text-pink" />}
                  {student.gender}
                </span>
              </div>

              <div className="id-card-item">
                <span className="id-label">Kelas</span>
                <span className="id-value font-bold">{student.kelas}</span>
              </div>

              <div className="id-card-item">
                <span className="id-label">Kompetensi Keahlian</span>
                <span className="id-value">{student.jurusan}</span>
              </div>

              <div className="id-card-item">
                <span className="id-label">Status Siswa</span>
                <span className="id-value">
                  <span className="status-dot green"></span>
                  {student.status || "Aktif"}
                </span>
              </div>

              <div className="id-card-item full">
                <span className="id-label">Nomor WhatsApp / HP</span>
                <span className="id-value">
                  <IconPhone size={14} />
                  <a href={`https://wa.me/${student.noHp?.replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="phone-link">
                    {student.noHp}
                  </a>
                </span>
              </div>

              <div className="id-card-item full">
                <span className="id-label">Alamat Domisili</span>
                <span className="id-value">{student.alamat || "Belum diisi"}</span>
              </div>

              <div className="id-card-item full">
                <span className="id-label">Terdaftar Sejak</span>
                <span className="id-value text-muted">{formatDateIndonesia(student.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            Tutup
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onEdit(student);
            }}
          >
            <IconEdit size={16} />
            <span>Edit Siswa Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
}
