import React from 'react';

function CategoryPills({ categories, activeId, onChange }) {
  return (
    <div className="category-row">
      {categories.map(cat => (
        <button
          key={cat.id}
          className={"category-pill" + (activeId === cat.id ? " active" : "")}
          onClick={() => onChange(cat.id)}
          aria-pressed={activeId === cat.id}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

export default CategoryPills;