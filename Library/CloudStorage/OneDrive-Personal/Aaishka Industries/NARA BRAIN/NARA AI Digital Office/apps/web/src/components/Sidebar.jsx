import React from 'react';
import { 
  LayoutGrid, 
  Bot, 
  CheckSquare, 
  GitBranch, 
  ShieldCheck, 
  BellRing, 
  Database, 
  Wrench, 
  FileText, 
  Settings,
  Sparkles,
  Layers
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'office', label: 'Digital Office', icon: LayoutGrid },
  { id: 'agents', label: 'Agents & Registry', icon: Bot, badge: '18' },
  { id: 'tasks', label: 'Tasks & Queue', icon: CheckSquare },
  { id: 'workflows', label: 'Workflows', icon: GitBranch },
  { id: 'approvals', label: 'Approval Queue', icon: ShieldCheck, highlight: true },
  { id: 'alerts', label: 'Alert Center', icon: BellRing },
  { id: 'data_sources', label: 'Data Sources (MCP)', icon: Database },
  { id: 'integrations', label: 'Tools & Integrations', icon: Wrench },
  { id: 'audit', label: 'Audit Timeline', icon: FileText },
  { id: 'settings', label: 'Configuration', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, pendingApprovalCount = 0 }) {
  return (
    <aside className="w-64 bg-[#0d1322] border-r border-white/5 flex flex-col justify-between h-screen sticky top-0 shrink-0 z-40">
      {/* Brand Header */}
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wider text-white uppercase font-mono">
              NARA.AI
            </h1>
            <p className="text-[11px] text-cyan-400 font-medium">
              Digital Office Control Plane
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-transparent text-cyan-300 border-l-4 border-cyan-400 pl-2'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'approvals' && pendingApprovalCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {pendingApprovalCount}
                  </span>
                )}
                {item.badge && item.id !== 'approvals' && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] text-slate-400 bg-white/5">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Brand Footer */}
      <div className="p-4 border-t border-white/5 bg-[#090e18]/60">
        <div className="p-3 rounded-xl bg-[#141b2d]/60 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold text-slate-300">Sustainable Fashion</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Multi-Agent Operations & Production Orchestrator v2.0
          </p>
        </div>
      </div>
    </aside>
  );
}
