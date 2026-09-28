import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DepartmentGrid from './components/DepartmentGrid';
import LiveActivityFeed from './components/LiveActivityFeed';
import ApprovalDrawer from './components/ApprovalDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState('office');
  const [snapshot, setSnapshot] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Fetch initial digital office snapshot
  const fetchSnapshot = async () => {
    try {
      const res = await fetch('/api/v1/office/snapshot');
      if (res.ok) {
        const data = await res.json();
        setSnapshot(data);
      }
    } catch (err) {
      console.error('Failed to fetch office snapshot:', err);
    }
  };

  useEffect(() => {
    fetchSnapshot();
    const interval = setInterval(fetchSnapshot, 10000);

    // Subscribe to SSE stream
    const eventSource = new EventSource('/api/v1/events/stream');
    eventSource.onmessage = (e) => {
      try {
        const eventData = JSON.parse(e.data);
        setEvents((prev) => [eventData, ...prev.slice(0, 49)]);
        // Auto refresh snapshot on important events
        if (['TASK_CREATED', 'TASK_UPDATED', 'APPROVAL_DECIDED', 'ALERT_TRIGGERED', 'AGENT_STATUS_CHANGED'].includes(eventData.event_type)) {
          fetchSnapshot();
        }
      } catch (err) {
        // SSE heartbeat ping or non-json message
      }
    };

    eventSource.onerror = () => {
      // EventSource reconnects automatically
    };

    return () => {
      clearInterval(interval);
      eventSource.close();
    };
  }, []);

  const handleDecideApproval = async (approvalId, approved) => {
    try {
      const endpoint = approved 
        ? `/api/v1/approvals/${approvalId}/approve` 
        : `/api/v1/approvals/${approvalId}/reject`;
      const res = await fetch(endpoint, { method: 'POST' });
      if (res.ok) {
        fetchSnapshot();
      }
    } catch (err) {
      console.error('Error deciding approval:', err);
    }
  };

  return (
    <div className="flex bg-[#0a0e1a] min-h-screen text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        pendingApprovalCount={snapshot?.approvals?.length || 0}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header snapshot={snapshot} />

        <main className="p-6 space-y-6 flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'office' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Departments and Agents */}
              <div className="lg:col-span-2 space-y-6">
                <DepartmentGrid 
                  departments={snapshot?.departments || []}
                  agents={snapshot?.agents || []}
                  onSelectAgent={(agent) => setSelectedAgent(agent)}
                />
              </div>

              {/* Right 1 Col: Approvals & Live Telemetry Feed */}
              <div className="space-y-6">
                <ApprovalDrawer 
                  approvals={snapshot?.approvals || []}
                  onDecide={handleDecideApproval}
                />
                <LiveActivityFeed 
                  events={events}
                  alerts={snapshot?.alerts || []}
                />
              </div>
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="glass-panel p-6 space-y-4">
              <h2 className="text-base font-bold text-white">Agent Directory & MCP Permissions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {snapshot?.agents?.map((ag) => (
                  <div key={ag.id} className="glass-card p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-cyan-300">{ag.name}</h3>
                      <span className={`status-pill status-${ag.status}`}>{ag.status}</span>
                    </div>
                    <p className="text-xs text-slate-300">{ag.purpose}</p>
                    <div className="text-[11px] text-slate-400 font-mono pt-1">
                      <strong>Model Policy:</strong> {ag.model_policy}
                    </div>
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Authorized MCP Tables:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {ag.data_sources?.map((ds) => (
                          <span key={ds} className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-200 border border-cyan-500/20">
                            {ds}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'approvals' && (
            <ApprovalDrawer 
              approvals={snapshot?.approvals || []}
              onDecide={handleDecideApproval}
            />
          )}

          {activeTab === 'alerts' && (
            <div className="glass-panel p-6 space-y-4">
              <h2 className="text-base font-bold text-white">Alert Management Center</h2>
              <div className="space-y-3">
                {snapshot?.alerts?.map((alt) => (
                  <div key={alt.id} className="glass-card p-4 space-y-2 border-l-4 border-amber-500">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-white">{alt.title}</h4>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        {alt.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{alt.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <LiveActivityFeed 
              events={events}
              alerts={snapshot?.alerts || []}
            />
          )}
        </main>
      </div>
    </div>
  );
}
