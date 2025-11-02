import React from 'react';
import { Link } from 'react-router-dom';

function AppHeader({ titleRight }) {
  return (
    <div className="app-header">
      <div style={{ fontWeight: 800 }}>
        <Link to="/">Home</Link> &nbsp;/&nbsp; <Link to="/chat">Chat</Link>
      </div>
      <div style={{ opacity: 0.8 }}>{titleRight || '💗'}</div>
    </div>
  );
}

export default AppHeader;