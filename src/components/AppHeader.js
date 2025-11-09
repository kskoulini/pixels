import React from 'react';
import { bootstrapCommentsFromStatic } from 'utils/storage';
import { CATEGORIES } from 'data';
import { useItems } from 'context/ItemsContext';

function AppHeader({ children }) {
  const { data, refreshAll } = useItems(); // data.categories, data.items

  const handleRefresh = () => {
    const idsForFiles = CATEGORIES.map(c => c.id).filter(id => id !== 'all');
    bootstrapCommentsFromStatic(idsForFiles, true)
  }

  return (
    <div className="app-header">
        <span>
          {children}
        </span>
        <button className="pixel-button pixel-button-ghost"
          onClick={refreshAll} style={{'padding':'1px 4px', 'fontSize': '11px'}}>
          Refresh ↻
        </button>
    </div>
  );
}

export default AppHeader;