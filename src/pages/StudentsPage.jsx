import React, { useState, useMemo } from "react";
import StudentTable from "../components/StudentTable";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import StudentModal from "../components/StudentModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import StudentDetailModal from "../components/StudentDetailModal";
import {
  IconPlus,
  IconDownload,
  IconUsers,
  IconRefresh
} from "../components/Icons";

export default function StudentsPage({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onNavigateToAdd
}) {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("");

  // Modal States
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedStudentForDelete, setSelectedStudentForDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter & Search Logic
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Search matching (Nama, NIS, Kelas)
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        student.nama?.toLowerCase().includes(q) ||
        student.nis?.toLowerCase().includes(q) ||
        student.kelas?.toLowerCase().includes(q);

      // Gender filter
      const matchGender = !filterGender || student.gender === filterGender;

      // Kelas filter
      const matchKelas = !filterKelas || student.kelas === filterKelas;

      // Jurusan filter
      const matchJurusan = !filterJurusan || student.jurusan === filterJurusan;

      return matchSearch && matchGender && matchKelas && matchJurusan;
    });
  }, [students, searchQuery, filterGender, filterKelas, filterJurusan]);

  // Reset all filters & search
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterGender("");
    setFilterKelas("");
    setFilterJurusan("");
  };

  // Handlers for Edit
  const handleOpenEdit = (student) => {
    setSelectedStudentForEdit(student);
    setIsEditModalOpen(true);
  };

  // Handlers for Delete
  const handleOpenDelete = (student) => {
    setSelectedStudentForDelete(student);
    setIsDeleteModalOpen(true);
  };

  // Handlers for Detail
  const handleOpenDetail = (student) => {
    setSelectedStudentForDetail(student);
    setIsDetailModalOpen(true);
  };

  // Export Data to Excel (.xls) with custom grids, headers, and zero-padding protection
  const handleExportExcel = () => {
    if (filteredStudents.length === 0) return;

    const headers = ["No", "NIS", "Nama Siswa", "Jenis Kelamin", "Kelas", "Jurusan", "No HP", "Alamat"];

    // Generate table rows HTML
    const rowsHtml = filteredStudents.map((s, idx) => `
      <tr>
        <td style="text-align: center; border: 1px solid #cbd5e1; padding: 8px;">${idx + 1}</td>
        <td style="mso-number-format:'\\@'; border: 1px solid #cbd5e1; padding: 8px;">${s.nis}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${s.nama}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${s.gender}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${s.kelas}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${s.jurusan}</td>
        <td style="mso-number-format:'\\@'; border: 1px solid #cbd5e1; padding: 8px;">${s.noHp}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${s.alamat || '-'}</td>
      </tr>
    `).join("");

    const headersHtml = headers.map(h => `<th style="background-color: #4f46e5; color: #ffffff; font-weight: bold; border: 1px solid #cbd5e1; padding: 10px; text-align: left;">${h}</th>`).join("");

    const htmlTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Data Siswa</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
          th { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
          td { border: 1px solid #cbd5e1; padding: 8px; }
        </style>
      </head>
      <body>
        <h2>Data Siswa SIMAS SMK</h2>
        <p>Tanggal Ekspor: ${new Intl.DateTimeFormat('id-ID', { dateStyle: 'full', timeStyle: 'short' }).format(new Date())}</p>
        <table>
          <thead>
            <tr>${headersHtml}</tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlTemplate], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `data_siswa_smk_${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isFiltering = searchQuery !== "" || filterGender !== "" || filterKelas !== "" || filterJurusan !== "";

  return (
    <div className="students-page">
      {/* Page Header Bar */}
      <div className="page-header-container">
        <div className="page-header-titles">
          <h2 className="page-main-title">Daftar Data Siswa</h2>
          <p className="page-main-desc">
            Kelola data induk siswa SMK secara lengkap, cepat, dan terorganisir.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleExportExcel}
            title="Download data sebagai file Excel"
            disabled={filteredStudents.length === 0}
          >
            <IconDownload size={16} />
            <span>Ekspor Excel</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onNavigateToAdd}
          >
            <IconPlus size={16} />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="toolbar-container">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Cari nama, NIS, atau kelas siswa..."
        />

        <FilterBar
          filterGender={filterGender}
          setFilterGender={setFilterGender}
          filterKelas={filterKelas}
          setFilterKelas={setFilterKelas}
          filterJurusan={filterJurusan}
          setFilterJurusan={setFilterJurusan}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Filter Status Badge if active */}
      {isFiltering && (
        <div className="filter-active-indicator">
          <span>
            Menemukan <strong>{filteredStudents.length}</strong> siswa dari total <strong>{students.length}</strong> siswa
          </span>
          <button
            type="button"
            className="btn-link"
            onClick={handleResetFilters}
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* Student Table */}
      <StudentTable
        students={filteredStudents}
        allStudentsCount={students.length}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onViewDetail={handleOpenDetail}
        onAddNew={onNavigateToAdd}
      />

      {/* Edit Student Modal */}
      <StudentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStudentForEdit(null);
        }}
        student={selectedStudentForEdit}
        isEditMode={true}
        existingStudents={students}
        onSubmit={(updatedData) => {
          onUpdateStudent(selectedStudentForEdit.id, updatedData);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        student={selectedStudentForDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedStudentForDelete(null);
        }}
        onConfirm={(id) => {
          onDeleteStudent(id);
        }}
      />

      {/* Student Detail Modal */}
      <StudentDetailModal
        isOpen={isDetailModalOpen}
        student={selectedStudentForDetail}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedStudentForDetail(null);
        }}
        onEdit={(student) => {
          handleOpenEdit(student);
        }}
      />
    </div>
  );
}
