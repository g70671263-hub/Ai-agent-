import React from 'react';
import { Settings, Wifi, Bluetooth, Radio, Plane, Zap, MapPin, Moon, Sun, Volume2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { soundFX } from '../../services/audioEffects';
import { DeviceSettings } from '../../types';

interface SettingsAppProps {
  settings: DeviceSettings;
  onUpdateSettings: (updater: (prev: DeviceSettings) => DeviceSettings) => void;
  killSwitchActive: boolean;
  onToggleKillSwitch: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  settings,
  onUpdateSettings,
  killSwitchActive,
  onToggleKillSwitch,
}) => {
  const toggle = (key: keyof DeviceSettings) => {
    soundFX.playTap();
    onUpdateSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white select-none">
      {/* Top Header */}
      <div className="px-4 pt-3 pb-2 border-b border-slate-800 flex items-center justify-between">
        <h1 className="text-base font-semibold text-slate-200 flex items-center gap-2">
          <Settings className="w-4 h-4 text-emerald-400" />
          Device Settings
        </h1>
        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800/40">
          Android 15 OS
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Aegis AI Security Core Banner */}
        <div className={`p-3 rounded-2xl border transition-colors ${
          killSwitchActive
            ? 'bg-rose-950/60 border-rose-500/80 text-rose-200'
            : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 font-semibold text-xs">
              {killSwitchActive ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
              <span>Aegis Root Permission Guard</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 border border-white/10">
              {killSwitchActive ? 'LOCKED / SUSPENDED' : 'ENFORCED'}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">
            Full root device automation granted with 100% mandatory Human-in-the-Loop permission verification before any action executes.
          </p>
          <button
            onClick={onToggleKillSwitch}
            className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              killSwitchActive
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
            }`}
          >
            {killSwitchActive ? 'Resume Automation Agent' : 'Emergency Kill Switch (Block All Actions)'}
          </button>
        </div>

        {/* Quick Toggles Grid */}
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 px-1">
            Hardware Radios & Connectivity
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'wifi', label: 'Wi-Fi 6E', icon: Wifi, value: settings.wifi },
              { key: 'bluetooth', label: 'Bluetooth 5.4', icon: Bluetooth, value: settings.bluetooth },
              { key: 'cellular5G', label: '5G Ultra-WB', icon: Radio, value: settings.cellular5G },
              { key: 'airplaneMode', label: 'Airplane Mode', icon: Plane, value: settings.airplaneMode },
              { key: 'locationGps', label: 'GPS Location', icon: MapPin, value: settings.locationGps },
              { key: 'flashlight', label: 'Flashlight LED', icon: Zap, value: settings.flashlight },
              { key: 'batterySaver', label: 'Battery Saver', icon: Zap, value: settings.batterySaver },
              { key: 'doNotDisturb', label: 'Do Not Disturb', icon: Moon, value: settings.doNotDisturb },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => toggle(item.key as keyof DeviceSettings)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                    item.value
                      ? 'bg-emerald-950/70 border-emerald-500/60 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${item.value ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-mono ${item.value ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    {item.value ? 'ON' : 'OFF'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders: Brightness & Volume */}
        <div className="space-y-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Screen Brightness
              </span>
              <span className="font-mono text-[11px] text-slate-400">{settings.brightness}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={settings.brightness}
              onChange={(e) =>
                onUpdateSettings((prev) => ({ ...prev, brightness: Number(e.target.value) }))
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-blue-400" /> Master Volume
              </span>
              <span className="font-mono text-[11px] text-slate-400">{settings.volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.volume}
              onChange={(e) =>
                onUpdateSettings((prev) => ({ ...prev, volume: Number(e.target.value) }))
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
