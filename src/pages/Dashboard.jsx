import React from "react";
import StatisticCard from "../components/StatisticCard";
import {
  IconUsers,
  IconMale,
  IconFemale,
  IconSchool,
  IconUserPlus,
  IconEye,
  IconEdit,
  IconTrash,
  IconClipboardCheck,
  IconPhone
} from "../components/Icons";
import { JURUSAN_OPTIONS } from "../data/initialStudents";

export default function Dashboard({
  students,
  onNavigateToStudents,
  onNavigateToAdd,
  onNavigateToAttendance,
  onViewStudentDetail,
  onEditStudent,
  onDeleteStudent
}) {
  // Statistics Calculations
  const totalStudents = students.length;
  const maleCount = students.filter((s) => s.gender === "Laki-laki").length;
  const femaleCount = students.filter((s) => s.gender === "Perempuan").length;

  // Unique Classes
  const uniqueClasses = Array.from(new Set(students.map((s) => s.kelas))).filter(Boolean);
  const totalClasses = uniqueClasses.length;

  // Percentage Calculations
  const malePercent = totalStudents > 0 ? Math.round((maleCount / totalStudents) * 100) : 0;
  const femalePercent = totalStudents > 0 ? Math.round((femaleCount / totalStudents) * 100) : 0;

  // Breakdown by Major
  const majorStats = JURUSAN_OPTIONS.map((major) => {
    const count = students.filter((s) => s.jurusan === major.id).length;
    const percent = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
    return {
      ...major,
      count,
      percent
    };
  });

  // Recent 5 Students
  const recentStudents = [...students].slice(-5).reverse();

  return (
    <div className="dashboard-page">
      {/* Clean Dashboard Header */}
      <div className="page-header-container">
        <div className="page-header-titles">
          <h2 className="page-main-title">Ringkasan Sistem</h2>
          <p className="page-main-desc">
            Statistik data induk siswa dan rombongan belajar SMKN 1 Ciomas tahun ajaran 2024/2025.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onNavigateToAttendance}
          >
            <IconClipboardCheck size={16} />
            <span>Absensi Siswa</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onNavigateToAdd}
          >
            <IconUserPlus size={16} />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="stats-grid">
        <StatisticCard
          title="Total Siswa"
          value={totalStudents}
          icon={<IconUsers size={18} />}
          badgeText="Terdaftar"
          subtext="Semua tingkatan"
          onClick={onNavigateToStudents}
        />

        <StatisticCard
          title="Siswa Laki-Laki"
          value={maleCount}
          icon={<IconMale size={18} />}
          badgeText={`${malePercent}%`}
          subtext={`${maleCount} siswa`}
        />

        <StatisticCard
          title="Siswa Perempuan"
          value={femaleCount}
          icon={<IconFemale size={18} />}
          badgeText={`${femalePercent}%`}
          subtext={`${femaleCount} siswi`}
        />

        <StatisticCard
          title="Rombel Kelas"
          value={totalClasses}
          icon={<IconSchool size={18} />}
          badgeText="Aktif"
          subtext="X, XI, XII"
        />
      </div>

      {/* Analytics 2-Column Section */}
      <div className="dashboard-grid-2col">
        {/* Major Distribution */}
        <div className="card-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Distribusi Program Keahlian</h3>
              <p className="panel-subtitle">Jumlah siswa per jurusan/kompetensi</p>
            </div>
          </div>
          <div className="panel-body">
            <div className="major-list">
              {majorStats.map((major) => (
                <div key={major.id} className="major-item">
                  <div className="major-info">
                    <span className="major-name">{major.name.split("(")[0]}</span>
                    <span className="major-count">
                      <strong>{major.count}</strong> siswa ({major.percent}%)
                    </span>
                  </div>
                  <div className="major-progress-bg">
                    <div
                      className="major-progress-fill"
                      style={{ width: `${Math.max(major.percent, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gender Ratio */}
        <div className="card-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Komposisi Gender Siswa</h3>
              <p className="panel-subtitle">Perbandingan rasio putra dan putri</p>
            </div>
          </div>
          <div className="panel-body">
            {/* Visual ratio bar */}
            <div className="gender-ratio-bar">
              <div
                className="ratio-fill ratio-male"
                style={{ width: `${Math.max(malePercent, 10)}%` }}
              >
                {malePercent}%
              </div>
              <div
                className="ratio-fill ratio-female"
                style={{ width: `${Math.max(femalePercent, 10)}%` }}
              >
                {femalePercent}%
              </div>
            </div>

            {/* Gender breakdown rows */}
            <div className="gender-summary-list">
              <div className="gender-row">
                <div className="gender-row-left">
                  <span className="gender-indicator dot-male" />
                  <span className="gender-label">Siswa Laki-Laki (Putra)</span>
                </div>
                <div className="gender-row-right">
                  <strong>{maleCount}</strong> Siswa
                  <span className="gender-percent">({malePercent}%)</span>
                </div>
              </div>

              <div className="gender-row">
                <div className="gender-row-left">
                  <span className="gender-indicator dot-female" />
                  <span className="gender-label">Siswa Perempuan (Putri)</span>
                </div>
                <div className="gender-row-right">
                  <strong>{femaleCount}</strong> Siswi
                  <span className="gender-percent">({femalePercent}%)</span>
                </div>
              </div>
            </div>

            <div className="panel-info-note">
              <span>Rasio perbandingan gender berimbang mendukung iklim belajar yang inklusif di lingkungan sekolah.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Students Table Section */}
      <div className="card-panel mt-4">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Data Siswa Terbaru</h3>
            <p className="panel-subtitle">5 data siswa yang terakhir didaftarkan</p>
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={onNavigateToStudents}
          >
            Lihat Semua ({totalStudents})
          </button>
        </div>

        <div className="table-wrapper">
          {recentStudents.length === 0 ? (
            <div className="p-4 text-center text-muted">
              Belum ada data siswa terdaftar.
            </div>
          ) : (
            <table className="student-table">
              <thead>
                <tr>
                  <th style={{ width: "110px" }}>NIS</th>
                  <th>Nama Siswa</th>
                  <th style={{ width: "100px" }}>L/P</th>
                  <th style={{ width: "130px" }}>Kelas</th>
                  <th style={{ width: "120px" }}>Jurusan</th>
                  <th style={{ width: "140px" }}>No. HP</th>
                  <th style={{ width: "110px", textAlign: "center" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((student) => {
                  const isMale = student.gender === "Laki-laki";
                  return (
                    <tr key={student.id} className="student-table-row">
                      <td>
                        <span className="nis-code">{student.nis}</span>
                      </td>
                      <td>
                        <div className="student-name-cell">
                          <span className="student-name-text">{student.nama}</span>
                        </div>
                      </td>
                      <td>
                        <span className="gender-tag">
                          {isMale ? "Laki-laki" : "Perempuan"}
                        </span>
                      </td>
                      <td>
                        <span className="class-badge">{student.kelas}</span>
                      </td>
                      <td>
                        <span className="jurusan-tag">{student.jurusan}</span>
                      </td>
                      <td>
                        <span className="phone-text">{student.noHp || "-"}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="action-btn action-btn-view"
                            onClick={() => onViewStudentDetail(student)}
                            title="Lihat Rincian"
                          >
                            <IconEye size={15} />
                          </button>
                          <button
                            type="button"
                            className="action-btn action-btn-edit"
                            onClick={() => onEditStudent(student)}
                            title="Edit Siswa"
                          >
                            <IconEdit size={15} />
                          </button>
                          <button
                            type="button"
                            className="action-btn action-btn-delete"
                            onClick={() => onDeleteStudent(student.id)}
                            title="Hapus Siswa"
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
          )}
        </div>
      </div>
    </div>
  );
}
