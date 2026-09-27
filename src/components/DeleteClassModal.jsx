import React from "react";
import { IconAlertCircle, IconClose, IconTrash } from "./Icons";

export default function DeleteClassModal({
  isOpen,
  classData,
  studentCount = 0,
  onClose,
  onConfirm
}) {
  if (!isOpen || !classData) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header border-none pb-0">
          <div className="modal-icon-badge badge-danger">
            <IconTrash size={22} />
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

        <div className="modal-body text-center pt-2">
          <h3 className="modal-title font-lg">Hapus Data Kelas?</h3>
          <p className="modal-confirm-desc">
            Apakah Anda yakin ingin menghapus kelas <strong>"{classData.nama}"</strong>?
          </p>

          {studentCount > 0 ? (
            <div className="alert-box-warning" style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#b91c1c" }}>
              <IconAlertCircle size={18} />
              <span>
                <strong>Peringatan:</strong> Masih terdapat <strong>{studentCount} siswa</strong> yang terdaftar pada kelas ini. Siswa tidak akan terhapus namun kelasnya perlu disesuaikan kembali.
              </span>
            </div>
          ) : (
            <div className="alert-box-warning">
              <IconAlertCircle size={16} />
              <span>Tindakan ini tidak dapat dibatalkan. Kelas akan terhapus dari sistem & LocalStorage.</span>
            </div>
          )}
        </div>

        <div className="modal-footer justify-center">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              onConfirm(classData.id);
              onClose();
            }}
          >
            <IconTrash size={16} />
            <span>Ya, Hapus Kelas</span>
          </button>
        </div>
      </div>
    </div>
  );
}
