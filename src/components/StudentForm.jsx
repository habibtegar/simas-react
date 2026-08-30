import React, { useState, useEffect } from "react";
import {
  IconCheck,
  IconClose,
  IconAlertCircle,
  IconUsers,
  IconPhone
} from "./Icons";
import { JURUSAN_OPTIONS, KELAS_OPTIONS } from "../data/initialStudents";

export default function StudentForm({
  initialData = null,
  isEditMode = false,
  existingStudents = [],
  onSubmit,
  onCancel
}) {
  const [formData, setFormData] = useState({
    nis: "",
    nama: "",
    gender: "",
    kelas: "",
    jurusan: "",
    noHp: "",
    alamat: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nis: initialData.nis || "",
        nama: initialData.nama || "",
        gender: initialData.gender || "",
        kelas: initialData.kelas || "",
        jurusan: initialData.jurusan || "",
        noHp: initialData.noHp || "",
        alamat: initialData.alamat || ""
      });
    }
  }, [initialData]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Auto-update jurusan if kelas has clear major name
    if (name === "kelas") {
      if (value.includes("PPLG")) setFormData((p) => ({ ...p, kelas: value, jurusan: "PPLG" }));
      else if (value.includes("Animasi")) setFormData((p) => ({ ...p, kelas: value, jurusan: "Animasi" }));
      else if (value.includes("Broadcasting")) setFormData((p) => ({ ...p, kelas: value, jurusan: "Broadcasting" }));
      else if (value.includes("TO")) setFormData((p) => ({ ...p, kelas: value, jurusan: "TO" }));
      else if (value.includes("TPFL")) setFormData((p) => ({ ...p, kelas: value, jurusan: "TPFL" }));
    }

    // Clear error for field once edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    let errorMsg = "";

    switch (field) {
      case "nis":
        if (!value.trim()) {
          errorMsg = "NIS wajib diisi!";
        } else if (!/^\d+$/.test(value.trim())) {
          errorMsg = "NIS harus berupa angka!";
        } else if (value.trim().length < 4) {
          errorMsg = "NIS minimal 4 digit!";
        } else {
          // Check for duplicate NIS
          const isDuplicate = existingStudents.some(
            (s) => s.nis.trim() === value.trim() && (!isEditMode || s.id !== initialData?.id)
          );
          if (isDuplicate) {
            errorMsg = "NIS ini sudah terdaftar untuk siswa lain!";
          }
        }
        break;

      case "nama":
        if (!value.trim()) {
          errorMsg = "Nama siswa wajib diisi!";
        } else if (value.trim().length < 3) {
          errorMsg = "Nama minimal 3 karakter!";
        }
        break;

      case "gender":
        if (!value) {
          errorMsg = "Jenis kelamin wajib dipilih!";
        }
        break;

      case "kelas":
        if (!value) {
          errorMsg = "Kelas wajib dipilih!";
        }
        break;

      case "jurusan":
        if (!value) {
          errorMsg = "Jurusan wajib dipilih!";
        }
        break;

      case "noHp":
        if (!value.trim()) {
          errorMsg = "Nomor HP wajib diisi!";
        } else if (!/^[0-9+\-\s()]{8,16}$/.test(value.trim())) {
          errorMsg = "Format nomor HP tidak valid (8-16 digit angka)!";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    return !errorMsg;
  };

  const validateAll = () => {
    const fields = ["nis", "nama", "gender", "kelas", "jurusan", "noHp"];
    let isValid = true;
    const newErrors = {};

    fields.forEach((field) => {
      const valid = validateField(field, formData[field]);
      if (!valid) {
        isValid = false;
        newErrors[field] = errors[field] || `${field} belum valid`;
      }
    });

    // Mark all as touched
    const allTouched = fields.reduce((acc, f) => ({ ...acc, [f]: true }), {});
    setTouched(allTouched);

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) {
      return;
    }

    onSubmit({
      ...formData,
      nis: formData.nis.trim(),
      nama: formData.nama.trim(),
      noHp: formData.noHp.trim(),
      alamat: formData.alamat.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="student-form" noValidate>
      <div className="form-grid">
        {/* Input NIS */}
        <div className="form-group">
          <label className="form-label required" htmlFor="input-nis">
            NIS (Nomor Induk Siswa)
          </label>
          <input
            id="input-nis"
            name="nis"
            type="text"
            className={`form-control ${touched.nis && errors.nis ? "is-invalid" : ""}`}
            placeholder="Contoh: 20241011"
            value={formData.nis}
            onChange={handleChange}
            onBlur={() => handleBlur("nis")}
          />
          {touched.nis && errors.nis && (
            <div className="form-error">
              <IconAlertCircle size={14} />
              <span>{errors.nis}</span>
            </div>
          )}
        </div>

        {/* Input Nama Lengkap */}
        <div className="form-group">
          <label className="form-label required" htmlFor="input-nama">
            Nama Lengkap Siswa
          </label>
          <input
            id="input-nama"
            name="nama"
            type="text"
            className={`form-control ${touched.nama && errors.nama ? "is-invalid" : ""}`}
            placeholder="Contoh: Muhammad Rizky Pratama"
            value={formData.nama}
            onChange={handleChange}
            onBlur={() => handleBlur("nama")}
          />
          {touched.nama && errors.nama && (
            <div className="form-error">
              <IconAlertCircle size={14} />
              <span>{errors.nama}</span>
            </div>
          )}
        </div>

        {/* Input Jenis Kelamin (Radio cards) */}
        <div className="form-group full-width">
          <label className="form-label required">
            Jenis Kelamin
          </label>
          <div className="gender-radio-group">
            <label className={`gender-radio-card ${formData.gender === "Laki-laki" ? "selected" : ""}`}>
              <input
                type="radio"
                name="gender"
                value="Laki-laki"
                checked={formData.gender === "Laki-laki"}
                onChange={handleChange}
                onBlur={() => handleBlur("gender")}
              />
              <span className="gender-card-content">
                <span className="gender-title">Laki-laki</span>
                <span className="gender-subtitle">Siswa Putra</span>
              </span>
            </label>

            <label className={`gender-radio-card ${formData.gender === "Perempuan" ? "selected" : ""}`}>
              <input
                type="radio"
                name="gender"
                value="Perempuan"
                checked={formData.gender === "Perempuan"}
                onChange={handleChange}
                onBlur={() => handleBlur("gender")}
              />
              <span className="gender-card-content">
                <span className="gender-title">Perempuan</span>
                <span className="gender-subtitle">Siswi Putri</span>
              </span>
            </label>
          </div>
          {touched.gender && errors.gender && (
            <div className="form-error">
              <IconAlertCircle size={14} />
              <span>{errors.gender}</span>
            </div>
          )}
        </div>

        {/* Input Kelas */}
        <div className="form-group">
          <label className="form-label required" htmlFor="select-kelas">
            Kelas
          </label>
          <select
            id="select-kelas"
            name="kelas"
            className={`form-select ${touched.kelas && errors.kelas ? "is-invalid" : ""}`}
            value={formData.kelas}
            onChange={handleChange}
            onBlur={() => handleBlur("kelas")}
          >
            <option value="">-- Pilih Kelas --</option>
            {KELAS_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          {touched.kelas && errors.kelas && (
            <div className="form-error">
              <IconAlertCircle size={14} />
              <span>{errors.kelas}</span>
            </div>
          )}
        </div>

        {/* Input Jurusan */}
        <div className="form-group">
          <label className="form-label required" htmlFor="select-jurusan">
            Jurusan / Kompetensi Keahlian
          </label>
          <select
            id="select-jurusan"
            name="jurusan"
            className={`form-select ${touched.jurusan && errors.jurusan ? "is-invalid" : ""}`}
            value={formData.jurusan}
            onChange={handleChange}
            onBlur={() => handleBlur("jurusan")}
          >
            <option value="">-- Pilih Jurusan --</option>
            {JURUSAN_OPTIONS.map((j) => (
              <option key={j.id} value={j.id}>
                {j.name}
              </option>
            ))}
          </select>
          {touched.jurusan && errors.jurusan && (
            <div className="form-error">
              <IconAlertCircle size={14} />
              <span>{errors.jurusan}</span>
            </div>
          )}
        </div>

        {/* Input No HP */}
        <div className="form-group">
          <label className="form-label required" htmlFor="input-nohp">
            Nomor HP / WhatsApp
          </label>
          <div className="input-icon-wrapper">
            <span className="input-lead-icon">
              <IconPhone size={16} />
            </span>
            <input
              id="input-nohp"
              name="noHp"
              type="tel"
              className={`form-control with-lead-icon ${touched.noHp && errors.noHp ? "is-invalid" : ""}`}
              placeholder="Contoh: 081234567890"
              value={formData.noHp}
              onChange={handleChange}
              onBlur={() => handleBlur("noHp")}
            />
          </div>
          {touched.noHp && errors.noHp && (
            <div className="form-error">
              <IconAlertCircle size={14} />
              <span>{errors.noHp}</span>
            </div>
          )}
        </div>

        {/* Input Alamat (Opsional) */}
        <div className="form-group">
          <label className="form-label" htmlFor="input-alamat">
            Alamat Domisili <span className="text-muted">(Opsional)</span>
          </label>
          <input
            id="input-alamat"
            name="alamat"
            type="text"
            className="form-control"
            placeholder="Contoh: Jl. Sukajadi No. 123, Bandung"
            value={formData.alamat}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
          >
            <IconClose size={16} />
            <span>Batal</span>
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          <IconCheck size={16} />
          <span>{isEditMode ? "Simpan Perubahan" : "Tambah Siswa"}</span>
        </button>
      </div>
    </form>
  );
}
