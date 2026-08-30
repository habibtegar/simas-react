import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/StudentsPage";
import AddStudentPage from "./pages/AddStudentPage";
import StudentModal from "./components/StudentModal";
import StudentDetailModal from "./components/StudentDetailModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import {
  loadStudents,
  saveStudents,
  resetStudentsToDefault,
  generateStudentId
} from "./utils/storage";
import "./App.css";

export default function App() {
  // Main State for Students
  const [students, setStudents] = useState(() => loadStudents());

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

  // Show Toast Helper
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Close Toast
  const handleCloseToast = () => {
    setToast({ message: "", type: "success" });
  };

  // ADD STUDENT
  const handleAddStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: generateStudentId(),
      status: "Aktif",
      createdAt: new Date().toISOString()
    };

    setStudents((prev) => [newStudent, ...prev]);
    showToast(`Siswa "${newStudent.nama}" berhasil ditambahkan!`, "success");
    setActiveTab("students");
  };

  // UPDATE / EDIT STUDENT
  const handleUpdateStudent = (studentId, updatedData) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { ...student, ...updatedData, updatedAt: new Date().toISOString() }
          : student
      )
    );
    showToast("Data siswa berhasil diperbarui!", "success");
  };

  // DELETE STUDENT
  const handleDeleteStudent = (studentId) => {
    const target = students.find((s) => s.id === studentId);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    showToast(`Data siswa "${target ? target.nama : ''}" berhasil dihapus!`, "danger");
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
