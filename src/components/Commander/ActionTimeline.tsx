import React from 'react';
import { CheckCircle2, XCircle, Clock, PlayCircle, AlertCircle, Phone, MessageSquare, Terminal, Globe, Camera, Folder, Settings, Shield } from 'lucide-react';
import { ActionStep } from '../../types';

interface ActionTimelineProps {
  actions: ActionStep[];
  onSelectAction?: (action: ActionStep) => void;
}

export const ActionTimeline: React.FC<ActionTimelineProps> = ({ actions, onSelectAction }) => {
  if (actions.length === 0) {
    return (
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 text-center">
        <Shield className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-slate-300">No Mobile Actions In Queue</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Enter any command above or pick a preset below. The AI will formulate discrete actions and pause for your explicit authorization.
        </p>
      </div>
    );
  }

  const getStatusIcon = (status: ActionStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'denied':
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'executing':
        return <PlayCircle className="w-4 h-4 text-amber-400 animate-spin" />;
      case 'authorized':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'pending_permission':
      default:
        return <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          Mobile Action Execution Stream ({actions.length})
        </span>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {actions.map((act) => (
          <div
            key={act.id}
            onClick={() => onSelectAction && onSelectAction(act)}
            className={`p-3 rounded-xl border transition-all text-xs ${
              act.status === 'pending_permission'
                ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                : act.status === 'completed'
                ? 'bg-slate-900/90 border-slate-800 text-slate-200'
                : act.status === 'denied'
                ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1 gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {getStatusIcon(act.status)}
                <span className="font-semibold text-white truncate">{act.title}</span>
              </div>
              <span className="font-mono text-[9px] sm:text-[10px] uppercase text-slate-400 flex-shrink-0">
                {act.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1">
              <span>Target: <strong className="text-slate-300">{act.targetApp}</strong></span>
              <span>•</span>
              <span className="truncate max-w-[200px]">{act.permissionRequested}</span>
              <span>•</span>
              <span>{act.timestamp}</span>
            </div>

            {act.executionResult?.output && (
              <div className="mt-2 p-2 rounded-lg bg-black/60 border border-slate-800 font-mono text-[10px] text-emerald-400 whitespace-pre-wrap max-h-24 overflow-y-auto">
                {act.executionResult.output}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
