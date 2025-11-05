// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import AlertLogs from './AlertLogs';
// 1. IMPORT THE NEW SETTINGS PAGE
import Settings from './Settings'; 
import './App.css';

// --- 2. ICONS (Full code, no placeholders) ---
const ICONS = {
  dashboard: <path d="M9 17.25v-3.75a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3.75m-4.5 0a.75.75 0 00.75.75h3a.75.75 0 00.75-.75M9 17.25v-3.75a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v3.75m4.5 0a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75m4.5 0v-3.75a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3.75m-4.5 0a.75.75 0 00.75.75h3a.75.75 0 00.75-.75M9 17.25v-3.75a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v3.75m4.5 0a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75m9.75-3.75a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3.75m-4.5 0a.75.75 0 00.75.75h3a.75.75 0 00.75-.75M18.75 17.25v-3.75a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v3.75m4.5 0a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75" />,
  logs: <path d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6" />,
  settings: <path d="M9.594 3.94c.09-.542.56-1.008 1.11-1.212l.938-.347c.552-.205 1.198.077 1.4.63l.206.551c.204.552-.078 1.198-.63 1.4l-.938.347c-.542.09-1.008.56-1.212 1.11l-.347.938c-.205.552-.848.834-1.4.63l-.551-.206c-.552-.204-.834-.848-.63-1.4l.347-.938zm-1.873 2.925a.75.75 0 00-1.06 1.06l.346.346c.204.204.51.312.822.312s.618-.108.822-.312l.346-.346a.75.75 0 00-1.06-1.06l-.347.347c-.09.09-.262.09-.352 0l-.347-.347zm6.05-1.873a.75.75 0 10-1.06-1.06l-.347.347c-.09.09-.262.09-.352 0l-.347-.347a.75.75 0 00-1.06 1.06l.346.346c.204.204.51.312.822.312s.618-.108.822-.312l.346-.346zM12 6.75a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z" />,
  logo: <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />,
  users: <path fillRule="evenodd" d="M8 9a3 3 0 100-6 3 3 0 000 6zM.25 11.25a.75.75 0 01.75-.75h14.5a.75.75 0 01.75.75v2.5a.75.75 0 01-.75.75h-14.5a.75.75 0 01-.75-.75v-2.5z" clipRule="evenodd" />,
  desktop: <path fillRule="evenodd" d="M2.5 3A1.5 1.5 0 001 4.5v6A1.5 1.5 0 002.5 12h11A1.5 1.5 0 0015 10.5v-6A1.5 1.5 0 0013.5 3h-11zM2 4.5a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v6a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-6zM5.5 13a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM10.5 13a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM3 14.5a.5.5 0 000 1h10a.5.5 0 000-1H3z" clipRule="evenodd" />,
  bell: <path d="M11.25 4.5a.75.75 0 01.75.75v.006c-.007 3.51 1.542 6.58 4.14 8.598.66.51 1.05 1.28.9 2.147A4.405 4.405 0 0113.8 19.5H8.2a4.405 4.405 0 01-3.19-3.5c-.15-1.043.24-1.81.9-2.32C8.51 11.836 10.05 8.766 10.05 5.256V5.25a.75.75 0 01.75-.75zM10.5 21a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />,
  bellSlash: <path d="M10.05 5.25a.75.75 0 00-1.5 0v.006c.007 3.51-1.542 6.58-4.14 8.598-.66.51-1.05 1.28-.9 2.147.284 1.903 1.83 3.32 3.69 3.496H5.25c-.414 0-.75.336-.75.75s.336.75.75.75h9c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-.3a4.405 4.405 0 00-3.19-3.5c-.15-1.043.24-1.81.9-2.32 2.6-2.018 4.147-5.088 4.14-8.598V5.25a.75.75 0 00-1.5 0v.006c0 3.033-1.28 5.67-3.375 7.488S9 15.366 9 12.75V5.25a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V6c0 .354.02.705.06 1.053m.66 1.112A11.205 11.205 0 018.25 15H8.2a4.405 4.405 0 01-3.19-3.5c-.15-1.043.24-1.81.9-2.32C8.51 7.404 10.05 4.333 10.05 1.05V1.05a.75.75 0 01.75-.75h.03a.75.75 0 01.75.75v3.454l-1.48 1.48zM10.5 21a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />,
};
const Icon = ({ path, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    className={`icon ${className}`}
  >
    {path}
  </svg>
);
// --- END ICONS ---


function App() {
  const [theme, setTheme] = useState('light');
  const [occupancy, setOccupancy] = useState("Connecting...");
  const [deviceStatus, setDeviceStatus] = useState("Connecting...");
  const [alert, setAlert] = useState("Connecting to server...");
  const [isMuted, setIsMuted] = useState(false);
  const alarmSound = useRef(new Audio('/alarm.mp3'));
  const apiUrl = "http://127.0.0.1:8000/api/status/";

  const toggleTheme = () => {
    setTheme(currTheme => (currTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);


  useEffect(() => {
    const fetchStatus = () => {
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          setOccupancy(data.occupancy);
          setDeviceStatus(data.device_status);
          setAlert(data.alert);
        })
        .catch(error => {
          console.error("Error fetching data:", error)
          // Set an alert if Django is offline
          setOccupancy("Error");
          setDeviceStatus("N/A");
          setAlert("ALERT: Django Server Offline!");
        });
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000); 
    return () => clearInterval(interval);
  }, [apiUrl]);

  useEffect(() => {
    if (alert.toLowerCase().includes("alert") && !isMuted) {
      alarmSound.current.play().catch(e => console.log("Audio play failed."));
    } else {
      alarmSound.current.pause();
      alarmSound.current.currentTime = 0;
    }
  }, [alert, isMuted]);

  const toggleMute = () => {
    setIsMuted(currentValue => !currentValue);
  };

  return (
    <BrowserRouter>
      <div className={`App ${theme}`}>
        
        <nav className="sidebar">
          <div className="sidebar-header"><Icon path={ICONS.logo} className="icon-logo" /><span className="logo-text">ClassSense</span></div>
          <ul className="nav-menu">
            <li className="nav-item"><NavLink to="/"><Icon path={ICONS.dashboard} /><span>Live Dashboard</span></NavLink></li>
            <li className="nav-item"><NavLink to="/logs"><Icon path={ICONS.logs} /><span>Alert Logs</span></NavLink></li>
            <li className="nav-item"><NavLink to="/settings"><Icon path={ICONS.settings} /><span>Settings</span></NavLink></li>
          </ul>
          <div className="sidebar-footer"><p>© Team Stardust 2025</p></div>
        </nav>

        <main className="main-content">
          <header className="main-header">
            <h1>Live Classroom Monitor</h1>
            <button onClick={toggleMute} className="mute-button">
              {isMuted ? ( <> <Icon path={ICONS.bellSlash} /> Muted </> ) : ( <> <Icon path={ICONS.bell} /> Mute </> )}
            </button>
          </header>

          <Routes>
            <Route 
              path="/" 
              element={<Dashboard 
                occupancy={occupancy}
                deviceStatus={deviceStatus}
                alert={alert}
              />} 
            />
            <Route path="/logs" element={<AlertLogs />} />
            
            <Route 
              path="/settings" 
              element={<Settings theme={theme} toggleTheme={toggleTheme} />} 
            />
          </Routes>
          
        </main> 
      </div>
    </BrowserRouter>
  );
}


// --- Dashboard COMPONENT ---
function Dashboard({ occupancy, deviceStatus, alert }) {
  const [isStreamPlaying, setIsStreamPlaying] = useState(true);
  const streamUrl = "http://127.0.0.1:5000/video_feed";
  const alertClassName = alert.toLowerCase().includes("alert") ? "alert-box-danger" : "alert-box-safe";
  const toggleStream = () => { setIsStreamPlaying(prevState => !prevState); };

  return (
    <div className="dashboard-grid">
      <section className="widget stream-widget">
        <div className="widget-header">
          <h3>Classroom Feed (CO-301)</h3>
          <div className="stream-controls">
            <span className={`live-dot ${!isStreamPlaying ? 'paused' : ''}`}></span>
            <button onClick={toggleStream} className={`stream-button ${isStreamPlaying ? 'stop' : 'play'}`}>
              {isStreamPlaying ? "Stop" : "Play"}
            </button>
          </div>
        </div>
        <div className="stream-container">
          <img 
            src={isStreamPlaying ? streamUrl : ""} 
            alt="Live Classroom Stream"
            onError={(e) => { 
              if (isStreamPlaying) { e.target.alt = "Stream failed. Is app.py running?"; } 
              else { e.target.alt = "Stream is paused."; }
            }}
          />
        </div>
      </section>
      <section className="widget status-widget">
        <div className="widget-header"><h3>Real-time Status</h3></div>
        <div className="status-panel">
          <div className="status-item">
            <div className="status-item-icon" style={{backgroundColor: '#e0f2fe'}}><Icon path={ICONS.users} className="icon-users" /></div>
            <div className="status-item-text"><span className="status-key">Occupancy</span><span className="status-value">{occupancy}</span></div>
          </div>
          <div className="status-item">
            <div className="status-item-icon" style={{backgroundColor: '#e0fbec'}}><Icon path={ICONS.desktop} className="icon-desktop" /></div>
            <div className="status-item-text"><span className="status-key">Device Status</span><span className="status-value">{deviceStatus}</span></div>
          </div>
          <div className={`alert-box ${alertClassName}`}>{alert}</div>
        </div>
      </section>
    </div>
  );
}

export default App;