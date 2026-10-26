import React from 'react';
import { Phone, MessageSquare, Terminal, Globe, Camera, Folder, Settings, ShieldCheck, Cpu, CloudSun } from 'lucide-react';
import { soundFX } from '../../services/audioEffects';

interface HomeScreenProps {
  onOpenApp: (appName: string) => void;
  activeTaskCount: number;
  batteryLevel: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenApp, activeTaskCount, batteryLevel }) => {
  const currentTime = new Date();
  const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  const appIcons = [
    { name: 'Phone', icon: Phone, color: 'bg-emerald-600', badge: '1' },
    { name: 'Messages', icon: MessageSquare, color: 'bg-blue-600', badge: '2' },
    { name: 'CodeTerminal', label: 'Code IDE', icon: Terminal, color: 'bg-purple-600' },
    { name: 'Browser', label: 'Browser', icon: Globe, color: 'bg-amber-600' },
    { name: 'Camera', icon: Camera, color: 'bg-rose-600' },
    { name: 'Files', icon: Folder, color: 'bg-indigo-600' },
    { name: 'Settings', icon: Settings, color: 'bg-slate-700' },
    { name: 'WhatsApp', icon: MessageSquare, color: 'bg-emerald-500' },
  ];

  const handleLaunch = (appName: string) => {
    soundFX.playTap();
    onOpenApp(appName);
  };

  return (
    <div className="flex flex-col h-full justify-between p-4 bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white select-none relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Widgets */}
      <div className="pt-2 z-10 space-y-3">
        {/* Clock & Weather Widget */}
        <div className="text-center pt-2">
          <div className="text-5xl font-light tracking-tight text-white font-mono">{timeStr}</div>
          <div className="text-xs text-slate-300 font-medium mt-1 flex items-center justify-center gap-2">
            <span>{dateStr}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-300">
              <CloudSun className="w-3.5 h-3.5" /> 72°F Sunny
            </span>
          </div>
        </div>

        {/* Aegis AI Core Status Widget */}
        <div
          onClick={() => handleLaunch('Settings')}
          className="mx-1 p-3 rounded-2xl bg-slate-900/80 backdrop-blur border border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer transition-all shadow-lg shadow-black/40"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-white tracking-wide">Aegis AI Mobile Core</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40">
              Permission Guard Active
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-800/80 font-mono">
            <span>Full Root Access: <strong className="text-emerald-400">Granted</strong></span>
            <span>Policy: <strong className="text-amber-400">Ask Everything</strong></span>
          </div>

          {activeTaskCount > 0 && (
            <div className="mt-2 text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-1 rounded-lg border border-emerald-700/50 flex items-center justify-between">
              <span>{activeTaskCount} automation action(s) in queue</span>
              <span className="animate-pulse">Active</span>
            </div>
          )}
        </div>
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-4 gap-y-4 gap-x-2 px-2 z-10 my-auto">
        {appIcons.map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={app.name}
              onClick={() => handleLaunch(app.name)}
              className="flex flex-col items-center group active:scale-95 transition-transform"
            >
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-2xl ${app.color} text-white flex items-center justify-center shadow-md shadow-black/50 group-hover:brightness-110 transition-all border border-white/10`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                {app.badge && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                    {app.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-200 mt-1.5 font-medium tracking-tight">
                {app.label || app.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Dock */}
      <div className="z-10 pb-2">
        <div className="mx-2 p-2.5 rounded-3xl bg-slate-900/70 backdrop-blur-md border border-slate-800/80 flex items-center justify-around shadow-xl">
          {[
            { name: 'Phone', icon: Phone, color: 'bg-emerald-600' },
            { name: 'Messages', icon: MessageSquare, color: 'bg-blue-600' },
            { name: 'Browser', icon: Globe, color: 'bg-amber-600' },
            { name: 'Camera', icon: Camera, color: 'bg-rose-600' },
          ].map((dockItem) => {
            const Icon = dockItem.icon;
            return (
              <button
                key={dockItem.name}
                onClick={() => handleLaunch(dockItem.name)}
                className={`w-12 h-12 rounded-2xl ${dockItem.color} flex items-center justify-center text-white shadow-md active:scale-90 transition-transform`}
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
