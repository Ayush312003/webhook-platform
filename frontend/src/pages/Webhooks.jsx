import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export default function Webhooks() {
    const [webhooks, setWebhooks] = useState([]);
    const [userId, setUserId] = useState('user-1');
    const [url, setUrl] = useState('');

    const fetchWebhooks = async () => {
        try {
            const res = await axios.get(`${API_BASE}/webhooks`);
            setWebhooks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchWebhooks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/webhooks`, { userId, url });
            setUrl('');
            fetchWebhooks();
        } catch (err) {
            alert('Failed to add webhook: ' + err.message);
        }
    };

    return (
        <div className="card">
            <h2>Webhook Endpoints</h2>
            
            <form onSubmit={handleSubmit} className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
                <input 
                    type="text" 
                    placeholder="User ID" 
                    value={userId} 
                    onChange={e => setUserId(e.target.value)} 
                    required 
                    style={{ flex: 1 }}
                />
                <input 
                    type="url" 
                    placeholder="Webhook URL (https://...)" 
                    value={url} 
                    onChange={e => setUrl(e.target.value)} 
                    required 
                    style={{ flex: 3 }}
                />
                <button type="submit" className="btn-primary">Register Endpoint</button>
            </form>

            <div style={{ marginTop: '30px' }}>
                {webhooks.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No webhooks registered.</p>
                ) : (
                    <table className="startup-table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Webhook URL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {webhooks.map(wh => (
                                <tr key={wh._id}>
                                    <td><strong style={{ color: 'var(--text-primary)' }}>{wh.userId}</strong></td>
                                    <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{wh.url}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
