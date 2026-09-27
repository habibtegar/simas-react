import { INITIAL_STUDENTS } from "../data/initialStudents";
import { INITIAL_CLASSES } from "../data/initialClasses";

export const STORAGE_KEY = "simas_students_data_v2";
export const STORAGE_CLASSES_KEY = "simas_classes_data_v1";

// Backup/legacy keys to check if primary key doesn't have data
const FALLBACK_KEYS = [
  "simas_students_data_v2",
  "simas_students_data",
  "simas_students",
  "students"
];

/**
 * Memuat data siswa dari LocalStorage.
 * Jika belum ada data, inisialisasi dengan INITIAL_STUDENTS dan simpan ke LocalStorage.
 */
export function loadStudents() {
  try {
    // 1. Coba baca dari primary key atau fallback keys
    for (const key of FALLBACK_KEYS) {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Pastikan data tersimpan di primary key
          if (key !== STORAGE_KEY) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          }
          return parsed;
        }
      }
    }

    // 2. Jika tidak ada di storage manapun, inisialisasi dengan INITIAL_STUDENTS
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  } catch (error) {
    console.error("Gagal membaca data dari LocalStorage:", error);
    return INITIAL_STUDENTS;
  }
}

/**
 * Menyimpan seluruh array data siswa ke LocalStorage secara aman
 */
export function saveStudents(students) {
  try {
    if (Array.isArray(students)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    }
  } catch (error) {
    console.error("Gagal menyimpan data ke LocalStorage:", error);
  }
}

/**
 * Memuat data kelas dari LocalStorage.
 * Jika belum ada, inisialisasi dengan INITIAL_CLASSES.
 */
export function loadClasses() {
  try {
    const saved = localStorage.getItem(STORAGE_CLASSES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    localStorage.setItem(STORAGE_CLASSES_KEY, JSON.stringify(INITIAL_CLASSES));
    return INITIAL_CLASSES;
  } catch (error) {
    console.error("Gagal membaca data kelas dari LocalStorage:", error);
    return INITIAL_CLASSES;
  }
}

/**
 * Menyimpan data kelas ke LocalStorage
 */
export function saveClasses(classes) {
  try {
    if (Array.isArray(classes)) {
      localStorage.setItem(STORAGE_CLASSES_KEY, JSON.stringify(classes));
    }
  } catch (error) {
    console.error("Gagal menyimpan data kelas ke LocalStorage:", error);
  }
}

/**
 * Generate ID unik untuk kelas baru
 */
export function generateClassId() {
  return "cls-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
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

const ATTENDANCE_STORAGE_KEY = "simas_attendance_data_v1";

/**
 * Memuat seluruh database absensi dari LocalStorage
 * Format: { "YYYY-MM-DD": { [studentId]: { status: "Hadir"|"Sakit"|"Izin"|"Alpa", note: string } } }
 */
export function loadAttendance() {
  try {
    const saved = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (!saved) return {};
    const parsed = JSON.parse(saved);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch (error) {
    console.error("Gagal membaca data absensi dari LocalStorage:", error);
    return {};
  }
}

/**
 * Menyimpan database absensi ke LocalStorage
 */
export function saveAttendance(attendanceData) {
  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(attendanceData));
  } catch (error) {
    console.error("Gagal menyimpan data absensi ke LocalStorage:", error);
  }
}

