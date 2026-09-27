import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/StudentsPage";
import ClassesPage from "./pages/ClassesPage";
import AddStudentPage from "./pages/AddStudentPage";
import AttendancePage from "./pages/AttendancePage";
import StudentModal from "./components/StudentModal";
import StudentDetailModal from "./components/StudentDetailModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import {
  loadStudents,
  saveStudents,
  loadClasses,
  saveClasses,
  generateClassId,
  resetStudentsToDefault,
  generateStudentId
} from "./utils/storage";
import "./App.css";

export default function App() {
  // Main State for Students
  const [students, setStudents] = useState(() => loadStudents());

  // Main State for Classes
  const [classes, setClasses] = useState(() => loadClasses());

  // Navigation State ('dashboard' | 'students' | 'add-student')
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mobile Sidebar Drawer State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState({ message: "", type: "success" });

  // Modal States accessible from Dashboard
  const [dashboardEditStudent, setDashboardEditStudent] = useState(null);
  const [isDashboardEditOpen, setIsDashboardEditOpen] = useState(false);

  const [dashboardDetailStudent, setDashboardDetailStudent] = useState(null);
  const [isDashboardDetailOpen, setIsDashboardDetailOpen] = useState(false);

  const [dashboardDeleteStudent, setDashboardDeleteStudent] = useState(null);
  const [isDashboardDeleteOpen, setIsDashboardDeleteOpen] = useState(false);

  // Sync to localStorage whenever students state changes
  useEffect(() => {
    saveStudents(students);
  }, [students]);

  // Sync to localStorage whenever classes state changes
  useEffect(() => {
    saveClasses(classes);
  }, [classes]);

  // Show Toast Helper
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Close Toast
  const handleCloseToast = () => {
    setToast({ message: "", type: "success" });
  };

  // ADD STUDENT - Tersimpan langsung ke localStorage & state
  const handleAddStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: generateStudentId(),
      status: studentData.status || "Aktif",
      createdAt: new Date().toISOString()
    };

    setStudents((prev) => {
      const updated = [newStudent, ...prev];
      saveStudents(updated);
      return updated;
    });

    showToast(`Siswa "${newStudent.nama}" berhasil ditambahkan!`, "success");
    setActiveTab("students");
  };

  // UPDATE / EDIT STUDENT - Tersimpan langsung ke localStorage & state
  const handleUpdateStudent = (studentId, updatedData) => {
    setStudents((prev) => {
      const updated = prev.map((student) =>
        student.id === studentId
          ? { ...student, ...updatedData, updatedAt: new Date().toISOString() }
          : student
      );
      saveStudents(updated);
      return updated;
    });

    showToast("Data siswa berhasil diperbarui!", "success");
  };

  // DELETE STUDENT - Terhapus langsung dari localStorage & state
  const handleDeleteStudent = (studentId) => {
    const target = students.find((s) => s.id === studentId);
    setStudents((prev) => {
      const updated = prev.filter((s) => s.id !== studentId);
      saveStudents(updated);
      return updated;
    });

    showToast(`Data siswa "${target ? target.nama : ''}" berhasil dihapus!`, "danger");
  };

  // ADD CLASS - Tersimpan langsung ke localStorage & state
  const handleAddClass = (classData) => {
    const newClass = {
      ...classData,
      id: generateClassId()
    };

    setClasses((prev) => {
      const updated = [newClass, ...prev];
      saveClasses(updated);
      return updated;
    });

    showToast(`Kelas "${newClass.nama}" berhasil ditambahkan!`, "success");
  };

  // UPDATE CLASS - Tersimpan langsung ke localStorage & state
  const handleUpdateClass = (classId, updatedData) => {
    setClasses((prev) => {
      const updated = prev.map((c) =>
        c.id === classId ? { ...c, ...updatedData } : c
      );
      saveClasses(updated);
      return updated;
    });

    showToast("Data kelas berhasil diperbarui!", "success");
  };

  // DELETE CLASS - Terhapus langsung dari localStorage & state
  const handleDeleteClass = (classId) => {
    const target = classes.find((c) => c.id === classId);
    setClasses((prev) => {
      const updated = prev.filter((c) => c.id !== classId);
      saveClasses(updated);
      return updated;
    });

    showToast(`Kelas "${target ? target.nama : ''}" berhasil dihapus!`, "danger");
  };

  return (
    <div className="app-layout">
      {/* Toast Notification Container */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={handleCloseToast}
      />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalStudents={students.length}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="app-main-wrapper">
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onNavigateToAdd={() => setActiveTab("add-student")}
        />

        {/* Dynamic Page Content */}
        <main className="app-content">
          {activeTab === "dashboard" && (
            <Dashboard
              students={students}
              onNavigateToStudents={() => setActiveTab("students")}
              onNavigateToAdd={() => setActiveTab("add-student")}
              onNavigateToAttendance={() => setActiveTab("attendance")}
              onViewStudentDetail={(student) => {
                setDashboardDetailStudent(student);
                setIsDashboardDetailOpen(true);
              }}
              onEditStudent={(student) => {
                setDashboardEditStudent(student);
                setIsDashboardEditOpen(true);
              }}
              onDeleteStudent={(student) => {
                setDashboardDeleteStudent(student);
                setIsDashboardDeleteOpen(true);
              }}
            />
          )}

          {activeTab === "students" && (
            <StudentsPage
              students={students}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onNavigateToAdd={() => setActiveTab("add-student")}
            />
          )}

          {activeTab === "classes" && (
            <ClassesPage
              classes={classes}
              students={students}
              onAddClass={handleAddClass}
              onUpdateClass={handleUpdateClass}
              onDeleteClass={handleDeleteClass}
              onNavigateToAttendance={(className) => {
                setActiveTab("attendance");
              }}
            />
          )}

          {activeTab === "attendance" && (
            <AttendancePage
              students={students}
              classes={classes}
              showToast={showToast}
            />
          )}

          {activeTab === "add-student" && (
            <AddStudentPage
              existingStudents={students}
              onAddStudent={handleAddStudent}
              onCancel={() => setActiveTab("students")}
            />
          )}
        </main>
      </div>

      {/* Dashboard Quick Modals */}
      {isDashboardEditOpen && dashboardEditStudent && (
        <StudentModal
          isOpen={isDashboardEditOpen}
          onClose={() => {
            setIsDashboardEditOpen(false);
            setDashboardEditStudent(null);
          }}
          student={dashboardEditStudent}
          isEditMode={true}
          existingStudents={students}
          onSubmit={(updatedData) => {
            handleUpdateStudent(dashboardEditStudent.id, updatedData);
          }}
        />
      )}

      {isDashboardDetailOpen && dashboardDetailStudent && (
        <StudentDetailModal
          isOpen={isDashboardDetailOpen}
          student={dashboardDetailStudent}
          onClose={() => {
            setIsDashboardDetailOpen(false);
            setDashboardDetailStudent(null);
          }}
          onEdit={(student) => {
            setIsDashboardDetailOpen(false);
            setDashboardEditStudent(student);
            setIsDashboardEditOpen(true);
          }}
        />
      )}

      {isDashboardDeleteOpen && dashboardDeleteStudent && (
        <DeleteConfirmModal
          isOpen={isDashboardDeleteOpen}
          student={dashboardDeleteStudent}
          onClose={() => {
            setIsDashboardDeleteOpen(false);
            setDashboardDeleteStudent(null);
          }}
          onConfirm={(id) => {
            handleDeleteStudent(id);
          }}
        />
      )}
    </div>
  );
}
