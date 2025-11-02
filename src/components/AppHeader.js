import React from 'react';
import { Link } from 'react-router-dom';

function AppHeader({ children }) {
  return (
    <div className="app-header">
        {children}
    </div>
  );
}

export default AppHeader;