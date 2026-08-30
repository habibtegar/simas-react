import React from "react";
import { IconFilter, IconRefresh } from "./Icons";
import { JURUSAN_OPTIONS, KELAS_OPTIONS } from "../data/initialStudents";

export default function FilterBar({
  filterGender,
  setFilterGender,
  filterKelas,
  setFilterKelas,
  filterJurusan,
  setFilterJurusan,
  onResetFilters
}) {
  const isFiltered = filterGender !== "" || filterKelas !== "" || filterJurusan !== "";

  return (
    <div className="filter-bar">
      <div className="filter-label-group">
        <IconFilter size={16} className="text-muted" />
        <span className="filter-title">Filter Data:</span>
      </div>

      <div className="filter-controls">
        {/* Filter Gender */}
        <div className="filter-select-wrapper">
          <select
            className="filter-select"
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
          >
            <option value="">Semua Gender</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        {/* Filter Kelas */}
        <div className="filter-select-wrapper">
          <select
            className="filter-select"
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
          >
            <option value="">Semua Kelas</option>
            {KELAS_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Jurusan */}
        <div className="filter-select-wrapper">
          <select
            className="filter-select"
            value={filterJurusan}
            onChange={(e) => setFilterJurusan(e.target.value)}
          >
            <option value="">Semua Jurusan</option>
            {JURUSAN_OPTIONS.map((j) => (
              <option key={j.id} value={j.id}>
                {j.id} - {j.name.split(" ")[0]}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm filter-reset-btn"
            onClick={onResetFilters}
          >
            <IconRefresh size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
