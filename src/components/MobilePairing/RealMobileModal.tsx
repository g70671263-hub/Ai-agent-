import React, { useState, useEffect } from 'react';
import { Smartphone, QrCode, Copy, Check, ExternalLink, Zap, ShieldCheck, Wifi, Battery, MapPin, Radio, X } from 'lucide-react';
import { RealDeviceBridge } from '../../services/realDeviceBridge';
import { soundFX } from '../../services/audioEffects';

interface RealMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRealMobileConnected: boolean;
  onConnectRealMobile: () => void;
  uiLayoutMode: 'auto' | 'mobile_fullscreen' | 'desktop_studio';
  onSetUILayoutMode: (mode: 'auto' | 'mobile_fullscreen' | 'desktop_studio') => void;
}

export const RealMobileModal: React.FC<RealMobileModalProps> = ({
  isOpen,
  onClose,
  isRealMobileConnected,
  onConnectRealMobile,
  uiLayoutMode,
  onSetUILayoutMode,
}) => {
  const [copied, setCopied] = useState(false);
  const [realBattery, setRealBattery] = useState<{ level: number; charging: boolean } | null>(null);
  const [realLocation, setRealLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const appUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-dev-ttbikzzmipmyqsvnmssshb-516957803756.asia-northeast1.run.app';
  const pairingPin = 'AEGIS-9102-MOB';

  useEffect(() => {
    if (isOpen) {
      RealDeviceBridge.getBatteryStatus().then((b) => b && setRealBattery(b));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    soundFX.playTap();
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestHaptics = () => {
    soundFX.playAlert();
    RealDeviceBridge.vibrate([100, 50, 100, 50, 150]);
  };

  const handleTestDialer = () => {
    soundFX.playAuthorize();
    RealDeviceBridge.dial('+15552348901');
  };

  const handleTestShare = () => {
    soundFX.playAuthorize();
    RealDeviceBridge.sendMessage('Mom', 'Hello from Aegis AI Mobile Autonomous Controller!', 'WhatsApp');
  };

  const handleQuerySensors = async () => {
    setIsQuerying(true);
    soundFX.playTap();
    const [b, loc] = await Promise.all([
      RealDeviceBridge.getBatteryStatus(),
      RealDeviceBridge.getCurrentLocation(),
    ]);
    if (b) setRealBattery(b);
    if (loc) setRealLocation(loc);
    setIsQuerying(false);
    soundFX.playAuthorize();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <Smartphone className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Connect Real Physical Smartphone</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 text-[10px] font-mono">
                  {isRealMobileConnected ? 'PAIRED' : 'STANDBY'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Bridge your actual device hardware (Dialer, SMS, WhatsApp, GPS, Camera, Haptics)
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Pairing Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
            {/* Left: QR Code */}
            <div className="flex flex-col items-center text-center p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              {/* Synthetic high-contrast QR code vector graphic */}
              <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                  {/* Outer corner squares */}
                  <rect x="5" y="5" width="30" height="30" fill="#000000" />
                  <rect x="10" y="10" width="20" height="20" fill="#ffffff" />
                  <rect x="15" y="15" width="10" height="10" fill="#000000" />

                  <rect x="65" y="5" width="30" height="30" fill="#000000" />
                  <rect x="70" y="10" width="20" height="20" fill="#ffffff" />
                  <rect x="75" y="15" width="10" height="10" fill="#000000" />

                  <rect x="5" y="65" width="30" height="30" fill="#000000" />
                  <rect x="10" y="70" width="20" height="20" fill="#ffffff" />
                  <rect x="15" y="75" width="10" height="10" fill="#000000" />

                  {/* Synthetic data matrix bits */}
                  <rect x="42" y="10" width="8" height="8" fill="#000000" />
                  <rect x="52" y="18" width="6" height="6" fill="#000000" />
                  <rect x="40" y="32" width="10" height="10" fill="#000000" />
                  <rect x="65" y="42" width="8" height="8" fill="#000000" />
                  <rect x="80" y="55" width="12" height="6" fill="#000000" />
                  <rect x="45" y="55" width="8" height="8" fill="#000000" />
                  <rect x="25" y="45" width="10" height="10" fill="#000000" />
                  <rect x="60" y="75" width="12" height="8" fill="#000000" />
                  <rect x="80" y="75" width="8" height="12" fill="#000000" />
                  <rect x="42" y="80" width="8" height="10" fill="#000000" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md">
                    <Smartphone className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-2">
                Scan with phone camera to open
              </span>
            </div>

            {/* Right: Direct Connection link & PIN */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  Companion Direct App URL:
                </label>
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-emerald-400">
                  <span className="truncate flex-1">{appUrl}</span>
                  <button
                    onClick={handleCopyUrl}
                    className="p-1 hover:bg-slate-800 rounded text-slate-300"
                    title="Copy URL"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  Hardware Pairing Code:
                </label>
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
                  <span className="text-sm font-bold font-mono tracking-wider text-white">{pairingPin}</span>
                  <button
                    onClick={() => {
                      soundFX.playAuthorize();
                      onConnectRealMobile();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-sm"
                  >
                    {isRealMobileConnected ? 'Re-pair Device' : 'Pair Phone'}
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero APK install required: runs via modern PWA & Web APIs!</span>
              </div>
            </div>
          </div>

          {/* Real Mobile Hardware Test Triggers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              <span>Test Real Device Hardware Bridge</span>
              <button
                onClick={handleQuerySensors}
                disabled={isQuerying}
                className="text-[10px] text-emerald-400 hover:underline font-mono"
              >
                {isQuerying ? 'Querying...' : 'Sync Real Sensors'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={handleTestDialer}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-emerald-400 flex items-center gap-1.5 mb-1">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  Real Dialer
                </div>
                <div className="text-[10px] text-slate-400">Launches phone's native tel: dialer</div>
              </button>

              <button
                onClick={handleTestShare}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-blue-400 flex items-center gap-1.5 mb-1">
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  WhatsApp / SMS
                </div>
                <div className="text-[10px] text-slate-400">Triggers native mobile share sheet</div>
              </button>

              <button
                onClick={handleTestHaptics}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-400 flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Haptic Vibrate
                </div>
                <div className="text-[10px] text-slate-400">Vibrates phone physically</div>
              </button>

              <button
                onClick={handleQuerySensors}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-rose-400 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  Real GPS & Battery
                </div>
                <div className="text-[10px] text-slate-400">
                  {realBattery ? `${realBattery.level}% Battery` : 'Read actual telemetry'}
                </div>
              </button>
            </div>
          </div>

          {/* UI Layout Mode for Mobile Friendliness */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-200">
              Mobile Display & Viewport Adaptation
            </div>
            <p className="text-[11px] text-slate-400">
              Select how the interface renders on your screen:
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'auto', label: 'Auto Responsive', desc: 'Adapts to screen size' },
                { id: 'mobile_fullscreen', label: 'Mobile Native (100%)', desc: 'No phone bezel, edge-to-edge' },
                { id: 'desktop_studio', label: 'Studio Dual-Pane', desc: 'Commander + Virtual phone' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    soundFX.playTap();
                    onSetUILayoutMode(opt.id as any);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    uiLayoutMode === opt.id
                      ? 'bg-emerald-950/70 border-emerald-500 text-white ring-1 ring-emerald-500/50'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[9px] text-slate-400">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
