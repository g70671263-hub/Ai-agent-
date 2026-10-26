import React from 'react';
import { Wifi, BatteryMedium, Signal, ChevronLeft, Home } from 'lucide-react';
import { HomeScreen } from './HomeScreen';
import { PhoneApp } from './PhoneApp';
import { MessagesApp } from './MessagesApp';
import { CodeTerminalApp } from './CodeTerminalApp';
import { BrowserApp } from './BrowserApp';
import { CameraApp } from './CameraApp';
import { FilesApp } from './FilesApp';
import { SettingsApp } from './SettingsApp';
import { DeviceSettings } from '../../types';
import { soundFX } from '../../services/audioEffects';

interface PhoneFrameProps {
  activeApp: string; // 'Home' | 'Phone' | 'Messages' | 'CodeTerminal' | 'Browser' | 'Camera' | 'Files' | 'Settings' | 'WhatsApp'
  onSetActiveApp: (appName: string) => void;
  deviceSettings: DeviceSettings;
  onUpdateDeviceSettings: (updater: (prev: DeviceSettings) => DeviceSettings) => void;
  killSwitchActive: boolean;
  onToggleKillSwitch: () => void;
  pendingPermissionCount: number;
  initialCallPayload?: any;
  onClearInitialCall?: () => void;
  initialDraftPayload?: any;
  onClearInitialDraft?: () => void;
  initialCodePayload?: any;
  onClearInitialCode?: () => void;
  initialBrowsePayload?: any;
  onClearInitialBrowse?: () => void;
  isNativeMobileMode?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  activeApp,
  onSetActiveApp,
  deviceSettings,
  onUpdateDeviceSettings,
  killSwitchActive,
  onToggleKillSwitch,
  pendingPermissionCount,
  initialCallPayload,
  onClearInitialCall,
  initialDraftPayload,
  onClearInitialDraft,
  initialCodePayload,
  onClearInitialCode,
  initialBrowsePayload,
  onClearInitialBrowse,
  isNativeMobileMode = false,
}) => {
  const currentTime = new Date();
  const timeFormatted = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const renderActiveApp = () => {
    switch (activeApp) {
      case 'Phone':
        return <PhoneApp initialCallPayload={initialCallPayload} onClearInitialCall={onClearInitialCall} />;
      case 'Messages':
      case 'WhatsApp':
        return <MessagesApp initialDraftPayload={initialDraftPayload} onClearInitialDraft={onClearInitialDraft} />;
      case 'CodeTerminal':
        return <CodeTerminalApp initialCodePayload={initialCodePayload} onClearInitialCode={onClearInitialCode} />;
      case 'Browser':
        return <BrowserApp initialBrowsePayload={initialBrowsePayload} onClearInitialBrowse={onClearInitialBrowse} />;
      case 'Camera':
        return <CameraApp />;
      case 'Files':
        return <FilesApp />;
      case 'Settings':
        return (
          <SettingsApp
            settings={deviceSettings}
            onUpdateSettings={onUpdateDeviceSettings}
            killSwitchActive={killSwitchActive}
            onToggleKillSwitch={onToggleKillSwitch}
          />
        );
      case 'Home':
      default:
        return (
          <HomeScreen
            onOpenApp={onSetActiveApp}
            activeTaskCount={pendingPermissionCount}
            batteryLevel={deviceSettings.batteryLevel}
          />
        );
    }
  };

  const handleHomeClick = () => {
    soundFX.playTap();
    onSetActiveApp('Home');
  };

  // If in native mobile mode, render edge-to-edge without hardware bezel
  if (isNativeMobileMode) {
    return (
      <div className="w-full h-[calc(100vh-140px)] min-h-[520px] max-w-full sm:max-w-md mx-auto bg-black rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col border border-slate-800 shadow-2xl relative">
        {/* Status Bar */}
        <div className="h-10 px-4 sm:px-5 pt-2 flex items-center justify-between text-xs text-slate-300 font-medium z-30 bg-black/60 backdrop-blur-sm select-none">
          <span className="font-mono text-[11px] font-semibold">{timeFormatted}</span>
          <div
            onClick={() => pendingPermissionCount > 0 && soundFX.playAlert()}
            className="h-6 px-2.5 sm:px-3 bg-black border border-slate-800 rounded-full flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <div className="w-2 rounded-full bg-emerald-500 animate-pulse h-2" />
            <span className="text-[10px] font-mono text-emerald-400">
              {pendingPermissionCount > 0 ? `${pendingPermissionCount} Alert` : 'Aegis Mobile'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            {deviceSettings.cellular5G && <Signal className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />}
            {deviceSettings.wifi && <Wifi className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />}
            <div className="flex items-center gap-0.5 font-mono text-[10px]">
              <span>{deviceSettings.batteryLevel}%</span>
              <BatteryMedium className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Screen */}
        <div className="flex-1 relative overflow-hidden bg-slate-950">
          {renderActiveApp()}
        </div>

        {/* Home pill */}
        <div className="h-7 bg-black/90 flex items-center justify-center relative z-30 border-t border-slate-900">
          <button
            onClick={handleHomeClick}
            className="w-28 sm:w-32 h-1.5 bg-slate-600 hover:bg-slate-400 rounded-full transition-colors active:scale-95"
            title="Home"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex items-center justify-center p-1 sm:p-2 w-full max-w-full overflow-hidden">
      {/* Physical phone bezel outer shell */}
      <div className="relative w-full max-w-[340px] sm:max-w-[380px] h-[680px] sm:h-[750px] bg-slate-900 rounded-[44px] sm:rounded-[50px] p-2.5 sm:p-3 shadow-2xl border-4 border-slate-700/80 shadow-emerald-950/20 ring-1 ring-slate-800">
        {/* Hardware side buttons - ONLY shown on tablet/desktop where there is margin */}
        <div className="hidden sm:block absolute -left-4.5 top-24 w-1.5 h-10 bg-slate-700 rounded-l-md cursor-pointer hover:bg-slate-600 active:scale-95 transition-all" title="Volume Up" />
        <div className="hidden sm:block absolute -left-4.5 top-38 w-1.5 h-10 bg-slate-700 rounded-l-md cursor-pointer hover:bg-slate-600 active:scale-95 transition-all" title="Volume Down" />
        <div className="hidden sm:block absolute -right-4.5 top-28 w-1.5 h-14 bg-slate-700 rounded-r-md cursor-pointer hover:bg-slate-600 active:scale-95 transition-all" title="Power / Lock Screen" />

        {/* Screen Bezel & Display */}
        <div className="relative w-full h-full bg-black rounded-[36px] sm:rounded-[42px] overflow-hidden flex flex-col border border-slate-800">
          {/* Top Status Bar & Dynamic Island */}
          <div className="h-10 px-4 sm:px-5 pt-2 flex items-center justify-between text-xs text-slate-300 font-medium z-30 bg-black/60 backdrop-blur-sm select-none">
            {/* Clock */}
            <span className="font-mono text-[11px] font-semibold">{timeFormatted}</span>

            {/* Dynamic Island Pill */}
            <div
              onClick={() => {
                if (pendingPermissionCount > 0) {
                  soundFX.playAlert();
                }
              }}
              className="h-6 px-3 bg-black border border-slate-800 rounded-full flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono text-emerald-400">
                {pendingPermissionCount > 0 ? `${pendingPermissionCount} Permission Alert` : 'Aegis OS'}
              </span>
            </div>

            {/* Connectivity Icons */}
            <div className="flex items-center gap-1.5 text-slate-400">
              {deviceSettings.cellular5G && <Signal className="w-3.5 h-3.5 text-emerald-400" />}
              {deviceSettings.wifi && <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
              <div className="flex items-center gap-0.5 font-mono text-[10px]">
                <span>{deviceSettings.batteryLevel}%</span>
                <BatteryMedium className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Active Screen Content */}
          <div className="flex-1 relative overflow-hidden bg-slate-950">
            {renderActiveApp()}
          </div>

          {/* Bottom Gestures Bar / Home Navigation Pill */}
          <div className="h-7 bg-black/90 flex items-center justify-center relative z-30 border-t border-slate-900">
            <button
              onClick={handleHomeClick}
              className="w-32 h-1.5 bg-slate-600 hover:bg-slate-400 rounded-full transition-colors active:scale-95"
              title="Swipe / Click for Home Screen"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
