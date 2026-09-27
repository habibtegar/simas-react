import React from "react";

export default function StatisticCard({
  title,
  value,
  icon,
  badgeText,
  subtext,
  onClick
}) {
  return (
    <div 
      className={`stat-card ${onClick ? "clickable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="stat-card-header">
        <span className="stat-title">{title}</span>
        <div className="stat-icon-wrapper">
          {icon}
        </div>
      </div>

      <div className="stat-card-body">
        <div className="stat-value">{value}</div>
      </div>

      {(badgeText || subtext) && (
        <div className="stat-card-footer">
          {badgeText && <span className="stat-badge">{badgeText}</span>}
          {subtext && <span className="stat-subtext">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
