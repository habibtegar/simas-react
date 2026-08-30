import React from "react";

export default function StatisticCard({
  title,
  value,
  icon,
  badgeText,
  badgeType = "info",
  colorVariant = "blue",
  subtext,
  onClick
}) {
  return (
    <div 
      className={`stat-card stat-card-${colorVariant} ${onClick ? "clickable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="stat-card-header">
        <div className="stat-icon-wrapper">
          {icon}
        </div>
        {badgeText && (
          <span className={`stat-badge stat-badge-${badgeType}`}>
            {badgeText}
          </span>
        )}
      </div>

      <div className="stat-card-body">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>

      {subtext && (
        <div className="stat-card-footer">
          <span className="stat-subtext">{subtext}</span>
        </div>
      )}
    </div>
  );
}
