import React, { useState } from 'react';
import { ShieldCheck, Check, X, Clock, UserCheck, AlertCircle } from 'lucide-react';

export default function ApprovalDrawer({ approvals = [], onDecide }) {
  const [loadingId, setLoadingId] = useState(null);

  const handleAction = async (approvalId, approved) => {
    setLoadingId(approvalId);
    try {
      await onDecide(approvalId, approved);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Human Approval Queue (HITL)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          {approvals.length} Pending Actions
        </span>
      </div>

      {approvals.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400">
          <UserCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          No actions currently awaiting human sign-off.
        </div>
      ) : (
        <div className="space-y-3">
          {approvals.map((appr) => (
            <div 
              key={appr.id}
              className="glass-card p-4 space-y-3 border-l-4 border-amber-500"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                    {appr.action_type}
                  </span>
                  <h4 className="text-xs font-bold text-slate-100 mt-1">
                    {appr.summary || appr.reason}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Agent: <strong className="text-cyan-400">{appr.agent_id}</strong>
                </span>
              </div>

              <p className="text-xs text-slate-300 bg-black/30 p-2.5 rounded-lg">
                <strong>Reason:</strong> {appr.reason}
              </p>

              {appr.requested_payload && Object.keys(appr.requested_payload).length > 0 && (
                <pre className="text-[10px] text-slate-400 bg-black/50 p-2 rounded font-mono overflow-x-auto">
                  {JSON.stringify(appr.requested_payload, null, 2)}
                </pre>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/5">
                <button
                  disabled={loadingId === appr.id}
                  onClick={() => handleAction(appr.id, false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/30 transition flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  Reject
                </button>
                <button
                  disabled={loadingId === appr.id}
                  onClick={() => handleAction(appr.id, true)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
                >
                  <Check className="w-3.5 h-3.5" />
                  Authorize Action
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
