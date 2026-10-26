import React from 'react';
import { Cpu, Zap, Brain, Sparkles, Check, X, Sliders, ShieldCheck, Activity } from 'lucide-react';
import { AIModelBrainConfig, AIModelBrainId } from '../../types';
import { soundFX } from '../../services/audioEffects';

interface AIBrainModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBrainId: AIModelBrainId;
  onSelectBrain: (brainId: AIModelBrainId) => void;
  temperature: number;
  onUpdateTemperature: (temp: number) => void;
}

export const AI_BRAIN_MODELS: AIModelBrainConfig[] = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    tagline: 'Flagship Multimodal Autonomous Mobile Agent',
    badge: 'RECOMMENDED • FAST',
    color: 'from-emerald-600 to-teal-500',
    latencyRating: 'Fast (200-500ms)',
    reasoningLevel: 'High',
    supportedModalities: ['Text (Any Language)', 'Speech / Audio', 'Images / Vision', 'Code & Terminal', 'Files & Docs'],
    description: 'Premier production model for high-throughput multimodal mobile action planning, permission verification, and real-time execution.',
  },
  {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    tagline: 'Deep STEM & Complex Reasoning Super-Brain',
    badge: 'ADVANCED CODING & MATH',
    color: 'from-purple-600 to-indigo-500',
    latencyRating: 'Deep Reasoning (1-3s)',
    reasoningLevel: 'Deep Thinking',
    supportedModalities: ['Advanced Python/JS Generation', 'System Architecture', 'Complex Workflow Chains'],
    description: 'Elite reasoning core optimized for multi-step script generation, complex system debugging, and multi-app orchestration.',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    tagline: 'Ultra-Low Latency Mobile Edge Engine',
    badge: 'LOW LATENCY • BATTERY EFFICIENT',
    color: 'from-amber-500 to-orange-500',
    latencyRating: 'Ultra-Fast (0-150ms)',
    reasoningLevel: 'Medium',
    supportedModalities: ['Fast Voice Commands', 'Quick Dialing / Messaging', 'Micro-Automation'],
    description: 'Optimized for instant mobile reflexes, lightweight query decomposition, and minimal battery consumption.',
  },
  {
    id: 'local-npu',
    name: 'Local Neural NPU Brain',
    tagline: '0ms On-Device Edge Classifier',
    badge: 'OFFLINE • PRIVATE',
    color: 'from-blue-600 to-cyan-500',
    latencyRating: 'Instant (0ms Offline)',
    reasoningLevel: 'Low',
    supportedModalities: ['Rule Heuristics', 'Zero Network Latency', '100% On-Device Privacy'],
    description: 'Instantaneous heuristic classifier executing directly within the browser runtime with zero cloud API dependency.',
  },
];

export const AIBrainModal: React.FC<AIBrainModalProps> = ({
  isOpen,
  onClose,
  activeBrainId,
  onSelectBrain,
  temperature,
  onUpdateTemperature,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-black">
              <Brain className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>AI Brain Center & Neural Multi-Model Core</span>
              </h2>
              <p className="text-xs text-slate-400">
                Switch model intelligence engines or route specialized tasks across frontier LLMs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Model Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Available Intelligence Engines (4 Models Configured)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {AI_BRAIN_MODELS.map((model) => {
              const isSelected = activeBrainId === model.id;
              return (
                <div
                  key={model.id}
                  onClick={() => {
                    soundFX.playTap();
                    onSelectBrain(model.id);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-950 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${model.color} flex items-center justify-center text-white shadow-sm`}>
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">{model.name}</h3>
                          <span className="text-[10px] font-mono text-slate-400">{model.latencyRating}</span>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-md shadow-emerald-500/30">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-700" />
                      )}
                    </div>

                    <div className="text-[10px] font-mono font-bold text-emerald-400 mb-2">
                      {model.badge}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {model.description}
                    </p>
                  </div>

                  {/* Modalities pills */}
                  <div className="pt-2 border-t border-slate-900 flex flex-wrap gap-1">
                    {model.supportedModalities.map((mod, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hyperparameters Configuration */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                Inference Temperature & Reasoning Depth
              </span>
              <span className="font-mono text-emerald-400 font-bold">{temperature}</span>
            </div>

            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => onUpdateTemperature(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.0 (Strict / Deterministic)</span>
              <span>0.5 (Balanced Automation)</span>
              <span>1.0 (Creative Exploratory)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Active Brain: <strong className="text-white">{AI_BRAIN_MODELS.find((m) => m.id === activeBrainId)?.name}</strong>
          </div>

          <button
            onClick={() => {
              soundFX.playAuthorize();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            Apply Active Brain
          </button>
        </div>
      </div>
    </div>
  );
};
