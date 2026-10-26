import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, XCircle, Download, Trash2, X, Search, FileText } from 'lucide-react';
import { AuditRecord } from '../../types';
import { soundFX } from '../../services/audioEffects';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditRecords: AuditRecord[];
  onClearLogs: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  isOpen,
  onClose,
  auditRecords,
  onClearLogs,
}) => {
  const [filter, setFilter] = useState<'all' | 'authorized' | 'denied'>('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredRecords = auditRecords.filter((rec) => {
    const matchesFilter = filter === 'all' || rec.decision === filter;
    const matchesSearch =
      rec.actionTitle.toLowerCase().includes(search.toLowerCase()) ||
      rec.permission.toLowerCase().includes(search.toLowerCase()) ||
      rec.targetApp.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const authorizedCount = auditRecords.filter((r) => r.decision === 'authorized').length;
  const deniedCount = auditRecords.filter((r) => r.decision === 'denied').length;

  const exportJSON = () => {
    soundFX.playTap();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditRecords, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aegis_permission_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Security Permission Audit Log</h3>
              <p className="text-xs text-slate-400">
                Immutable record of all AI automation access requests and human authorization decisions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-lg font-bold text-white font-mono">{auditRecords.length}</div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Total Requests</div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
            <div className="text-lg font-bold text-emerald-400 font-mono">{authorizedCount}</div>
            <div className="text-[10px] text-emerald-300 uppercase font-mono">Authorized (Human)</div>
          </div>
          <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/40">
            <div className="text-lg font-bold text-rose-400 font-mono">{deniedCount}</div>
            <div className="text-[10px] text-rose-300 uppercase font-mono">Denied / Blocked</div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-500 mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by app, permission, title..."
              className="bg-transparent w-full focus:outline-none text-slate-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-xs">
              {(['all', 'authorized', 'denied'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilter(mode)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-mono text-[11px] transition-colors ${
                    filter === mode ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <button
              onClick={exportJSON}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-xs"
              title="Download audit JSON"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClearLogs}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-rose-300 text-xs"
              title="Clear log"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Audit Records List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No audit logs matching query.
            </div>
          ) : (
            filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {rec.decision === 'authorized' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                    <span className="font-semibold text-white">{rec.actionTitle}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      rec.decision === 'authorized'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {rec.decision.toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>App: <strong className="text-slate-300">{rec.targetApp}</strong></span>
                  <span>•</span>
                  <span>Permission: <strong className="text-emerald-400">{rec.permission}</strong></span>
                  <span>•</span>
                  <span>Time: {rec.timestamp}</span>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg font-mono truncate">
                  Payload: {rec.payloadSummary}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
