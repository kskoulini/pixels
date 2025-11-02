import React from 'react';

function RetroWindow({ title, children }) {
  return (
    <div className="pixel-app-shell">
      <div className="pixel-window">
        {/* 👇 drag region + no-drag controls */}
        <div className="pixel-titlebar app-drag-region">
          <div className="pixel-title"> {title || 'Pixels'} </div>

          {/* Controls must be "no-drag" so they're clickable */}
          <div className="window-controls app-no-drag">
            <button className="ctrl-btn minimize" onClick={() => window.pixels?.minimize?.()}>—</button>
            <button className="ctrl-btn danger" onClick={() => window.pixels?.close?.()}>✕</button>
          </div>
        </div>

        <div className="pixel-content">{children}</div>
      </div>
    </div>
  );
}

export default RetroWindow;