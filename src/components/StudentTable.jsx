import React from "react";
import {
  IconEdit,
  IconTrash,
  IconEye,
  IconUsers,
  IconPlus
} from "./Icons";

export default function StudentTable({
  students,
  allStudentsCount,
  onEdit,
  onDelete,
  onViewDetail,
  onAddNew
}) {
  return (
    <div className="table-responsive-container">
      {students.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon-wrapper">
            <IconUsers size={32} />
          </div>
          <h3 className="empty-title">Data Siswa Tidak Ditemukan</h3>
          <p className="empty-desc">
            {allStudentsCount === 0
              ? "Belum ada data siswa yang tersimpan di sistem. Silakan tambahkan data baru."
              : "Tidak ada siswa yang sesuai dengan kriteria pencarian atau filter yang dipilih."}
          </p>
          {allStudentsCount === 0 && (
            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={onAddNew}
            >
              <IconPlus size={16} />
              <span>Tambah Siswa Pertama</span>
            </button>
          )}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th style={{ width: "50px", textAlign: "center" }}>No</th>
                <th style={{ width: "110px" }}>NIS</th>
                <th>Nama Siswa</th>
                <th style={{ width: "110px" }}>Jenis Kelamin</th>
                <th style={{ width: "120px" }}>Kelas</th>
                <th style={{ width: "110px" }}>Jurusan</th>
                <th style={{ width: "130px" }}>No. HP</th>
                <th style={{ width: "110px", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const isMale = student.gender === "Laki-laki";
                return (
                  <tr key={student.id} className="student-table-row">
                    {/* No */}
                    <td style={{ textAlign: "center", color: "var(--text-subtle)", fontWeight: 500 }}>
                      {index + 1}
                    </td>

                    {/* NIS */}
                    <td>
                      <span className="nis-code">{student.nis}</span>
                    </td>

                    {/* Nama Siswa */}
                    <td>
                      <div className="student-name-cell">
                        <div className={`student-avatar-box ${isMale ? "avatar-m" : "avatar-f"}`}>
                          {student.nama ? student.nama.charAt(0).toUpperCase() : "S"}
                        </div>
                        <div className="student-name-info">
                          <span className="student-name-text">{student.nama}</span>
                          {student.alamat && (
                            <span className="student-address-preview">{student.alamat}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Jenis Kelamin */}
                    <td>
                      <span className="gender-tag">
                        {student.gender}
                      </span>
                    </td>

                    {/* Kelas */}
                    <td>
                      <span className="class-badge">
                        {student.kelas}
                      </span>
                    </td>

                    {/* Jurusan */}
                    <td>
                      <span className="jurusan-tag">
                        {student.jurusan}
                      </span>
                    </td>

                    {/* No HP */}
                    <td>
                      <span className="phone-text">{student.noHp || "-"}</span>
                    </td>

                    {/* Aksi */}
                    <td style={{ textAlign: "center" }}>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="action-btn action-btn-view"
                          title="Lihat Detail Siswa"
                          onClick={() => onViewDetail(student)}
                          aria-label={`Detail ${student.nama}`}
                        >
                          <IconEye size={15} />
                        </button>

                        <button
                          type="button"
                          className="action-btn action-btn-edit"
                          title="Edit Data Siswa"
                          onClick={() => onEdit(student)}
                          aria-label={`Edit ${student.nama}`}
                        >
                          <IconEdit size={15} />
                        </button>

                        <button
                          type="button"
                          className="action-btn action-btn-delete"
                          title="Hapus Data Siswa"
                          onClick={() => onDelete(student)}
                          aria-label={`Hapus ${student.nama}`}
                        >
                          <IconTrash size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="table-footer-info">
            <span>
              Menampilkan <strong>{students.length}</strong> dari <strong>{allStudentsCount}</strong> total siswa
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
