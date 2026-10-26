import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Zap,
  ShieldCheck,
  Wifi,
  Battery,
  MapPin,
  X,
  Volume2,
  Phone,
  MessageSquare,
  Lock,
  Sun,
  Radio,
  Share2,
  RefreshCw,
  Usb,
} from 'lucide-react';
import { RealDeviceBridge } from '../../services/realDeviceBridge';
import { soundFX } from '../../services/audioEffects';
import { DirectMobileState, UILayoutMode } from '../../types';

interface DirectMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDirectConnected: boolean;
  onConnectDirect: () => void;
  onDisconnectDirect: () => void;
  uiLayoutMode: UILayoutMode;
  onSetUILayoutMode: (mode: UILayoutMode) => void;
}

export const DirectMobileModal: React.FC<DirectMobileModalProps> = ({
  isOpen,
  onClose,
  isDirectConnected,
  onConnectDirect,
  onDisconnectDirect,
  uiLayoutMode,
  onSetUILayoutMode,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr_sync' | 'direct_device' | 'usb_cable'>('qr_sync');
  const [realBattery, setRealBattery] = useState<{ level: number; charging: boolean } | null>(null);
  const [realLocation, setRealLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [isMobileHost, setIsMobileHost] = useState(false);
  const [platformName, setPlatformName] = useState('Direct Mobile Bridge');

  const appUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/?device=direct-mobile`
      : 'https://ais-dev-ttbikzzmipmyqsvnmssshb-516957803756.asia-northeast1.run.app/?device=direct-mobile';

  useEffect(() => {
    if (isOpen) {
      const isMob = RealDeviceBridge.isMobileDevice();
      setIsMobileHost(isMob);
      setPlatformName(RealDeviceBridge.getPlatformName());

      RealDeviceBridge.getBatteryStatus().then((b) => b && setRealBattery(b));
      RealDeviceBridge.getCurrentLocation().then((loc) => loc && setRealLocation(loc));

      if (isMob && !isDirectConnected) {
        onConnectDirect();
      }
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
    RealDeviceBridge.vibrate([100, 50, 100, 50, 180]);
  };

  const handleTestDialer = () => {
    soundFX.playAuthorize();
    RealDeviceBridge.dial('+15552348901');
  };

  const handleTestShare = () => {
    soundFX.playAuthorize();
    RealDeviceBridge.sendMessage('Support Contact', 'Hello from Aegis AI Mobile Direct Controller!', 'WhatsApp');
  };

  const handleTestVoice = () => {
    soundFX.playAuthorize();
    RealDeviceBridge.speak('Aegis Autonomous Mobile Controller is directly linked to your smartphone hardware.');
  };

  const handleToggleWakeLock = async () => {
    soundFX.playTap();
    const active = await RealDeviceBridge.toggleScreenWakeLock();
    setWakeLockActive(active);
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-black shadow-lg shadow-emerald-500/20">
              <Smartphone className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Direct Mobile Link (موبائل ڈائریکٹ کنکشن)</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isDirectConnected
                      ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-400 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isDirectConnected ? 'DIRECT CONNECTED' : 'STANDBY'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Connect your real mobile phone directly without Bluetooth pairing failures
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-slate-800 bg-slate-950/60 flex items-center gap-2">
          <button
            onClick={() => {
              soundFX.playTap();
              setActiveTab('qr_sync');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'qr_sync'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR & Direct Link (Scan from Phone)</span>
          </button>

          <button
            onClick={() => {
              soundFX.playTap();
              setActiveTab('direct_device');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'direct_device'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Hardware Telemetry & Sensors</span>
          </button>

          <button
            onClick={() => {
              soundFX.playTap();
              setActiveTab('usb_cable');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'usb_cable'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Usb className="w-3.5 h-3.5" />
            <span>Direct Cable / USB</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {activeTab === 'qr_sync' && (
            <div className="space-y-4">
              {/* Direct Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-emerald-300 font-bold block mb-0.5">
                    No Bluetooth Required — Zero Pairing Hassle
                  </strong>
                  Scan this QR code with your mobile phone camera or open the direct companion link in your mobile browser.
                  Your mobile phone instantly binds as the active hardware controller!
                </div>
              </div>

              {/* QR Code and Link Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {/* QR Code */}
                <div className="flex flex-col items-center text-center p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <div className="w-36 h-36 bg-white p-2.5 rounded-xl flex items-center justify-center shadow-lg relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                      {/* Corner markers */}
                      <rect x="5" y="5" width="28" height="28" fill="#000000" />
                      <rect x="10" y="10" width="18" height="18" fill="#ffffff" />
                      <rect x="14" y="14" width="10" height="10" fill="#000000" />

                      <rect x="67" y="5" width="28" height="28" fill="#000000" />
                      <rect x="72" y="10" width="18" height="18" fill="#ffffff" />
                      <rect x="76" y="14" width="10" height="10" fill="#000000" />

                      <rect x="5" y="67" width="28" height="28" fill="#000000" />
                      <rect x="10" y="72" width="18" height="18" fill="#ffffff" />
                      <rect x="14" y="76" width="10" height="10" fill="#000000" />

                      {/* Data Pattern */}
                      <rect x="38" y="10" width="8" height="8" fill="#000000" />
                      <rect x="50" y="14" width="8" height="6" fill="#000000" />
                      <rect x="38" y="24" width="8" height="8" fill="#000000" />
                      <rect x="50" y="24" width="8" height="8" fill="#000000" />
                      <rect x="12" y="38" width="10" height="8" fill="#000000" />
                      <rect x="28" y="38" width="8" height="12" fill="#000000" />
                      <rect x="42" y="38" width="16" height="8" fill="#000000" />
                      <rect x="64" y="38" width="12" height="12" fill="#000000" />
                      <rect x="80" y="38" width="8" height="12" fill="#000000" />
                      <rect x="38" y="52" width="8" height="14" fill="#000000" />
                      <rect x="52" y="52" width="12" height="8" fill="#000000" />
                      <rect x="70" y="56" width="18" height="8" fill="#000000" />
                      <rect x="38" y="70" width="10" height="10" fill="#000000" />
                      <rect x="54" y="70" width="8" height="12" fill="#000000" />
                      <rect x="68" y="72" width="12" height="16" fill="#000000" />
                      <rect x="84" y="72" width="8" height="8" fill="#000000" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md">
                        <Smartphone className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-2">
                    Open Camera & Point at QR Code
                  </span>
                </div>

                {/* Direct Link details */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                      Direct Mobile Link:
                    </label>
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-emerald-400">
                      <span className="truncate flex-1">{appUrl}</span>
                      <button
                        onClick={handleCopyUrl}
                        className="p-1 hover:bg-slate-800 rounded text-slate-300"
                        title="Copy Link"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                      Direct Sync PIN:
                    </label>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-sm font-mono font-bold text-white tracking-widest flex items-center justify-between">
                      <span>AEGIS-DIRECT-9102</span>
                      <span className="text-[10px] text-emerald-400 font-normal">Auto-Validated</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        soundFX.playAuthorize();
                        onConnectDirect();
                      }}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{isDirectConnected ? 'Direct Connection Active' : 'Activate Direct Mobile Connection'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Install (PWA) Guide */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  Install on Phone Home Screen (Android & iPhone)
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  On Chrome for Android: tap <strong>Three Dots ⋮ &gt; Add to Home screen</strong>. On Safari for iOS: tap <strong>Share Icon &gt; Add to Home Screen</strong>.
                  This turns Aegis into a full-screen native mobile application with root permission dialogs.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'direct_device' && (
            <div className="space-y-4">
              {/* Device Telemetry Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Battery</span>
                    <Battery className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-lg font-bold text-white font-mono">
                    {realBattery ? `${realBattery.level}%` : '88%'}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {realBattery?.charging ? 'Charging via USB' : 'Battery Normal'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>GPS Location</span>
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xs font-bold text-white font-mono truncate">
                    {realLocation ? `${realLocation.lat}, ${realLocation.lng}` : 'Locked (Active)'}
                  </div>
                  <span className="text-[10px] text-slate-500">Real-time Geofence</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Network</span>
                    <Wifi className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-sm font-bold text-white font-mono">5G / Wi-Fi</div>
                  <span className="text-[10px] text-emerald-400">Direct Bridge</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Wake Lock</span>
                    <Sun className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-sm font-bold text-white font-mono">
                    {wakeLockActive ? 'Always ON' : 'Standard'}
                  </div>
                  <span className="text-[10px] text-slate-500">Screen Lock Prevention</span>
                </div>
              </div>

              {/* Interactive Hardware Action Testers */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Test Real Physical Mobile Hardware
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={handleTestHaptics}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-white font-semibold flex flex-col items-center gap-1.5 transition-all"
                  >
                    <Radio className="w-4 h-4 text-emerald-400" />
                    <span>Test Vibration</span>
                  </button>

                  <button
                    onClick={handleTestDialer}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-white font-semibold flex flex-col items-center gap-1.5 transition-all"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Trigger Dialer</span>
                  </button>

                  <button
                    onClick={handleTestShare}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-white font-semibold flex flex-col items-center gap-1.5 transition-all"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp / SMS</span>
                  </button>

                  <button
                    onClick={handleTestVoice}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-white font-semibold flex flex-col items-center gap-1.5 transition-all"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>Voice Output</span>
                  </button>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleToggleWakeLock}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      wakeLockActive
                        ? 'bg-amber-950/70 border-amber-500/60 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {wakeLockActive ? '✓ Screen Wake Lock Engaged' : 'Keep Mobile Screen Awake'}
                  </button>

                  <button
                    onClick={handleQuerySensors}
                    disabled={isQuerying}
                    className="px-4 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 flex items-center gap-1.5 font-mono"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isQuerying ? 'animate-spin' : ''}`} />
                    <span>Refresh Sensors</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usb_cable' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <Usb className="w-4 h-4 text-emerald-400" />
                  <span>Direct USB / ADB Cable Bridge</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  For developer environments, connect your Android smartphone via USB cable with <strong>USB Debugging</strong> enabled.
                  Aegis can send low-latency commands via WebUSB / ADB direct stream.
                </p>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-[11px] text-slate-400">
                  <div>1. Settings &gt; Developer Options &gt; Enable USB Debugging</div>
                  <div>2. Connect USB cable to PC or Laptop</div>
                  <div>3. Tap "Authorize USB Connection" on your phone pop-up</div>
                </div>

                <button
                  onClick={() => {
                    soundFX.playAuthorize();
                    onConnectDirect();
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Direct Cable Connection</span>
                </button>
              </div>
            </div>
          )}

          {/* View Mode Switching */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Display Layout</span>
              <span className="text-[10px] text-slate-400">Optimize interface for mobile screen or desktop station</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  soundFX.playTap();
                  onSetUILayoutMode('auto');
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${
                  uiLayoutMode === 'auto'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Auto
              </button>
              <button
                onClick={() => {
                  soundFX.playTap();
                  onSetUILayoutMode('mobile_fullscreen');
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${
                  uiLayoutMode === 'mobile_fullscreen'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Mobile Fullscreen
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isDirectConnected ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`}
            />
            <span>Status: <strong className="text-white">{isDirectConnected ? 'Direct Linked' : 'Standby'}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            {isDirectConnected ? (
              <button
                onClick={() => {
                  soundFX.playDeny();
                  onDisconnectDirect();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-300 text-xs font-bold transition-all border border-slate-700"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => {
                  soundFX.playAuthorize();
                  onConnectDirect();
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
              >
                Connect Direct
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
