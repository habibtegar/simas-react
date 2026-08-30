import React from "react";
import StudentForm from "./StudentForm";
import { IconClose, IconEdit, IconUserPlus } from "./Icons";

export default function StudentModal({
  isOpen,
  onClose,
  student,
  isEditMode,
  existingStudents,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              {isEditMode ? <IconEdit size={20} /> : <IconUserPlus size={20} />}
            </div>
            <div>
              <h3 className="modal-title">
                {isEditMode ? "Edit Data Siswa" : "Tambah Siswa Baru"}
              </h3>
              <p className="modal-subtitle">
                {isEditMode
                  ? "Perbarui informasi data siswa di bawah ini"
                  : "Isi data lengkap untuk mendaftarkan siswa baru"}
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

        <div className="modal-body">
          <StudentForm
            initialData={student}
            isEditMode={isEditMode}
            existingStudents={existingStudents}
            onSubmit={(data) => {
              onSubmit(data);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
