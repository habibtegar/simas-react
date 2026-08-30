import React, { useEffect } from "react";
import { IconCheck, IconAlertCircle, IconClose } from "./Icons";

export default function Toast({ message, type = "success", onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <IconCheck size={18} />;
      case "danger":
      case "error":
        return <IconAlertCircle size={18} />;
      case "warning":
        return <IconAlertCircle size={18} />;
      default:
        return <IconCheck size={18} />;
    }
  };

  return (
    <div className={`toast-notification toast-${type}`} role="alert">
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-content">
        <p className="toast-message">{message}</p>
      </div>
      <button
        type="button"
        className="toast-close-btn"
        onClick={onClose}
        aria-label="Tutup notifikasi"
      >
        <IconClose size={16} />
      </button>
    </div>
  );
}
