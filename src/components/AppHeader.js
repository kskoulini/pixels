import React from 'react';
import { useItems } from 'context/ItemsContext';

function AppHeader({ children }) {
  const { data, refreshAll } = useItems(); // data.categories, data.items

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