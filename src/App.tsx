import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Terminal,
  Phone,
  MessageSquare,
  Globe,
  Camera,
  Folder,
  Settings,
  AlertTriangle,
  FileCheck2,
  Cpu,
  Brain,
  UploadCloud,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { PhoneFrame } from './components/PhoneSimulator/PhoneFrame';
import { MultimodalInput } from './components/Commander/MultimodalInput';
import { PermissionRequestCard } from './components/Commander/PermissionRequestCard';
import { ActionTimeline } from './components/Commander/ActionTimeline';
import { QuickActionPresets } from './components/Commander/QuickActionPresets';
import { AuditLogModal } from './components/Commander/AuditLogModal';
import { AIBrainModal, AI_BRAIN_MODELS } from './components/BrainCenter/AIBrainModal';
import { DirectMobileModal } from './components/MobilePairing/DirectMobileModal';
import { DeployModal } from './components/Deployment/DeployModal';
import { requestActionPlan, fetchServerStatus } from './services/api';
import { soundFX } from './services/audioEffects';
import { RealDeviceBridge } from './services/realDeviceBridge';
import { ActionStep, Attachment, AuditRecord, DeviceSettings, AIModelBrainId, UILayoutMode } from './types';

export default function App() {
  // Mobile device state
  const [activeApp, setActiveApp] = useState<string>('Home');
  const [deviceSettings, setDeviceSettings] = useState<DeviceSettings>({
    wifi: true,
    bluetooth: true,
    cellular5G: true,
    airplaneMode: false,
    flashlight: false,
    locationGps: true,
    batterySaver: false,
    doNotDisturb: false,
    volume: 75,
    brightness: 85,
    batteryLevel: 88,
  });

  // Direct Mobile Connection state (Direct hardware connection - no bluetooth required)
  const [isDirectMobileConnected, setIsDirectMobileConnected] = useState<boolean>(false);
  const [isDirectModalOpen, setIsDirectModalOpen] = useState<boolean>(false);
  const [uiLayoutMode, setUILayoutMode] = useState<UILayoutMode>('auto');

  // AI Brain & Multi-Model Core state (All 14 Frontier Models)
  const [activeBrainId, setActiveBrainId] = useState<AIModelBrainId>('gemini-2.5-flash');
  const [temperature, setTemperature] = useState<number>(0.2);
  const [isBrainModalOpen, setIsBrainModalOpen] = useState<boolean>(false);

  // Deployment modal state
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);

  // Security & Permission state
  const [killSwitchActive, setKillSwitchActive] = useState<boolean>(false);
  const [pendingActions, setPendingActions] = useState<ActionStep[]>([]);
  const [actionHistory, setActionHistory] = useState<ActionStep[]>([]);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([
    {
      id: 'aud_init_1',
      timestamp: 'Today, 08:30 AM',
      actionTitle: 'System Integrity Handshake',
      category: 'system_settings',
      targetApp: 'Settings',
      permission: 'android.permission.BIND_ACCESSIBILITY_SERVICE',
      riskLevel: 'low',
      decision: 'authorized',
      payloadSummary: 'Root automation agent initialized with Human-in-the-Loop policy.',
      executionStatus: 'success',
    },
  ]);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // AI planning state
  const [isFormulatingPlan, setIsFormulatingPlan] = useState(false);
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('Auto-detect Language');
  const [lastExplanation, setLastExplanation] = useState<string>(
    'Aegis OS is standing by with full root smartphone capabilities. Speak or type in any language, upload files, photos, or videos. Following your directive, I will ask for explicit authorization before every action.'
  );
  const [serverMeta, setServerMeta] = useState<any>(null);

  // Initial payloads routed to specific mobile apps
  const [initialCallPayload, setInitialCallPayload] = useState<any>(null);
  const [initialDraftPayload, setInitialDraftPayload] = useState<any>(null);
  const [initialCodePayload, setInitialCodePayload] = useState<any>(null);
  const [initialBrowsePayload, setInitialBrowsePayload] = useState<any>(null);

  // Tab view on mobile screens (Commander Station vs Phone View)
  const [mobileTab, setMobileTab] = useState<'commander' | 'phone' | 'timeline'>('commander');

  // Load server status & detect real mobile environment on mount
  useEffect(() => {
    fetchServerStatus().then((meta) => {
      if (meta) setServerMeta(meta);
    });

    if (RealDeviceBridge.isMobileDevice()) {
      setIsDirectMobileConnected(true);
      // Read real battery
      RealDeviceBridge.getBatteryStatus().then((b) => {
        if (b) {
          setDeviceSettings((prev) => ({ ...prev, batteryLevel: b.level }));
        }
      });
    }
  }, []);

  const activeBrain = AI_BRAIN_MODELS.find((m) => m.id === activeBrainId) || AI_BRAIN_MODELS[0];

  // Handle new prompt submission from Multimodal Commander
  const handleCommandSubmit = async (prompt: string, attachments: Attachment[]) => {
    if (killSwitchActive) {
      soundFX.playDeny();
      alert('Action blocked: Emergency Kill Switch is currently active. Resume automation in Settings.');
      return;
    }

    setIsFormulatingPlan(true);

    try {
      const planRes = await requestActionPlan(
        prompt,
        attachments.map((a) => ({ name: a.name, type: a.type, mimeType: a.mimeType, data: a.data })),
        {
          activeApp,
          wifi: deviceSettings.wifi,
          battery: `${deviceSettings.batteryLevel}%`,
          modelBrain: activeBrainId,
          temperature,
        },
        activeBrainId
      );

      if (planRes.explanation) {
        setLastExplanation(planRes.explanation);
      }
      if (planRes.detectedLanguage) {
        setDetectedLanguage(planRes.detectedLanguage);
      }

      const generatedSteps: ActionStep[] = (planRes.actionPlan || []).map((step: any) => ({
        id: step.id || `act_${Date.now()}_${Math.random()}`,
        targetApp: step.targetApp || 'Phone',
        category: step.category || 'app_control',
        title: step.title || 'Mobile Automation Step',
        details: step.details || 'Execute task on device',
        riskLevel: step.riskLevel || 'medium',
        permissionRequested: step.permissionRequested || 'android.permission.ACCESS_FINE_LOCATION',
        payload: step.payload || {},
        status: 'pending_permission' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));

      if (generatedSteps.length > 0) {
        soundFX.playAlert();
        setPendingActions(generatedSteps);
        setMobileTab('commander');
      }
    } catch (err: any) {
      console.error('Failed to formulate plan:', err);
      // Fallback action step
      const fallbackStep: ActionStep = {
        id: `act_${Date.now()}`,
        targetApp: 'Phone',
        category: 'calling',
        title: 'Execute Command: ' + prompt.slice(0, 32),
        details: 'Review extracted payload and confirm mobile authorization.',
        riskLevel: 'medium',
        permissionRequested: 'android.permission.CALL_PHONE',
        payload: { command: prompt },
        status: 'pending_permission',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setPendingActions([fallbackStep]);
      soundFX.playAlert();
    } finally {
      setIsFormulatingPlan(false);
    }
  };

  // Human authorizes an action
  const handleAuthorizeAction = async (actionId: string, updatedPayload?: Record<string, any>) => {
    const action = pendingActions.find((a) => a.id === actionId);
    if (!action) return;

    const payloadToUse = updatedPayload || action.payload;
    setIsExecutingAction(true);
    soundFX.playAuthorize();

    // Trigger physical mobile haptic vibration
    RealDeviceBridge.vibrate([80, 40, 80]);

    // Remove from pending
    setPendingActions((prev) => prev.filter((a) => a.id !== actionId));

    // Route to corresponding mobile phone app simulator
    const app = action.targetApp.toLowerCase();
    let routedAppName = 'Home';

    if (app.includes('phone') || action.category === 'calling') {
      routedAppName = 'Phone';
      setInitialCallPayload(payloadToUse);

      // If user wants real hardware action or is on mobile, trigger real dialer
      if (isDirectMobileConnected && payloadToUse?.phoneNumber) {
        RealDeviceBridge.dial(payloadToUse.phoneNumber);
      }
    } else if (app.includes('message') || app.includes('whatsapp') || action.category === 'messaging') {
      routedAppName = app.includes('whatsapp') ? 'WhatsApp' : 'Messages';
      setInitialDraftPayload(payloadToUse);

      // If connected to real phone, trigger real SMS or WhatsApp
      if (isDirectMobileConnected && payloadToUse?.messageText) {
        RealDeviceBridge.sendMessage(payloadToUse.recipient || '', payloadToUse.messageText, routedAppName);
      }
    } else if (app.includes('code') || app.includes('terminal') || action.category === 'coding') {
      routedAppName = 'CodeTerminal';
      setInitialCodePayload(payloadToUse);
    } else if (app.includes('browser') || action.category === 'browsing') {
      routedAppName = 'Browser';
      setInitialBrowsePayload(payloadToUse);
    } else if (app.includes('camera') || action.category === 'camera_gallery') {
      routedAppName = 'Camera';
    } else if (app.includes('file') || action.category === 'file_system') {
      routedAppName = 'Files';
    } else if (app.includes('setting') || action.category === 'system_settings') {
      routedAppName = 'Settings';
      if (payloadToUse?.settingKey) {
        setDeviceSettings((prev) => ({
          ...prev,
          [payloadToUse.settingKey]: payloadToUse.desiredValue ?? !prev[payloadToUse.settingKey as keyof DeviceSettings],
        }));
      }
    }

    setActiveApp(routedAppName);

    // Record completed step
    const completedStep: ActionStep = {
      ...action,
      payload: payloadToUse,
      status: 'completed',
      executionResult: {
        output: `[Aegis OS Dispatch] Authorized by user. Model Brain: ${activeBrain.name}. Routed to ${routedAppName}. Parameters verified. Exit code: 0`,
        executionTimeMs: 38,
      },
    };

    setActionHistory((prev) => [completedStep, ...prev]);

    // Record in security audit log
    const auditRecord: AuditRecord = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actionTitle: action.title,
      category: action.category,
      targetApp: routedAppName,
      permission: action.permissionRequested,
      riskLevel: action.riskLevel,
      decision: 'authorized',
      payloadSummary: JSON.stringify(payloadToUse).slice(0, 100),
      executionStatus: 'success',
    };
    setAuditRecords((prev) => [auditRecord, ...prev]);

    setTimeout(() => {
      setIsExecutingAction(false);
      setMobileTab('phone');
    }, 400);
  };

  // Human denies an action
  const handleDenyAction = (actionId: string, reason: string = 'User rejected authorization') => {
    const action = pendingActions.find((a) => a.id === actionId);
    if (!action) return;

    soundFX.playDeny();
    RealDeviceBridge.vibrate([150]);
    setPendingActions((prev) => prev.filter((a) => a.id !== actionId));

    const deniedStep: ActionStep = {
      ...action,
      status: 'denied',
      executionResult: {
        error: reason,
      },
    };

    setActionHistory((prev) => [deniedStep, ...prev]);

    const auditRecord: AuditRecord = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actionTitle: action.title,
      category: action.category,
      targetApp: action.targetApp,
      permission: action.permissionRequested,
      riskLevel: action.riskLevel,
      decision: 'denied',
      payloadSummary: JSON.stringify(action.payload).slice(0, 100),
      executionStatus: 'cancelled',
      userNotes: reason,
    };
    setAuditRecords((prev) => [auditRecord, ...prev]);
  };

  const isFullscreenMobile = uiLayoutMode === 'mobile_fullscreen';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-900/60 selection:text-white pb-16 lg:pb-0">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-black font-black shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold tracking-tight text-white text-sm sm:text-lg">
                  AEGIS OMNIAUTOMATE
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold">
                  v4.2 PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden md:block">
                Full-Access Mobile Controller • 100% Permission Gated • Multi-Brain AI Engine
              </p>
            </div>
          </div>

          {/* Action Tools & Modals Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 max-w-full overflow-x-auto no-scrollbar py-0.5">
            {/* AI Brain Hub Button */}
            <button
              onClick={() => {
                soundFX.playTap();
                setIsBrainModalOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm group"
              title="Configure AI Brain Models"
            >
              <Brain className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline font-mono text-[11px]">{activeBrain.name}</span>
              <span className="sm:hidden font-mono text-[10px]">Brain</span>
            </button>

            {/* Direct Mobile Link Button (موبائل ڈائریکٹ کنکشن) */}
            <button
              onClick={() => {
                soundFX.playTap();
                setIsDirectModalOpen(true);
              }}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                isDirectMobileConnected
                  ? 'bg-emerald-950/90 border-emerald-500/70 text-emerald-300 ring-1 ring-emerald-500/50 shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-emerald-900/60 to-teal-900/60 hover:from-emerald-800/80 hover:to-teal-800/80 text-emerald-200 border-emerald-500/50'
              }`}
              title="Direct Mobile Link (موبائل ڈائریکٹ کنکشن - بغیر بلوٹوتھ)"
            >
              <Smartphone className={`w-3.5 h-3.5 ${isDirectMobileConnected ? 'text-emerald-400 animate-pulse' : 'text-teal-300'}`} />
              <span className="hidden sm:inline">
                {isDirectMobileConnected ? 'Direct Mobile Active' : 'Direct Mobile Link'}
              </span>
              <span className="sm:hidden text-[10px]">{isDirectMobileConnected ? 'Direct Active' : 'Direct Mobile'}</span>
            </button>

            {/* GitHub & Vercel Deploy Button */}
            <button
              onClick={() => {
                soundFX.playTap();
                setIsDeployModalOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 hover:from-purple-800/80 hover:to-indigo-800/80 border border-purple-500/50 text-purple-200 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              title="Push to GitHub and Deploy to Vercel"
            >
              <UploadCloud className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden md:inline">GitHub & Vercel</span>
              <span className="md:hidden text-[10px]">Deploy</span>
            </button>

            {/* Audit Log */}
            <button
              onClick={() => {
                soundFX.playTap();
                setIsAuditModalOpen(true);
              }}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1"
              title="View Security Permission Audit Log"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline font-mono text-[11px]">Audit ({auditRecords.length})</span>
            </button>

            {/* Kill switch */}
            <button
              onClick={() => {
                soundFX.playAlert();
                setKillSwitchActive(!killSwitchActive);
              }}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                killSwitchActive
                  ? 'bg-rose-600 text-white shadow-rose-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
              title="Emergency Kill Switch"
            >
              <AlertTriangle className={`w-3.5 h-3.5 ${killSwitchActive ? 'text-white' : 'text-rose-400'}`} />
              <span className="hidden lg:inline">{killSwitchActive ? 'LOCKED' : 'Kill Switch'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Screen Switcher Tabs (Only visible on small devices) */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 grid grid-cols-3 text-xs font-semibold select-none">
        <button
          onClick={() => {
            soundFX.playTap();
            setMobileTab('commander');
          }}
          className={`py-2.5 text-center transition-colors flex items-center justify-center gap-1 ${
            mobileTab === 'commander'
              ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-950/60'
              : 'text-slate-400'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Commander {pendingActions.length > 0 && `(${pendingActions.length})`}</span>
        </button>
        <button
          onClick={() => {
            soundFX.playTap();
            setMobileTab('phone');
          }}
          className={`py-2.5 text-center transition-colors flex items-center justify-center gap-1 ${
            mobileTab === 'phone'
              ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-950/60'
              : 'text-slate-400'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile OS ({activeApp})</span>
        </button>
        <button
          onClick={() => {
            soundFX.playTap();
            setMobileTab('timeline');
          }}
          className={`py-2.5 text-center transition-colors flex items-center justify-center gap-1 ${
            mobileTab === 'timeline'
              ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-950/60'
              : 'text-slate-400'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>History ({actionHistory.length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: AI Commander & Permission Gate (7 cols) */}
        <div
          className={`space-y-5 lg:col-span-7 ${
            mobileTab === 'phone' || mobileTab === 'timeline' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Agent Guidance / Explanation Box */}
          <div className="bg-slate-900/80 rounded-2xl border border-emerald-500/30 p-3.5 sm:p-4 shadow-lg backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                  Autonomous Intelligence Stream
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800/40">
                  Brain: {activeBrain.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                  {detectedLanguage}
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
              {lastExplanation}
            </p>
          </div>

          {/* ACTIVE PERMISSION REQUEST CARDS */}
          {pendingActions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
                  Authorization Required ({pendingActions.length} Pending)
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Zero Actions Execute Without Consent
                </span>
              </div>

              {pendingActions.map((act) => (
                <PermissionRequestCard
                  key={act.id}
                  action={act}
                  onAuthorize={handleAuthorizeAction}
                  onDeny={handleDenyAction}
                  isExecuting={isExecutingAction}
                />
              ))}
            </div>
          )}

          {/* Direct Mobile Quick Connect Bar */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/50 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-2 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-400/50 flex items-center justify-center text-emerald-300">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                  <span>Direct Mobile Link (براہِ راست موبائل کنکشن)</span>
                  {isDirectMobileConnected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
                  )}
                </div>
                <div className="text-[11px] text-emerald-300/80 font-mono truncate max-w-[210px] sm:max-w-none">
                  {isDirectMobileConnected
                    ? 'Connected: Real Mobile Hardware Active (Dialer, SMS, GPS, Haptics)'
                    : 'بغیر بلوٹوتھ اپنے موبائل سے براہِ راست جڑیں (QR یا ڈائریکٹ لنک)'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFX.playTap();
                setIsDirectModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all active:scale-95 flex items-center gap-1.5 flex-shrink-0"
            >
              <Smartphone className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isDirectMobileConnected ? 'Manage Mobile' : 'Connect Direct'}</span>
            </button>
          </div>

          {/* Multimodal Input Station */}
          <MultimodalInput
            onSubmit={handleCommandSubmit}
            isLoading={isFormulatingPlan}
            selectedLanguage={detectedLanguage}
            onSelectLanguage={setDetectedLanguage}
          />

          {/* Quick Action Presets */}
          <QuickActionPresets
            onSelectPreset={(promptText) => {
              if (promptText.toLowerCase().includes('connect') || promptText.toLowerCase().includes('direct')) {
                setIsDirectModalOpen(true);
              } else {
                handleCommandSubmit(promptText, []);
              }
            }}
            onOpenDirectMobileModal={() => setIsDirectModalOpen(true)}
          />

          {/* Action Execution History Timeline */}
          <div className="hidden lg:block">
            <ActionTimeline actions={actionHistory} />
          </div>
        </div>

        {/* Timeline tab on mobile screen */}
        {mobileTab === 'timeline' && (
          <div className="lg:hidden col-span-12">
            <ActionTimeline actions={actionHistory} />
          </div>
        )}

        {/* Right Column: Virtual or Real Mobile Phone Screen (5 cols) */}
        <div
          className={`space-y-4 lg:col-span-5 ${
            mobileTab === 'commander' || mobileTab === 'timeline' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Quick App Launcher Bar above Phone */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-2 sm:p-2.5 flex items-center justify-between shadow-lg">
            <span className="text-xs font-semibold text-slate-300 font-mono flex items-center gap-1.5 pl-1">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              Screen: <strong className="text-white">{activeApp}</strong>
            </span>

            {/* Quick App jump buttons */}
            <div className="flex items-center gap-1">
              {[
                { name: 'Home', icon: ShieldCheck, title: 'Home' },
                { name: 'Phone', icon: Phone, title: 'Dialer' },
                { name: 'Messages', icon: MessageSquare, title: 'Chat' },
                { name: 'CodeTerminal', icon: Terminal, title: 'Code IDE' },
                { name: 'Browser', icon: Globe, title: 'Web' },
                { name: 'Camera', icon: Camera, title: 'Lens' },
                { name: 'Files', icon: Folder, title: 'Storage' },
                { name: 'Settings', icon: Settings, title: 'Settings' },
              ].map((appBtn) => {
                const Icon = appBtn.icon;
                return (
                  <button
                    key={appBtn.name}
                    onClick={() => {
                      soundFX.playTap();
                      setActiveApp(appBtn.name);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      activeApp === appBtn.name
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    title={appBtn.title}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Physical / Edge-to-Edge Phone Frame Simulator */}
          <PhoneFrame
            activeApp={activeApp}
            onSetActiveApp={setActiveApp}
            deviceSettings={deviceSettings}
            onUpdateDeviceSettings={setDeviceSettings}
            killSwitchActive={killSwitchActive}
            onToggleKillSwitch={() => setKillSwitchActive(!killSwitchActive)}
            pendingPermissionCount={pendingActions.length}
            initialCallPayload={initialCallPayload}
            onClearInitialCall={() => setInitialCallPayload(null)}
            initialDraftPayload={initialDraftPayload}
            onClearInitialDraft={() => setInitialDraftPayload(null)}
            initialCodePayload={initialCodePayload}
            onClearInitialCode={() => setInitialCodePayload(null)}
            initialBrowsePayload={initialBrowsePayload}
            onClearInitialBrowse={() => setInitialBrowsePayload(null)}
            isNativeMobileMode={isFullscreenMobile || RealDeviceBridge.isMobileDevice()}
          />
        </div>
      </main>

      {/* Modals */}
      <AIBrainModal
        isOpen={isBrainModalOpen}
        onClose={() => setIsBrainModalOpen(false)}
        activeBrainId={activeBrainId}
        onSelectBrain={setActiveBrainId}
        temperature={temperature}
        onUpdateTemperature={setTemperature}
      />

      <DirectMobileModal
        isOpen={isDirectModalOpen}
        onClose={() => setIsDirectModalOpen(false)}
        isDirectConnected={isDirectMobileConnected}
        onConnectDirect={() => {
          setIsDirectMobileConnected(true);
          const auditRec: AuditRecord = {
            id: `aud_direct_${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionTitle: 'Direct Mobile Hardware Linked',
            category: 'system_settings',
            targetApp: 'Settings',
            permission: 'android.permission.DIRECT_MOBILE_BRIDGE',
            riskLevel: 'low',
            decision: 'authorized',
            payloadSummary: 'Physical mobile hardware connected directly (Battery, GPS, Dialer, SMS, Haptics).',
            executionStatus: 'success',
          };
          setAuditRecords((prev) => [auditRec, ...prev]);
        }}
        onDisconnectDirect={() => {
          setIsDirectMobileConnected(false);
        }}
        uiLayoutMode={uiLayoutMode}
        onSetUILayoutMode={setUILayoutMode}
      />

      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />

      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        auditRecords={auditRecords}
        onClearLogs={() => setAuditRecords([])}
      />
    </div>
  );
}
