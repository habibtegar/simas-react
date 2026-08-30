import React from "react";
import { IconAlertCircle, IconClose, IconTrash } from "./Icons";

export default function DeleteConfirmModal({
  isOpen,
  student,
  onClose,
  onConfirm
}) {
  if (!isOpen || !student) return null;

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
          <h3 className="modal-title font-lg">Hapus Data Siswa?</h3>
          <p className="modal-confirm-desc">
            Apakah Anda yakin ingin menghapus data siswa <strong>"{student.nama}"</strong> dengan NIS <strong>{student.nis}</strong>?
          </p>
          <div className="alert-box-warning">
            <IconAlertCircle size={16} />
            <span>Tindakan ini tidak dapat dibatalkan. Data akan terhapus dari sistem & LocalStorage.</span>
          </div>
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
              onConfirm(student.id);
              onClose();
            }}
          >
            <IconTrash size={16} />
            <span>Ya, Hapus Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
