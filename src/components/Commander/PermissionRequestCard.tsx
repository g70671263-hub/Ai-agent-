import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Check,
  X,
  Phone,
  MessageSquare,
  Terminal,
  Globe,
  Camera,
  Folder,
  Settings,
  ChevronDown,
  ChevronUp,
  Sliders,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { ActionStep, RiskLevel } from '../../types';
import { soundFX } from '../../services/audioEffects';

interface PermissionRequestCardProps {
  action: ActionStep;
  onAuthorize: (actionId: string, updatedPayload?: Record<string, any>) => void;
  onDeny: (actionId: string, reason?: string) => void;
  isExecuting?: boolean;
}

export const PermissionRequestCard: React.FC<PermissionRequestCardProps> = ({
  action,
  onAuthorize,
  onDeny,
  isExecuting = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPayload, setEditedPayload] = useState<Record<string, any>>(action.payload || {});
  const [showPayloadDetails, setShowPayloadDetails] = useState(true);

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'critical':
        return {
          label: 'CRITICAL RISK',
          color: 'bg-rose-950/80 text-rose-300 border-rose-500/80',
          dot: 'bg-rose-500 animate-pulse',
        };
      case 'high':
        return {
          label: 'HIGH RISK',
          color: 'bg-orange-950/80 text-orange-300 border-orange-500/80',
          dot: 'bg-orange-500',
        };
      case 'medium':
        return {
          label: 'MEDIUM RISK',
          color: 'bg-amber-950/80 text-amber-300 border-amber-500/80',
          dot: 'bg-amber-500',
        };
      case 'low':
      default:
        return {
          label: 'LOW RISK',
          color: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/80',
          dot: 'bg-emerald-500',
        };
    }
  };

  const getAppIcon = (app: string) => {
    switch (app.toLowerCase()) {
      case 'phone':
        return <Phone className="w-5 h-5 text-emerald-400" />;
      case 'messages':
      case 'whatsapp':
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case 'codeterminal':
        return <Terminal className="w-5 h-5 text-purple-400" />;
      case 'browser':
        return <Globe className="w-5 h-5 text-amber-400" />;
      case 'camera':
      case 'gallery':
        return <Camera className="w-5 h-5 text-rose-400" />;
      case 'files':
        return <Folder className="w-5 h-5 text-indigo-400" />;
      case 'settings':
        return <Settings className="w-5 h-5 text-slate-300" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
    }
  };

  const riskBadge = getRiskBadge(action.riskLevel);

  const handleApprove = () => {
    soundFX.playAuthorize();
    onAuthorize(action.id, isEditing ? editedPayload : undefined);
  };

  const handleDeny = () => {
    soundFX.playDeny();
    onDeny(action.id, 'User rejected permission in security gate');
  };

  return (
    <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-4 shadow-2xl relative overflow-hidden transition-all animate-in fade-in slide-in-from-top-2">
      {/* Top Warning Strip */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
            {getAppIcon(action.targetApp)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide">{action.targetApp}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                {action.category}
              </span>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5 min-w-0">
              <Lock className="w-3 h-3 flex-shrink-0" />
              <span className="truncate max-w-[130px] sm:max-w-[260px]">{action.permissionRequested}</span>
            </div>
          </div>
        </div>

        {/* Risk Badge */}
        <div className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold border flex items-center gap-1.5 flex-shrink-0 ${riskBadge.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${riskBadge.dot}`} />
          {riskBadge.label}
        </div>
      </div>

      {/* Action Title & Clear Explanation */}
      <div className="my-3 space-y-1.5">
        <h3 className="text-sm sm:text-base font-semibold text-white leading-snug flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
          {action.title}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          {action.details}
        </p>
      </div>

      {/* Target Parameters & Live Payload Inspection */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1 text-xs">
          <button
            type="button"
            onClick={() => setShowPayloadDetails(!showPayloadDetails)}
            className="text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1"
          >
            <span>Action Parameters & Payload</span>
            {showPayloadDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1"
          >
            <Sliders className="w-3 h-3" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Parameters'}</span>
          </button>
        </div>

        {showPayloadDetails && (
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-xs font-mono">
            {isEditing ? (
              <div className="space-y-2">
                {Object.entries(editedPayload).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">{key}:</label>
                    {typeof value === 'string' && value.length > 50 ? (
                      <textarea
                        value={value}
                        rows={3}
                        onChange={(e) =>
                          setEditedPayload((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-emerald-300 font-mono focus:outline-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={String(value)}
                        onChange={(e) =>
                          setEditedPayload((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-emerald-300 font-mono focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {Object.entries(action.payload || {}).map(([key, val]) => (
                  <div key={key} className="flex items-start gap-2">
                    <span className="text-slate-400 font-medium">{key}:</span>
                    <span className="text-emerald-300 break-all">
                      {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Decision Buttons (Strict Permission Gate) */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Deny Button */}
        <button
          type="button"
          onClick={handleDeny}
          disabled={isExecuting}
          className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-500/80 text-rose-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
        >
          <X className="w-4 h-4 text-rose-400" />
          <span>Deny & Abort</span>
        </button>

        {/* Authorize Button */}
        <button
          type="button"
          onClick={handleApprove}
          disabled={isExecuting}
          className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
        >
          {isExecuting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Executing on Mobile...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Authorize & Execute</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
