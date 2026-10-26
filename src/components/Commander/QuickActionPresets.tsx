import React from 'react';
import { Phone, MessageSquare, Terminal, Globe, Camera, Settings, Folder, Sparkles, Bluetooth } from 'lucide-react';
import { soundFX } from '../../services/audioEffects';

interface QuickActionPresetsProps {
  onSelectPreset: (promptText: string) => void;
  onOpenBluetoothModal?: () => void;
}

const PRESETS = [
  {
    category: 'Bluetooth Link',
    icon: Bluetooth,
    color: 'hover:border-cyan-500/60 text-cyan-400',
    title: 'Pair Bluetooth Mobile',
    prompt: 'Connect to my mobile phone via Bluetooth link and synchronize root permissions',
  },
  {
    category: 'Calling',
    icon: Phone,
    color: 'hover:border-emerald-500/60 text-emerald-400',
    title: 'Call Mom',
    prompt: "Call Mom on speakerphone and let her know I'll be 15 minutes late for dinner",
  },
  {
    category: 'Messaging',
    icon: MessageSquare,
    color: 'hover:border-blue-500/60 text-blue-400',
    title: 'WhatsApp Sarah',
    prompt: 'Send WhatsApp message to Sarah Connor: "Aegis security audit passed with 100% human verification!"',
  },
  {
    category: 'Coding',
    icon: Terminal,
    color: 'hover:border-purple-500/60 text-purple-400',
    title: 'Run Python Script',
    prompt: 'Write and run a Python script to scan device environment, memory runway, and process status',
  },
  {
    category: 'Browsing',
    icon: Globe,
    color: 'hover:border-amber-500/60 text-amber-400',
    title: 'Browse AI News',
    prompt: 'Open web browser, search for "Gemini 3.8 Flash mobile autonomous capabilities" and extract key points',
  },
  {
    category: 'Camera / Vision',
    icon: Camera,
    color: 'hover:border-rose-500/60 text-rose-400',
    title: 'Camera Scan',
    prompt: 'Activate high-res camera sensor, snap frame of the receipt and extract total sum and tax',
  },
  {
    category: 'Settings / Hardware',
    icon: Settings,
    color: 'hover:border-slate-400/60 text-slate-300',
    title: 'Configure Radios',
    prompt: 'Turn on 5G Ultra-Wideband cellular and enable GPS location for high-precision navigation',
  },
  {
    category: 'Multi-lingual',
    icon: Sparkles,
    color: 'hover:border-teal-500/60 text-teal-400',
    title: 'Hindi (हिन्दी)',
    prompt: 'मेरी माँ को कॉल लगाओ और स्पीकरफोन चालू करो',
  },
  {
    category: 'Multi-lingual',
    icon: Sparkles,
    color: 'hover:border-indigo-500/60 text-indigo-400',
    title: 'Spanish (Español)',
    prompt: 'Busca en la web las últimas noticias de inteligencia artificial y haz un resumen',
  },
];

export const QuickActionPresets: React.FC<QuickActionPresetsProps> = ({ onSelectPreset }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Autonomous Command Presets
        </span>
        <span className="text-[10px] text-slate-500 font-mono">1-Click Fast Triggers</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PRESETS.map((p, idx) => {
          const Icon = p.icon;
          return (
            <button
              key={idx}
              onClick={() => {
                soundFX.playTap();
                onSelectPreset(p.prompt);
              }}
              className={`p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90 ${p.color} text-left transition-all hover:bg-slate-800/80 active:scale-95 group shadow-sm min-w-0 overflow-hidden`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono text-slate-400 uppercase">{p.category}</span>
              </div>
              <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                {p.title}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-mono">
                {p.prompt}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
