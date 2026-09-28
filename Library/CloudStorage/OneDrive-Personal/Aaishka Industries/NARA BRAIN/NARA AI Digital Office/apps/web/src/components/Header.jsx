import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  BarChart3, 
  AlertTriangle, 
  Activity, 
  Search, 
  Bell, 
  Sparkles 
} from 'lucide-react';

export default function Header({ snapshot }) {
  const metrics = snapshot?.metrics || {
    agents_active: 18,
    tasks_in_progress: 32,
    awaiting_approval: 3,
    active_alerts: 2,
    today_revenue: 45230,
    meta_roas_7d: 3.2,
  };

  return (
    <header className="w-full flex flex-col gap-4 p-6 border-b border-white/5 bg-[#0a0e1a]/80 backdrop-blur-md sticky top-0 z-30">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Office Running
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Snapshot v{snapshot?.snapshot_version || '1000'}
          </span>
        </div>

        {/* Global Omnisearch */}
        <div className="flex-1 max-w-xl relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search agents, tasks, workflows, or query NARAwear MCP data..."
            className="w-full bg-[#141b2d]/90 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition"
          />
        </div>

        {/* User profile & Notifications */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-xl bg-[#141b2d] border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/30 transition">
            <Bell className="w-4 h-4" />
            {metrics.active_alerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[10px] font-bold text-black flex items-center justify-center">
                {metrics.active_alerts}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              AB
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-slate-200">Arindam B.</p>
              <p className="text-[10px] text-slate-400">Operations Lead</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Strip (Epic 4 / TAD §29) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
        {/* Metric 1 */}
        <div className="glass-panel p-3.5 flex items-center gap-3.5 hover:border-cyan-500/30 transition">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Agents Online</p>
            <p className="text-lg font-bold text-white tracking-tight">
              {snapshot?.agents?.length || 18} <span className="text-xs text-emerald-400 font-normal">Active</span>
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-3.5 flex items-center gap-3.5 hover:border-blue-500/30 transition">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Tasks in Progress</p>
            <p className="text-lg font-bold text-white tracking-tight">
              {metrics.tasks_in_progress || 0}
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-3.5 flex items-center gap-3.5 hover:border-purple-500/30 transition">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Meta 7d ROAS</p>
            <p className="text-lg font-bold text-purple-300 tracking-tight">
              {metrics.meta_roas_7d?.toFixed(1) || '3.2'}x
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-3.5 flex items-center gap-3.5 hover:border-amber-500/30 transition">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Awaiting Approval</p>
            <p className="text-lg font-bold text-amber-300 tracking-tight">
              {snapshot?.approvals?.length || metrics.awaiting_approval || 0}
            </p>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="glass-panel p-3.5 flex items-center gap-3.5 hover:border-emerald-500/30 transition">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">System Health</p>
            <p className="text-lg font-bold text-emerald-300 tracking-tight">
              99.8%
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
