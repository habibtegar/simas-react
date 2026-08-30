import React from "react";
import StatisticCard from "../components/StatisticCard";
import {
  IconUsers,
  IconMale,
  IconFemale,
  IconSchool,
  IconUserPlus,
  IconBook,
  IconGraduationCap,
  IconEye,
  IconEdit,
  IconTrash
} from "../components/Icons";
import { JURUSAN_OPTIONS } from "../data/initialStudents";

export default function Dashboard({
  students,
  onNavigateToStudents,
  onNavigateToAdd,
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
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-tag">
            <IconGraduationCap size={16} />
            <span>Aplikasi Manajemen Siswa</span>
          </div>
          <h2 className="welcome-heading">Selamat Datang di SIMAS SMK NEGERI 1 CIOMAS</h2>
          <p className="welcome-text">
            Sistem Informasi Manajemen Data Siswa terpadu. Kelola data siswa, pantau statistik kelas, dan rekapitulasi data dengan cepat dan efisien.
          </p>
          <div className="welcome-actions">
            <button
              type="button"
              className="btn btn-light-primary"
              onClick={onNavigateToAdd}
            >
              <IconUserPlus size={18} />
              <span>Tambah Siswa Baru</span>
            </button>
            <button
              type="button"
              className="btn btn-outline-white"
              onClick={onNavigateToStudents}
            >
              <IconUsers size={18} />
              <span>Lihat Data Tabel</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main Statistic Cards */}
      <div className="stats-grid">
        <StatisticCard
          title="Total Seluruh Siswa"
          value={totalStudents}
          icon={<IconUsers size={24} />}
          badgeText="100% Terdaftar"
          badgeType="primary"
          colorVariant="blue"
          subtext="Semua tingkatan kelas"
          onClick={onNavigateToStudents}
        />

        <StatisticCard
          title="Siswa Laki-Laki"
          value={maleCount}
          icon={<IconMale size={24} />}
          badgeText={`${malePercent}% dari Total`}
          badgeType="info"
          colorVariant="indigo"
          subtext={`${maleCount} siswa putra`}
        />

        <StatisticCard
          title="Siswa Perempuan"
          value={femaleCount}
          icon={<IconFemale size={24} />}
          badgeText={`${femalePercent}% dari Total`}
          badgeType="purple"
          colorVariant="pink"
          subtext={`${femaleCount} siswi putri`}
        />

        <StatisticCard
          title="Jumlah Rombel / Kelas"
          value={totalClasses}
          icon={<IconSchool size={24} />}
          badgeText="Kelas Aktif"
          badgeType="success"
          colorVariant="emerald"
          subtext="Tingkat X, XI, dan XII"
        />
      </div>

      {/* Analytics & Breakdown Section */}
      <div className="dashboard-grid-2col">
        {/* Gender Distribution Visualizer */}
        <div className="card-panel">
          <div className="panel-header">
            <h3 className="panel-title">Distribusi Gender Siswa</h3>
            <span className="panel-badge">Rasio</span>
          </div>
          <div className="panel-body">
            <div className="gender-ratio-bar">
              <div
                className="ratio-fill ratio-male"
                style={{ width: `${malePercent}%` }}
                title={`Laki-laki: ${malePercent}%`}
              >
                {malePercent >= 15 && `${malePercent}%`}
              </div>
              <div
                className="ratio-fill ratio-female"
                style={{ width: `${femalePercent}%` }}
                title={`Perempuan: ${femalePercent}%`}
              >
                {femalePercent >= 15 && `${femalePercent}%`}
              </div>
            </div>

            <div className="gender-legend">
              <div className="legend-item">
                <span className="legend-dot dot-male"></span>
                <span className="legend-label">Laki-laki</span>
                <span className="legend-value">{maleCount} Siswa ({malePercent}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-female"></span>
                <span className="legend-label">Perempuan</span>
                <span className="legend-value">{femaleCount} Siswa ({femalePercent}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Major / Jurusan Distribution */}
        <div className="card-panel">
          <div className="panel-header">
            <h3 className="panel-title">Statistik Per Jurusan</h3>
            <span className="panel-badge">Kompetensi Keahlian</span>
          </div>
          <div className="panel-body">
            <div className="major-list">
              {majorStats.map((item) => (
                <div key={item.id} className="major-item">
                  <div className="major-info">
                    <span className="major-name">{item.id}</span>
                    <span className="major-count">{item.count} Siswa</span>
                  </div>
                  <div className="major-progress-bg">
                    <div
                      className={`major-progress-fill fill-${item.badgeColor}`}
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Students Table Panel */}
      <div className="card-panel mt-4">
        <div className="panel-header flex-between">
          <div>
            <h3 className="panel-title">Siswa Terbaru Terdaftar</h3>
            <p className="panel-subtitle">5 data siswa yang baru saja ditambahkan</p>
          </div>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={onNavigateToStudents}
          >
            <span>Lihat Semua Siswa</span>
            <IconUsers size={16} />
          </button>
        </div>

        <div className="panel-body p-0">
          {recentStudents.length === 0 ? (
            <div className="empty-panel text-center p-4">
              <p className="text-muted">Belum ada siswa terdaftar.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>NIS</th>
                    <th>Nama Siswa</th>
                    <th>Gender</th>
                    <th>Kelas</th>
                    <th>Jurusan</th>
                    <th className="th-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map((student) => (
                    <tr key={student.id}>
                      <td><span className="nis-code">{student.nis}</span></td>
                      <td className="fw-medium">{student.nama}</td>
                      <td>
                        <span className={`gender-badge ${student.gender === "Laki-laki" ? "gender-badge-male" : "gender-badge-female"}`}>
                          {student.gender}
                        </span>
                      </td>
                      <td><span className="class-badge">{student.kelas}</span></td>
                      <td><span className="jurusan-badge badge-jurusan-pplg">{student.jurusan}</span></td>
                      <td className="td-center">
                        <div className="table-actions">
                          <button
                            type="button"
                            className="action-btn action-btn-view"
                            title="Detail Siswa"
                            onClick={() => onViewStudentDetail(student)}
                          >
                            <IconEye size={15} />
                          </button>
                          <button
                            type="button"
                            className="action-btn action-btn-edit"
                            title="Edit Siswa"
                            onClick={() => onEditStudent(student)}
                          >
                            <IconEdit size={15} />
                          </button>
                          <button
                            type="button"
                            className="action-btn action-btn-delete"
                            title="Hapus Siswa"
                            onClick={() => onDeleteStudent(student)}
                          >
                            <IconTrash size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
