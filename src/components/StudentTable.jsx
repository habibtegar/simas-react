import React from "react";
import {
  IconEdit,
  IconTrash,
  IconEye,
  IconMale,
  IconFemale,
  IconPhone,
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
  const getJurusanBadgeClass = (jurusan) => {
    switch (jurusan) {
      case "PPLG":
        return "badge-jurusan-pplg";
      case "Animasi":
        return "badge-jurusan-animasi";
      case "Broadcasting":
        return "badge-jurusan-broadcasting";
      case "TO":
        return "badge-jurusan-to";
      case "TPFL":
        return "badge-jurusan-tpfl";
      default:
        return "badge-jurusan-default";
    }
  };

  const getInitials = (name) => {
    if (!name) return "S";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="table-responsive-container">
      {students.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon-wrapper">
            <IconUsers size={48} />
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
                <th className="th-center" style={{ width: "60px" }}>No</th>
                <th style={{ width: "120px" }}>NIS</th>
                <th>Nama Siswa</th>
                <th style={{ width: "130px" }}>Jenis Kelamin</th>
                <th style={{ width: "120px" }}>Kelas</th>
                <th style={{ width: "110px" }}>Jurusan</th>
                <th style={{ width: "150px" }}>No. HP</th>
                <th className="th-center" style={{ width: "140px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const isMale = student.gender === "Laki-laki";
                return (
                  <tr key={student.id} className="student-table-row">
                    {/* No */}
                    <td className="td-center text-muted fw-bold">
                      {index + 1}
                    </td>

                    {/* NIS */}
                    <td>
                      <span className="nis-code">{student.nis}</span>
                    </td>

                    {/* Nama Siswa + Avatar */}
                    <td>
                      <div className="student-name-cell">
                        <div className={`student-avatar ${isMale ? "avatar-male" : "avatar-female"}`}>
                          {getInitials(student.nama)}
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
                      <span className={`gender-badge ${isMale ? "gender-badge-male" : "gender-badge-female"}`}>
                        {isMale ? <IconMale size={14} /> : <IconFemale size={14} />}
                        <span>{student.gender}</span>
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
                      <span className={`jurusan-badge ${getJurusanBadgeClass(student.jurusan)}`}>
                        {student.jurusan}
                      </span>
                    </td>

                    {/* No HP */}
                    <td>
                      <div className="phone-cell">
                        <IconPhone size={14} className="text-muted" />
                        <span className="phone-text">{student.noHp}</span>
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="td-center">
                      <div className="table-actions">
                        {/* Detail Button */}
                        <button
                          type="button"
                          className="action-btn action-btn-view"
                          title="Lihat Detail Siswa"
                          onClick={() => onViewDetail(student)}
                          aria-label={`Detail ${student.nama}`}
                        >
                          <IconEye size={16} />
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          className="action-btn action-btn-edit"
                          title="Edit Data Siswa"
                          onClick={() => onEdit(student)}
                          aria-label={`Edit ${student.nama}`}
                        >
                          <IconEdit size={16} />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          className="action-btn action-btn-delete"
                          title="Hapus Data Siswa"
                          onClick={() => onDelete(student)}
                          aria-label={`Hapus ${student.nama}`}
                        >
                          <IconTrash size={16} />
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
