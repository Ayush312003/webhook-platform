import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export default function DeliveryLogs() {
    const [logs, setLogs] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchLogs = async () => {
        try {
            const url = statusFilter ? `${API_BASE}/deliveries?status=${statusFilter}` : `${API_BASE}/deliveries`;
            const res = await axios.get(url);
            setLogs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchLogs();
        const intervalId = setInterval(fetchLogs, 3000);
        return () => clearInterval(intervalId);
    }, [statusFilter]);

    const getBadgeClass = (status) => {
        if (status === 'SUCCESS') return 'badge-success';
        if (status === 'FAILED') return 'badge-failed';
        return 'badge-pending';
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0 }}>Delivery Logs</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>Filter:</span>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: '150px' }}>
                        <option value="">All Statuses</option>
                        <option value="PENDING">PENDING</option>
                        <option value="SUCCESS">SUCCESS</option>
                        <option value="FAILED">FAILED</option>
                    </select>
                    <button onClick={fetchLogs} className="btn-secondary">Refresh</button>
                </div>
            </div>

            <table className="startup-table">
                <thead>
                    <tr>
                        <th>Webhook URL</th>
                        <th>Event ID</th>
                        <th>Status</th>
                        <th>Retries</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log._id || Math.random()}>
                            <td style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{log.webhookId?.url || log.webhookId}</td>
                            <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', fontSize: '0.85em' }}>{log.eventId}</td>
                            <td>
                                <span className={`badge ${getBadgeClass(log.status)}`}>
                                    {log.status}
                                </span>
                            </td>
                            <td><span style={{ color: 'var(--text-secondary)' }}>{log.retryCount}</span></td>
                        </tr>
                    ))}
                    {logs.length === 0 && (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                                No logs found. Try triggering an event.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
