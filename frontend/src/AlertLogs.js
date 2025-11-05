// frontend/src/AlertLogs.js

import React, { useState, useEffect } from 'react';
import './AlertLogs.css'; // We will create this CSS file next

function AlertLogs() {
  const [logs, setLogs] = useState([]); // To store the list of logs
  const [loading, setLoading] = useState(true); // To show a loading message
  const [error, setError] = useState(null); // To show any errors

  const logsApiUrl = "http://127.0.0.1:8000/api/logs/";

  useEffect(() => {
    // Fetch logs from our new Django API
    fetch(logsApiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setLogs(data); // Save the logs in state
        setLoading(false); // Done loading
      })
      .catch(error => {
        console.error("Error fetching logs:", error);
        setError("Failed to load logs. Is the Django server running?");
        setLoading(false); // Done loading, even on error
      });
  }, []); // The empty [] means this runs only once when the page loads

  if (loading) {
    return <div className="log-container"><h2>Loading logs...</h2></div>;
  }

  if (error) {
    return <div className="log-container"><h2>{error}</h2></div>;
  }

  return (
    <div className="log-container">
      <h2>Historical Alert Logs</h2>

      <table className="log-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Room ID</th>
            <th>Event Type</th>
          </tr>
        </thead>
        <tbody>
          {/* If no logs, show a helpful message */}
          {logs.length === 0 ? (
            <tr>
              <td colSpan="3">No alerts have been logged yet.</td>
            </tr>
          ) : (
            /* Map over the logs and create a table row for each one */
            logs.map(log => (
              <tr key={log.id}>
                <td>{log.timestamp}</td>
                <td>{log.room_id}</td>
                <td className="event-cell">{log.event_type}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AlertLogs;