import React from "react";

export default function ExperienceItem({ org, date, role, loc, points }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
        <span className="font-semibold text-gray-800">{org}</span>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <div className="text-sm text-blue-700 font-medium">{role}</div>
      <div className="text-xs text-gray-500 mb-2">{loc}</div>
      <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
        {points.map((pt, i) => (
          <li key={i}>{pt}</li>
        ))}
      </ul>
    </div>
  );
}
