import React from 'react';
import { 
  Radio, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Database, 
  ShieldAlert, 
  Activity 
} from 'lucide-react';

export default function LiveActivityFeed({ events = [], alerts = [] }) {
  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Live Activity & Telemetry Feed
          </h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          SSE Connected
        </span>
      </div>

      {/* Active Alerts Banner */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Active Alerts ({alerts.length})
          </p>
          {alerts.slice(0, 2).map((alt) => (
            <div 
              key={alt.id}
              className={`p-3 rounded-xl border flex items-start gap-3 ${
                alt.severity === 'high' || alt.severity === 'critical'
                  ? 'bg-red-500/10 border-red-500/30 text-red-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <p className="font-semibold">{alt.title}</p>
                <p className="text-[11px] opacity-90">{alt.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Stream list */}
      <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Recent Events ({events.length})
        </p>

        {events.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            Waiting for live events from SSE stream...
          </div>
        ) : (
          events.map((evt, idx) => (
            <div 
              key={evt.event_id || idx}
              className="glass-card p-3 flex items-start gap-3 text-xs"
            >
              <div className="p-1.5 rounded-lg bg-white/5 text-cyan-400 shrink-0 mt-0.5">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 font-mono text-[11px]">
                    {evt.event_type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {evt.occurred_at ? new Date(evt.occurred_at).toLocaleTimeString() : 'just now'}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Actor: <span className="text-cyan-400 font-mono">{evt.actor?.id || 'system'}</span>
                </p>
                {evt.payload && Object.keys(evt.payload).length > 0 && (
                  <pre className="text-[10px] text-slate-400 bg-black/40 p-1.5 rounded font-mono overflow-x-auto max-h-20">
                    {JSON.stringify(evt.payload, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
