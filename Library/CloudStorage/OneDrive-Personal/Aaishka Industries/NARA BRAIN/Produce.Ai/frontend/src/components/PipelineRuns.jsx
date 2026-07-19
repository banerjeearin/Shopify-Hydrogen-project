import React, { useState, useEffect } from 'react';
import { getActivities, deleteRunData } from '../services/api';

const PipelineRuns = () => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedRuns, setExpandedRuns] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchAllActivities = async () => {
            try {
                // Fetch up to 200 activities to ensure we get full runs
                const data = await getActivities(200);
                setActivities(data);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllActivities();
        const interval = setInterval(fetchAllActivities, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleDeleteRun = async (e, runId) => {
        e.stopPropagation(); // Prevent accordion from toggling
        if (!window.confirm(`Are you sure you want to delete all ingested data for run ${runId}?`)) {
            return;
        }
        setIsDeleting(true);
        try {
            await deleteRunData(runId);
            alert(`Run ${runId} deleted successfully.`);
            await fetchAllActivities(); // Refresh list
        } catch (err) {
            console.error(err);
            alert(`Failed to delete run: ${err.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const getTypeStyle = (type) => {
        if (type === 'SUCCESS') return 'badge success';
        if (type === 'ERROR') return 'badge danger';
        if (type === 'WARNING') return 'badge warning';
        return 'badge primary';
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const toggleRun = (runId) => {
        setExpandedRuns(prev => ({ ...prev, [runId]: !prev[runId] }));
    };

    // Group activities by run_id
    const groupedRuns = activities.reduce((acc, act) => {
        const rId = act.run_id || 'unassigned';
        if (!acc[rId]) acc[rId] = [];
        acc[rId].push(act);
        return acc;
    }, {});

    if (isLoading) {
        return (
            <div className="card glass-panel" style={{ padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
                <p>Loading Pipeline History...</p>
            </div>
        );
    }

    return (
        <div className="card glass-panel" style={{ marginTop: '2rem' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2><i className="ri-git-merge-line text-primary"></i> Agent-wise Pipeline Runs</h2>
                <span className="badge">{Object.keys(groupedRuns).length} Runs</span>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
                {Object.keys(groupedRuns).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No pipeline activity recorded yet. Run a pipeline from the dashboard!
                    </div>
                ) : (
                    Object.entries(groupedRuns).map(([runId, runActivities], idx) => {
                        const isExpanded = expandedRuns[runId];
                        const latestTime = runActivities.length > 0 ? formatDate(runActivities[0].created_at) : '';
                        
                        return (
                            <div key={runId} style={{ marginBottom: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                                <div 
                                    style={{ 
                                        padding: '1rem', 
                                        backgroundColor: 'var(--panel-bg)', 
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                    onClick={() => toggleRun(runId)}
                                >
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Run: {runId}</h3>
                                        <small style={{ color: 'var(--text-muted)' }}>Started at: {latestTime}</small>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <button 
                                            onClick={(e) => handleDeleteRun(e, runId)}
                                            style={{ background: 'var(--danger-color)', color: 'white', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                            disabled={isDeleting}
                                        >
                                            <i className="ri-delete-bin-line"></i> Delete Run Data
                                        </button>
                                        <i className={`ri-arrow-${isExpanded ? 'up' : 'down'}-s-line`} style={{ fontSize: '1.5rem' }}></i>
                                    </div>
                                </div>
                                
                                {isExpanded && (
                                    <div style={{ padding: '0 1rem', borderTop: '1px solid var(--border-color)' }}>
                                        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', marginBottom: '1rem' }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>Agent</th>
                                                    <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>Status</th>
                                                    <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>Event</th>
                                                    <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>Description</th>
                                                    <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {runActivities.map((act, idx2) => (
                                                    <tr key={idx2} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                        <td style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{act.agent_name || 'System'}</td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            <span className={getTypeStyle(act.type)}>{act.type}</span>
                                                        </td>
                                                        <td style={{ padding: '0.75rem', fontWeight: '500' }}>{act.title}</td>
                                                        <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{act.description}</td>
                                                        <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatDate(act.created_at)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default PipelineRuns;
