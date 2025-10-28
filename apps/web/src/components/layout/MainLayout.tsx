import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * MainLayout - Simplified version (no navbar)
 * Navigation is handled by vanilla JS in index.html
 */
const MainLayout: React.FC = () => {
  return (
    <div className="app-layout">
      {/* Main Content Area - No sidebar, using vanilla JS navbar from index.html */}
      <main className="main-content-wrapper">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

