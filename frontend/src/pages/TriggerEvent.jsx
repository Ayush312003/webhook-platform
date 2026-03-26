import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export default function TriggerEvent() {
    const [type, setType] = useState('user.created');
    const [payload, setPayload] = useState('{\n  "userId": "123",\n  "name": "Jane"\n}');
    const [webhooks, setWebhooks] = useState([]);
    const [selectedWebhooks, setSelectedWebhooks] = useState(new Set());

    useEffect(() => {
        const fetchWebhooks = async () => {
            try {
                const res = await axios.get(`${API_BASE}/webhooks`);
                setWebhooks(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchWebhooks();
    }, []);

    const toggleWebhook = (id) => {
        const newSet = new Set(selectedWebhooks);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedWebhooks(newSet);
    };

    const handleTrigger = async () => {
        try {
            let parsedPayload;
            try {
                parsedPayload = JSON.parse(payload);
            } catch (e) {
                alert('Invalid JSON payload');
                return;
            }

            const data = {
                type,
                payload: parsedPayload
            };

            if (selectedWebhooks.size > 0) {
                data.webhookIds = Array.from(selectedWebhooks);
            }

            const res = await axios.post(`${API_BASE}/events`, data);
            alert(`Event broadcasted! ${res.data.deliveryAttemptsCreated} deliveries queued.`);
        } catch (err) {
            alert('Error triggering event: ' + err.message);
        }
    };

    return (
        <div className="card">
            <h2>Emit Platform Event</h2>
            
            <div className="form-group" style={{ maxWidth: '600px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>Event Type</label>
                    <input 
                        type="text" 
                        value={type} 
                        onChange={e => setType(e.target.value)} 
                        placeholder="e.g. user.created" 
                    />
                </div>
                
                <div style={{ margin: '15px 0' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                        <span>Target endpoints</span>
                        <span style={{ fontSize: '0.85em' }}>Optional. Leave empty for broadcast.</span>
                    </label>
                    
                    {webhooks.length === 0 ? (
                         <div style={{ padding: '15px', background: 'var(--bg-color)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.9em' }}>
                             No webhooks available. Events will just be logged.
                         </div>
                    ) : (
                        <div className="webhook-list">
                            {webhooks.map(wh => (
                                <label key={wh._id} className="webhook-item">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedWebhooks.has(wh._id)} 
                                        onChange={() => toggleWebhook(wh._id)} 
                                    />
                                    <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{wh.url}</span>
                                    <span style={{ marginLeft: '10px', fontSize: '0.85em', color: 'var(--text-secondary)' }}>({wh.userId})</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>Event Payload (JSON)</label>
                    <textarea 
                        rows={8}
                        value={payload} 
                        onChange={e => setPayload(e.target.value)} 
                        style={{ fontFamily: 'monospace', resize: 'vertical' }}
                    />
                </div>
                
                <button onClick={handleTrigger} className="btn-primary" style={{ marginTop: '10px', alignSelf: 'flex-start' }}>
                    Trigger Delivery Jobs
                </button>
            </div>
        </div>
    );
}
