import React, { useState, useEffect } from 'react';
import { fetchExceptions } from '../services/api';

const ExceptionTable = () => {
    const [exceptions, setExceptions] = useState([]);

    useEffect(() => {
        fetchExceptions().then(setExceptions).catch(console.error);
        const interval = setInterval(() => {
            fetchExceptions().then(setExceptions).catch(console.error);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="card glass-panel exception-card">
            <div className="card-header">
                <h3><i className="ri-error-warning-fill text-danger"></i> Action Required: Exceptions</h3>
                <button className="btn btn-text">View All</button>
            </div>
            <div className="table-container">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Error Type</th>
                            <th>Related SKU</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exceptions.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>No open exceptions</td>
                            </tr>
                        ) : (
                            exceptions.map(ex => (
                                <tr key={ex.id}>
                                    <td><span className={`tag ${ex.error_type.includes('MISSING') ? 'warning' : 'danger'}`}>{ex.error_type}</span></td>
                                    <td className="font-mono">{ex.related_sku || 'N/A'}</td>
                                    <td>{ex.description}</td>
                                    <td><span className="status-dot red"></span> {ex.status}</td>
                                    <td><button className="btn btn-sm btn-outline">Resolve</button></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExceptionTable;
