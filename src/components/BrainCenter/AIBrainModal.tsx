import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  Brain,
  Sparkles,
  Check,
  X,
  Sliders,
  ShieldCheck,
  Activity,
  Layers,
  Search,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { AIModelBrainConfig, AIModelBrainId, AIModelProvider } from '../../types';
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
  // --- Google Gemini Suite ---
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    tagline: 'Flagship Multimodal Autonomous Mobile Agent',
    badge: 'RECOMMENDED • FAST',
    color: 'from-emerald-500 to-teal-400',
    latencyRating: 'Fast (150-400ms)',
    reasoningLevel: 'High',
    supportedModalities: ['Live Vision / Screen', 'Voice & Audio', 'Multi-Language', 'Root Actions', 'JSON Tool Calling'],
    description: 'Premier production model for high-throughput multimodal mobile action planning, permission verification, and real-time execution.',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    tagline: 'Deep STEM & Complex System Architecture Brain',
    badge: 'DEEP THINKING • 2M CONTEXT',
    color: 'from-teal-600 to-emerald-700',
    latencyRating: 'Deep Reasoning (1-3s)',
    reasoningLevel: 'Deep Thinking',
    supportedModalities: ['Complex Script Synthesis', 'Full APK / Code Analysis', 'Multi-App Workflow Chains'],
    description: 'Elite deep-reasoning core designed for intricate system debugging, multi-step orchestration, and rigorous safety checks.',
  },
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash-Lite',
    provider: 'Google',
    tagline: 'Ultra-Low Latency Mobile Edge Engine',
    badge: 'BATTERY EFFICIENT • 0-150MS',
    color: 'from-cyan-500 to-blue-500',
    latencyRating: 'Ultra-Fast (0-150ms)',
    reasoningLevel: 'Medium',
    supportedModalities: ['Instant Dial / SMS', 'Quick Voice Reflexes', 'Battery Saver Mode'],
    description: 'Optimized for instant mobile reflexes, lightweight query decomposition, and minimal mobile battery consumption.',
  },
  {
    id: 'gemini-2.0-thinking',
    name: 'Gemini 2.0 Flash Thinking',
    provider: 'Google',
    tagline: 'Visible Chain-of-Thought Permission Auditor',
    badge: 'STEP-BY-STEP REASONING',
    color: 'from-sky-500 to-indigo-500',
    latencyRating: 'Deep Reasoning (1-3s)',
    reasoningLevel: 'Deep Thinking',
    supportedModalities: ['Visible Thought Chains', 'Security Policy Audit', 'Contradiction Detection'],
    description: 'Generates transparent reasoning traces explaining exactly why each mobile permission is requested before acting.',
  },

  // --- OpenAI Suite ---
  {
    id: 'gpt-4.5-omni',
    name: 'GPT-4.5 / GPT-4o Omni',
    provider: 'OpenAI',
    tagline: 'Frontier Cross-Platform Multimodal Intelligence',
    badge: 'OPENAI VISION & AUDIO',
    color: 'from-green-600 to-emerald-500',
    latencyRating: 'Fast (150-400ms)',
    reasoningLevel: 'High',
    supportedModalities: ['Visual OCR & Screen Inspection', 'Natural Conversation', 'App UI Automation'],
    description: 'High-acuity multimodal engine with strong visual screen understanding and natural conversational tone in any language.',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    tagline: 'High-Efficiency Micro-Action Dispatcher',
    badge: 'RAPID DISPATCH',
    color: 'from-emerald-600 to-green-700',
    latencyRating: 'Ultra-Fast (0-150ms)',
    reasoningLevel: 'Medium',
    supportedModalities: ['Quick Intent Classification', 'Call / SMS Routing', 'Low Token Cost'],
    description: 'Ultra-compact model for instantaneous mobile action classification, contact lookups, and fast draft responses.',
  },
  {
    id: 'o3-mini',
    name: 'OpenAI o3-mini Reasoning',
    provider: 'OpenAI',
    tagline: 'STEM & Algorithmic Code Solver Core',
    badge: 'REASONING & CODE',
    color: 'from-emerald-700 to-teal-800',
    latencyRating: 'Deep Reasoning (1-3s)',
    reasoningLevel: 'Deep Thinking',
    supportedModalities: ['Complex Bash/JS Scripts', 'Mathematical Logic', 'Bug Diagnostics'],
    description: 'Specialized reasoning model that methodically plans complex mobile script generation and root-level commands.',
  },

  // --- Anthropic Claude Suite ---
  {
    id: 'claude-3.7-sonnet',
    name: 'Claude 3.7 Sonnet (Hybrid)',
    provider: 'Anthropic',
    tagline: 'Hybrid Fast & Extended Reasoning Architecture',
    badge: 'STATE-OF-THE-ART CODING',
    color: 'from-amber-600 to-orange-500',
    latencyRating: 'Fast (150-400ms)',
    reasoningLevel: 'Deep Thinking',
    supportedModalities: ['Precise Tool Planning', 'High-Fidelity Code', 'Nuanced Safety Alignment'],
    description: 'Anthropic’s leading hybrid model balancing lightning-fast responses with deep extended thinking for system-level automation.',
  },
  {
    id: 'claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    tagline: 'Lightning Mobile Reflexes & Action Synthesis',
    badge: 'SUB-SECOND DISPATCH',
    color: 'from-amber-500 to-yellow-600',
    latencyRating: 'Ultra-Fast (0-150ms)',
    reasoningLevel: 'Medium',
    supportedModalities: ['Fast Language Translation', 'Quick Summaries', 'Instant Confirmation'],
    description: 'Incredible speed with human-like responsiveness, perfect for voice-driven mobile task triggering.',
  },

  // --- DeepSeek Suite ---
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1 (Open Reasoning)',
    provider: 'DeepSeek',
    tagline: 'Open-Weights Frontier Mathematical & Logic Engine',
    badge: 'DEEP LOGIC & MATH',
    color: 'from-blue-600 to-indigo-600',
    latencyRating: 'Deep Reasoning (1-3s)',
    reasoningLevel: 'Deep Thinking',
    supportedModalities: ['Self-Correcting Reasoning', 'Complex Problem Solving', 'Open Knowledge'],
    description: 'Uncompromising open reasoning engine that breaks down complex mobile automation tasks into provably safe sequences.',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek-V3 (671B MoE)',
    provider: 'DeepSeek',
    tagline: 'High-Throughput Multi-Tasking Mixture-of-Experts',
    badge: '671B MOE ARCHITECTURE',
    color: 'from-indigo-600 to-purple-600',
    latencyRating: 'Fast (150-400ms)',
    reasoningLevel: 'High',
    supportedModalities: ['Polyglot Understanding', 'Fast Code Generation', 'General Mobile Tasks'],
    description: 'Massive MoE model delivering frontier intelligence at lightning speed across international languages and diverse actions.',
  },

  // --- Meta Llama Suite ---
  {
    id: 'llama-3.3-70b',
    name: 'Meta Llama 3.3 70B',
    provider: 'Meta',
    tagline: 'High-Performance Open-Source Frontier Brain',
    badge: 'OPEN SOURCE CHAMPION',
    color: 'from-blue-500 to-sky-400',
    latencyRating: 'Fast (150-400ms)',
    reasoningLevel: 'High',
    supportedModalities: ['Open Architecture', 'Local Adaptability', 'Tool Use & Function Calling'],
    description: 'Meta’s state-of-the-art open intelligence model powering private, auditable, and unconstrained device automation.',
  },

  // --- Consensus / Hive Mind ---
  {
    id: 'hive-consensus',
    name: 'Omni Hive Mind (Multi-Brain Consensus)',
    provider: 'Consensus Hive',
    tagline: 'Triple-Brain Cross-Validation for Sensitive Root Actions',
    badge: 'SUPER-BRAIN • MAXIMUM SAFETY',
    color: 'from-purple-600 via-pink-600 to-rose-500',
    latencyRating: 'Deep Reasoning (1-3s)',
    reasoningLevel: 'Consensus Multi-Model',
    supportedModalities: ['Gemini + Claude + GPT Cross-Check', 'Zero Hallucination Shield', 'High-Risk Guard'],
    description: 'Runs user directives through multiple frontier models simultaneously to cross-validate permissions and prevent errors.',
  },

  // --- Local / Offline NPU ---
  {
    id: 'local-npu',
    name: 'Local Neural NPU Brain',
    provider: 'On-Device Edge',
    tagline: '0ms On-Device Edge Classifier & Heuristic Core',
    badge: 'OFFLINE • 100% PRIVATE',
    color: 'from-slate-600 to-slate-800',
    latencyRating: 'Instant (0ms Offline)',
    reasoningLevel: 'Low',
    supportedModalities: ['Rule Heuristics', 'Zero Network Latency', '100% On-Device Privacy'],
    description: 'Instantaneous heuristic classifier executing directly within the device browser runtime with zero cloud API dependency.',
  },
];

