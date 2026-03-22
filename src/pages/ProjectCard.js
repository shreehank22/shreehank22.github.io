import React from "react";

export default function ProjectCard({ title, date, desc, tags }) {
  return (
    <div className="border border-gray-200 rounded p-5 bg-white">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
        <span className="font-semibold text-gray-800">{title}</span>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <p className="text-gray-700 text-sm mb-2">{desc}</p>
      <div className="flex flex-wrap gap-2 text-xs">
        {tags.map((tag, i) => (
          <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{tag}</span>
        ))}
      </div>
    </div>
  );
}
