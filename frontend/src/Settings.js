// frontend/src/Settings.js

import React from 'react';
import './Settings.css'; // We will create this file next

// We will pass down the 'theme' and 'toggleTheme' function from App.js
function Settings({ theme, toggleTheme }) {
  return (
    <div className="settings-page">
      <h2>Settings</h2>

      <div className="settings-card">
        <h3>Display</h3>
        
        {/* --- Dark Mode Toggle --- */}
        <div className="setting-item">
          <div className="setting-text">
            <label htmlFor="theme-toggle">Dark Mode</label>
            <p>Switch between light and dark themes.</p>
          </div>
          <div className="setting-control">
            <label className="switch">
              <input 
                id="theme-toggle" 
                type="checkbox" 
                onChange={toggleTheme}
                // Check the box if the theme is 'dark'
                checked={theme === 'dark'}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

      </div>

      <div className="settings-card">
        <h3>Alerts (Coming Soon)</h3>
        
        <div className="setting-item disabled">
          <div className="setting-text">
            <label>Alert Threshold</label>
            <p>Set the number of 'orphaned' devices to trigger an alert.</p>
          </div>
          <div className="setting-control">
            <input type="number" value="5" disabled />
          </div>
        </div>

      </div>

    </div>
  );
}

export default Settings;