const PROVIDERS: { label: string; value: string }[] = [
  { label: 'All Models (14)', value: 'all' },
  { label: 'Google', value: 'Google' },
  { label: 'OpenAI', value: 'OpenAI' },
  { label: 'Anthropic', value: 'Anthropic' },
  { label: 'DeepSeek', value: 'DeepSeek' },
  { label: 'Meta', value: 'Meta' },
  { label: 'Consensus Hive', value: 'Consensus Hive' },
  { label: 'On-Device', value: 'On-Device Edge' },
];

export const AIBrainModal: React.FC<AIBrainModalProps> = ({
  isOpen,
  onClose,
  activeBrainId,
  onSelectBrain,
  temperature,
  onUpdateTemperature,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const filteredModels = AI_BRAIN_MODELS.filter((m) => {
    const matchesProvider = selectedProvider === 'all' || m.provider === selectedProvider;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProvider && matchesSearch;
  });

  const activeModel = AI_BRAIN_MODELS.find((m) => m.id === activeBrainId) || AI_BRAIN_MODELS[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 text-black shadow-lg shadow-emerald-500/20">
              <Brain className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>AI Brain Center & Frontier Multi-Model Core</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono">
                  14 Models Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Switch model intelligence engines or route specialized mobile automation tasks across frontier LLMs
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

        {/* Filter and Search Bar */}
        <div className="px-5 sm:px-6 py-3 border-b border-slate-800/80 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Provider Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {PROVIDERS.map((prov) => (
              <button
                key={prov.value}
                onClick={() => {
                  soundFX.playTap();
                  setSelectedProvider(prov.value);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all ${
                  selectedProvider === prov.value
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-bold'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
              >
                {prov.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search model, provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Model Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredModels.map((model) => {
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
                      ? 'bg-slate-950 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/60'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                  }`}
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${model.color} flex items-center justify-center text-white shadow-sm flex-shrink-0 font-bold text-xs`}
                        >
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-white">{model.name}</h3>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {model.provider}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400">{model.latencyRating}</span>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-md shadow-emerald-500/30 flex-shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-700 flex-shrink-0" />
                      )}
                    </div>

                    <div className="text-[10px] font-mono font-bold text-slate-400 mb-1.5">
                      {model.tagline}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {model.description}
                    </p>
                  </div>

                  {/* Modalities pills & badge */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-teal-400">
                        {model.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Reasoning: <strong className="text-slate-200">{model.reasoningLevel}</strong>
                      </span>
                    </div>
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
              <span>0.0 (Strict / Safe Device Permission Checks)</span>
              <span>0.2 (Balanced Mobile Automation)</span>
              <span>1.0 (Creative Scripting)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Active Model Brain:</span>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold">
              {activeModel.name} ({activeModel.provider})
            </span>
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
