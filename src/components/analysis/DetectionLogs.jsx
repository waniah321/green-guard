// // src/components/analysis/DetectionLogs.jsx
// import React from 'react';
// import { ChevronRight } from 'lucide-react';

// export default function DetectionLogs({ logs }) {
//   return (
//     <div className="logs-section">
//       <div className="logs-header">
//         <h3 className="logs-title">Recent Detection Logs</h3>
//         <div className="logs-actions">
//           <button className="logs-action-btn">Export CSV</button>
//           <button className="logs-action-btn">Filter</button>
//         </div>
//       </div>

//       <div className="table-responsive">
//         <table className="logs-table">
//           <thead>
//             <tr>
//               <th style={{ paddingLeft: '0' }}>Region ID</th>
//               <th>Change Type</th>
//               <th>Area Affected</th>
//               <th>Forested</th>
//               <th>Deforested</th>
//               <th>No-Forest</th>
//               <th>Confidence</th>
//               <th>Status</th>
//               <th style={{ textAlign: 'right', paddingRight: '0' }}>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {logs.map((log, index) => (
//               <tr key={index}>
//                 <td className="td-bold-dark" style={{ paddingLeft: '0' }}>{log.regionId}</td>
//                 <td>{log.changeType}</td>
//                 <td>{log.areaAffected} km²</td>
//                 <td>{log.forested} km²</td>
//                 <td>{log.deforested} km²</td>
//                 <td>{log.noForest} km²</td>
//                 <td>
//                   <div className="confidence-cell">
//                     <div className="progress-bar-track">
//                       <div className="progress-bar-fill" style={{ width: `${log.confidence}%` }}></div>
//                     </div>
//                     <span>{log.confidence}%</span>
//                   </div>
//                 </td>
//                 <td>
//                   <span className="status-badge-critical">{log.status}</span>
//                 </td>
//                 <td style={{ textAlign: 'right', paddingRight: '0' }}>
//                   <button className="action-arrow-btn" style={{ marginLeft: 'auto' }}>
//                     <ChevronRight className="w-4 h-4" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }




// src/components/analysis/DetectionLogs.jsx
import React from 'react';

// logs = [] as default value safe rakhta hai crash hone se
export default function DetectionLogs({ logs = [] }) {
  
  // Agar logs array bilkul empty ho to loading ya empty state show karein
  if (logs.length === 0) {
    return (
      <div className="logs-section table-container" style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
        No detection logs available at the moment.
      </div>
    );
  }

  return (
    <div className="logs-section">
      <div className="logs-header">
        <h3 className="logs-title">Recent Detection Logs</h3>
        <div className="logs-actions">
          <button className="logs-action-btn">Export CSV</button>
          <button className="logs-action-btn">Filter</button>
        </div>
      </div>

      {/* Glassmorphic Container applied here */}
      <div className="table-responsive table-container">
        <table className="logs-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '0' }}>Region ID</th>
              <th>Change Type</th>
              <th>Forested</th>
              <th>Deforested</th>
              <th>No-Forest</th>
              <th>Confidence</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={log.regionId || index}>
                <td className="td-bold-dark" style={{ paddingLeft: '0' }}>{log.regionId}</td>
                <td>{log.changeType}</td>
                <td>{log.forested} km²</td>
                <td>{log.deforested} km²</td>
                <td>{log.noForest} km²</td>
                <td>
                  <div className="confidence-cell">
                    <div className="progress-bar-track">
                      {/* Dynamic progress width */}
                      <div className="progress-bar-fill" style={{ width: `${log.confidence}%` }}></div>
                    </div>
                    <span>{log.confidence}%</span>
                  </div>
                </td>
                <td>
                  {/* Dynamic Status Badges Class based on alert severity */}
                  <span className={`status-badge ${
                    log.status?.toLowerCase() === 'critical' ? 'status-badge-critical' : 
                    log.status?.toLowerCase() === 'warning' ? 'status-badge-warning' : 
                    'status-badge-stable'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}