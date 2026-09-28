import React from 'react';
import { 
  Bot, 
  Database, 
  Activity, 
  PauseCircle, 
  PlayCircle, 
  ShieldCheck, 
  Layers, 
  Sliders 
} from 'lucide-react';

export default function DepartmentGrid({ departments = [], agents = [], onSelectAgent }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Autonomous Department Clusters
          </h2>
          <p className="text-xs text-slate-400">
            Real-time projection of 8 operational departments and their authorized agents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">8 Departments Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {departments.map((dept) => {
          const deptAgents = agents.filter((a) => a.department === dept.id);
          return (
            <div 
              key={dept.id} 
              className="glass-panel p-4 flex flex-col justify-between border-t-2 transition-all hover:border-t-cyan-400"
              style={{ borderTopColor: dept.color || '#00d4aa' }}
            >
              {/* Department Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span 
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                    style={{ 
                      backgroundColor: `${dept.color}15`, 
                      color: dept.color,
                      border: `1px solid ${dept.color}30` 
                    }}
                  >
                    {dept.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {deptAgents.length} Agents
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium line-clamp-2 mb-3">
                  {dept.description}
                </p>

                {/* Agents List */}
                <div className="space-y-2 mt-3">
                  {deptAgents.map((agent) => (
                    <div
                      key={agent.id}
                      onClick={() => onSelectAgent?.(agent)}
                      className="glass-card p-2.5 cursor-pointer flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bot className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-xs font-semibold text-slate-100 hover:text-cyan-300 transition">
                            {agent.name}
                          </span>
                        </div>
                        <span className={`status-pill status-${agent.status}`}>
                          {agent.status === 'active' && <span className="pulse-active"></span>}
                          {agent.status}
                        </span>
                      </div>

                      {/* Capabilities / Purpose snippet */}
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {agent.purpose}
                      </p>

                      {/* Declared Data Sources Badges */}
                      {agent.data_sources?.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap pt-1">
                          <Database className="w-3 h-3 text-slate-500 shrink-0" />
                          {agent.data_sources.slice(0, 3).map((ds) => (
                            <span 
                              key={ds} 
                              className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-300 border border-white/5"
                            >
                              {ds}
                            </span>
                          ))}
                          {agent.data_sources.length > 3 && (
                            <span className="text-[9px] text-slate-400 font-mono">
                              +{agent.data_sources.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
