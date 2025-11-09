import React from 'react';

/**
 * CategoryPills
 * @param {Array<{id:string,label:string}>} categories
 * @param {string} activeId
 * @param {(id:string)=>void} onChange
 * @param {Object<string, number>} [unreadMap] - map of categoryId -> unread count
 * @param {boolean} [showCounts=true] - show numeric badge instead of dot
 */
function CategoryPills({ categories, activeId, onChange, unreadMap = {}, showCounts = true }) {
  return (
    <div className="category-row">
      {categories.map(cat => {
        const unreadCount = Number(unreadMap[cat.id] || 0);
        const hasUnread = unreadCount > 0;

        const classes = [
          'category-pill',
          activeId === cat.id ? 'active' : '',
          hasUnread ? 'has-unread' : ''
        ].filter(Boolean).join(' ');

        const aria =
          hasUnread
            ? `${cat.label} (${unreadCount} new)`
            : cat.label;

        return (
          <button
            key={cat.id}
            className={classes}
            onClick={() => onChange(cat.id)}
            aria-pressed={activeId === cat.id}
            aria-label={aria}
          >
            <span className="pill-label">{cat.label}</span>
            {hasUnread && (
              showCounts ? (
                <span className="pill-badge" aria-hidden="true">{unreadCount}</span>
              ) : (
                <span className="pill-dot" aria-hidden="true" />
              )
            )}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryPills;