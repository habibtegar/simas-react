import React from "react";
import StudentForm from "../components/StudentForm";
import {
  IconUserPlus,
  IconBadgeCheck,
  IconGraduationCap,
  IconUsers
} from "../components/Icons";

export default function AddStudentPage({
  existingStudents,
  onAddStudent,
  onCancel
}) {
  return (
    <div className="add-student-page">
      {/* Page Header */}
      <div className="page-header-container">
        <div className="page-header-titles">
          <h2 className="page-main-title">Pendaftaran Siswa Baru</h2>
          <p className="page-main-desc">
            Masukkan data siswa baru dengan lengkap dan benar ke dalam database sistem.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          <IconUsers size={16} />
          <span>Kembali ke Data Siswa</span>
        </button>
      </div>

      <div className="form-page-layout">
        {/* Main Form Card */}
        <div className="card-panel form-main-card">
          <div className="panel-header">
            <div className="panel-header-icon-title">
              <div className="modal-icon-badge">
                <IconUserPlus size={20} />
              </div>
              <div>
                <h3 className="panel-title">Formulir Data Siswa</h3>
                <p className="panel-subtitle">Pastikan semua kolom bertanda bintang (*) diisi</p>
              </div>
            </div>
          </div>

          <div className="panel-body">
            <StudentForm
              existingStudents={existingStudents}
              onSubmit={onAddStudent}
              onCancel={onCancel}
            />
          </div>
        </div>

        {/* Sidebar Info Card */}
        <div className="form-sidebar-info">
          <div className="card-panel tip-card">
            <div className="tip-header">
              <IconBadgeCheck size={20} className="text-primary" />
              <h4>Panduan Pengisian</h4>
            </div>
            <ul className="tip-list">
              <li>
                <strong>NIS:</strong> Nomor Induk Siswa harus berupa angka unik dan belum pernah didaftarkan.
              </li>
              <li>
                <strong>Nama Siswa:</strong> Gunakan nama lengkap resmi sesuai ijazah/akta kelahiran.
              </li>
              <li>
                <strong>Kelas & Jurusan:</strong> Memilih kelas akan otomatis menyelaraskan jurusan keahlian siswa.
              </li>
              <li>
                <strong>No. HP:</strong> Disarankan memasukkan nomor yang terhubung dengan WhatsApp untuk kemudahan komunikasi.
              </li>
            </ul>
          </div>

          <div className="card-panel stats-preview-card">
            <div className="tip-header">
              <IconGraduationCap size={20} className="text-secondary" />
              <h4>Status Data</h4>
            </div>
            <div className="mini-stat-item">
              <span className="mini-stat-label">Total Siswa Terdaftar:</span>
              <span className="mini-stat-value">{existingStudents.length} Siswa</span>
            </div>
            <div className="mini-stat-item">
              <span className="mini-stat-label">Penyimpanan:</span>
              <span className="mini-stat-badge">LocalStorage Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
