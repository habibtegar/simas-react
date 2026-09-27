import React, { useState, useEffect } from "react";
import { IconClose, IconSchool, IconEdit, IconAlertCircle } from "./Icons";
import { JURUSAN_OPTIONS } from "../data/initialStudents";

export default function ClassModal({
  isOpen,
  onClose,
  classData,
  isEditMode,
  existingClasses,
  onSubmit
}) {
  const [formData, setFormData] = useState({
    nama: "",
    tingkat: "XI",
    jurusan: "PPLG",
    waliKelas: "",
    ruangan: "",
    tahunAjaran: "2024/2025"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (classData) {
      setFormData({
        nama: classData.nama || "",
        tingkat: classData.tingkat || "XI",
        jurusan: classData.jurusan || "PPLG",
        waliKelas: classData.waliKelas || "",
        ruangan: classData.ruangan || "",
        tahunAjaran: classData.tahunAjaran || "2024/2025"
      });
    } else {
      setFormData({
        nama: "",
        tingkat: "XI",
        jurusan: "PPLG",
        waliKelas: "",
        ruangan: "",
        tahunAjaran: "2024/2025"
      });
    }
    setErrors({});
  }, [classData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Auto-suggest class name if tingkat or jurusan changes and user hasn't typed custom name
      return next;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.nama.trim()) {
      errs.nama = "Nama kelas wajib diisi (contoh: XI PPLG 1)";
    } else {
      // Check duplicate name
      const duplicate = existingClasses.find(
        (c) =>
          c.nama.toLowerCase().trim() === formData.nama.toLowerCase().trim() &&
          (!isEditMode || c.id !== classData?.id)
      );
      if (duplicate) {
        errs.nama = "Nama kelas sudah digunakan!";
      }
    }

    if (!formData.waliKelas.trim()) {
      errs.waliKelas = "Nama wali kelas wajib diisi";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              {isEditMode ? <IconEdit size={20} /> : <IconSchool size={20} />}
            </div>
            <div>
              <h3 className="modal-title">
                {isEditMode ? "Edit Data Kelas" : "Tambah Kelas Baru"}
              </h3>
              <p className="modal-subtitle">
                {isEditMode
                  ? "Perbarui informasi rombongan belajar dan wali kelas"
                  : "Daftarkan rombongan belajar dan tentukan wali kelas"}
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

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* Nama Kelas */}
              <div className="form-group full-width">
                <label className="form-label required">Nama Kelas / Rombel</label>
                <input
                  type="text"
                  name="nama"
                  className={`form-control ${errors.nama ? "is-invalid" : ""}`}
                  placeholder="Contoh: XI PPLG 1, X Animasi 2"
                  value={formData.nama}
                  onChange={handleChange}
                  autoFocus
                />
                {errors.nama && (
                  <span className="form-error">
                    <IconAlertCircle size={14} />
                    <span>{errors.nama}</span>
                  </span>
                )}
              </div>

              {/* Tingkat */}
              <div className="form-group">
                <label className="form-label required">Tingkat Kelas</label>
                <select
                  name="tingkat"
                  className="form-select"
                  value={formData.tingkat}
                  onChange={handleChange}
                >
                  <option value="X">Kelas X (Sepuluh)</option>
                  <option value="XI">Kelas XI (Sebelas)</option>
                  <option value="XII">Kelas XII (Dua Belas)</option>
                </select>
              </div>

              {/* Jurusan */}
              <div className="form-group">
                <label className="form-label required">Kompetensi Keahlian</label>
                <select
                  name="jurusan"
                  className="form-select"
                  value={formData.jurusan}
                  onChange={handleChange}
                >
                  {JURUSAN_OPTIONS.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Wali Kelas */}
              <div className="form-group full-width">
                <label className="form-label required">Wali Kelas</label>
                <input
                  type="text"
                  name="waliKelas"
                  className={`form-control ${errors.waliKelas ? "is-invalid" : ""}`}
                  placeholder="Contoh: Budi Santoso, S.Kom., Gr."
                  value={formData.waliKelas}
                  onChange={handleChange}
                />
                {errors.waliKelas && (
                  <span className="form-error">
                    <IconAlertCircle size={14} />
                    <span>{errors.waliKelas}</span>
                  </span>
                )}
              </div>

              {/* Ruangan Kelas */}
              <div className="form-group">
                <label className="form-label">Ruangan / Lab</label>
                <input
                  type="text"
                  name="ruangan"
                  className="form-control"
                  placeholder="Contoh: Lab RPL 1 / Gedung B201"
                  value={formData.ruangan}
                  onChange={handleChange}
                />
              </div>

              {/* Tahun Ajaran */}
              <div className="form-group">
                <label className="form-label">Tahun Ajaran</label>
                <input
                  type="text"
                  name="tahunAjaran"
                  className="form-control"
                  placeholder="Contoh: 2024/2025"
                  value={formData.tahunAjaran}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditMode ? "Simpan Perubahan" : "Tambah Kelas"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
