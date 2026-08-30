import { INITIAL_STUDENTS } from "../data/initialStudents";

const STORAGE_KEY = "simas_students_data_v2";

/**
 * Memuat data siswa dari LocalStorage, jika belum ada gunakan INITIAL_STUDENTS
 */
export function loadStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_STUDENTS;
  } catch (error) {
    console.error("Gagal membaca data dari LocalStorage:", error);
    return INITIAL_STUDENTS;
  }
}

/**
 * Menyimpan array data siswa ke LocalStorage
 */
export function saveStudents(students) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (error) {
    console.error("Gagal menyimpan data ke LocalStorage:", error);
  }
}

/**
 * Mereset data siswa kembali ke data awal dummy
 */
export function resetStudentsToDefault() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  } catch (error) {
    console.error("Gagal mereset data LocalStorage:", error);
    return INITIAL_STUDENTS;
  }
}

/**
 * Generate ID unik untuk data siswa baru
 */
export function generateStudentId() {
  return "std-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

/**
 * Helper format tanggal ke format Indonesia
 */
export function formatDateIndonesia(isoString) {
  if (!isoString) return "-";
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(date);
  } catch {
    return "-";
  }
}
