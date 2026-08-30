import React from "react";
import { IconSearch, IconClose } from "./Icons";

export default function SearchBar({ searchQuery, setSearchQuery, placeholder = "Cari berdasarkan Nama, NIS, atau Kelas..." }) {
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <span className="search-icon">
          <IconSearch size={18} />
        </span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => setSearchQuery("")}
            title="Bersihkan pencarian"
            aria-label="Bersihkan pencarian"
          >
            <IconClose size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
