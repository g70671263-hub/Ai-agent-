import React, { useState, useEffect } from 'react';
import { Terminal, Play, RotateCcw, Copy, Check, FileCode, Cpu, Sparkles } from 'lucide-react';
import { soundFX } from '../../services/audioEffects';
import { executeCodeOnDevice } from '../../services/api';

interface CodeTerminalAppProps {
  initialCodePayload?: { code?: string; language?: string } | null;
  onClearInitialCode?: () => void;
}

const sampleScripts: Record<string, string> = {
  python: `import os, sys, datetime, json

def inspect_mobile_environment():
    print(f"[*] Booting Python 3.12 Runtime on ARM64 mobile host...")
    device_info = {
        "os_version": "Android 15 (UpsideDownCake) / Kernel 6.1-android",
        "processor": "Tensor G4 Octa-Core NPU",
        "battery_level": 88,
        "temperature_c": 31.4,
        "automation_permission": "Aegis_Root_Granted",
        "timestamp": datetime.datetime.now().isoformat()
    }
    print("[+] Device Hardware Diagnostic:")
    for k, v in device_info.items():
        print(f"    - {k:22}: {v}")
    
    # Process simulated local files
    docs = ["invoice_2026.pdf", "contacts_backup.vcf", "neural_model.tflite"]
    print(f"[+] Scanned storage directory: {len(docs)} assets indexed.")
    return "Optimization complete. System healthy."

result = inspect_mobile_environment()
print(f"[*] Execution Result: {result}")
`,
  javascript: `// Aegis Mobile Quick Script runner
console.log("[*] Executing Mobile Event Pipeline...");
const activeApps = ["Phone", "Messages", "Camera", "CodeTerminal", "Browser"];
const stats = {
  cpuUsage: "14.2%",
  memoryFree: "4.8 GB",
  timestamp: new Date().toLocaleTimeString(),
  activeServices: activeApps.length
};

console.log("[INFO] System Metrics Summary:");
console.log(JSON.stringify(stats, null, 2));

function calculateBatteryRunway(currentPercent, dischargeRatePerHour) {
  const hoursLeft = (currentPercent / dischargeRatePerHour).toFixed(1);
  return \`\${hoursLeft} hours remaining until 0%\`;
}

console.log("[STATUS] Battery runway estimate: " + calculateBatteryRunway(88, 3.5));
return "Exit 0: All assertions passed.";
`,
  bash: `#!/bin/bash
echo "[*] Aegis Shell Environment 2026.4"
uname -a
echo "[*] Inspecting network interfaces..."
echo "wlan0: inet 192.168.1.144 netmask 255.255.255.0"
echo "rmnet_data0: 5G Ultra Wideband connected [Carrier: Aegis Mobile]"
echo "[*] Verifying security sandboxing policies..."
echo "[OK] seccomp BPF filters active."
echo "[OK] Permission interceptor daemon running with PID 4091."
`,
};

export const CodeTerminalApp: React.FC<CodeTerminalAppProps> = ({ initialCodePayload, onClearInitialCode }) => {
  const [language, setLanguage] = useState<'python' | 'javascript' | 'bash'>('python');
  const [code, setCode] = useState(sampleScripts.python);
  const [terminalOutput, setTerminalOutput] = useState<string>('Ready for execution. Press "Run Code" or submit AI prompt.');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [executionStats, setExecutionStats] = useState<{ timeMs?: number; exitCode?: number }>({});

  // Auto-fill from AI permission action
  useEffect(() => {
    if (initialCodePayload?.code) {
      const lang = (initialCodePayload.language?.toLowerCase() as any) || 'python';
      if (['python', 'javascript', 'bash'].includes(lang)) {
        setLanguage(lang);
      }
      setCode(initialCodePayload.code);

      // Auto run the authorized code
      setTimeout(() => {
        handleRunCode(initialCodePayload.code, lang);
      }, 500);

      if (onClearInitialCode) onClearInitialCode();
    }
  }, [initialCodePayload]);

  const handleLanguageChange = (lang: 'python' | 'javascript' | 'bash') => {
    setLanguage(lang);
    setCode(sampleScripts[lang]);
    setTerminalOutput(`Switched language environment to ${lang}. Ready.`);
  };

  const handleRunCode = async (codeToRun?: string, langToRun?: string) => {
    const c = codeToRun || code;
    const l = langToRun || language;
    setIsRunning(true);
    soundFX.playTap();
    setTerminalOutput(`[*] Compiling and executing ${l} script in mobile sandbox...\n`);

    try {
      const res = await executeCodeOnDevice(c, l);
      if (res.success) {
        setTerminalOutput(res.logs || 'Process completed with returncode 0');
        setExecutionStats({ timeMs: res.executionTimeMs || 24, exitCode: 0 });
        soundFX.playAuthorize();
      } else {
        setTerminalOutput(`[ERROR] ${res.error || 'Execution failed'}\n${res.logs || ''}`);
        setExecutionStats({ exitCode: 1 });
        soundFX.playDeny();
      }
    } catch (err: any) {
      setTerminalOutput(`[RUNTIME CRASH] ${err.message || 'Error occurred'}`);
      setExecutionStats({ exitCode: 127 });
      soundFX.playDeny();
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white select-none font-sans">
      {/* Top Header */}
      <div className="px-3 pt-3 pb-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold text-slate-200">Mobile Code IDE</span>
        </div>

        {/* Language selector */}
        <div className="flex gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
          {(['python', 'javascript', 'bash'] as const).map((l) => (
            <button
              key={l}
              onClick={() => handleLanguageChange(l)}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                language === l ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {l === 'python' ? 'Python' : l === 'javascript' ? 'JS' : 'Bash'}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Console Split View */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Editor Toolbar */}
        <div className="px-3 py-1.5 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            main.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'sh'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px] p-1 rounded hover:bg-slate-800"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={() => setCode(sampleScripts[language])}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px] p-1 rounded hover:bg-slate-800"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>

        {/* Code Input Area */}
        <div className="relative flex-1 bg-slate-950 font-mono text-xs overflow-hidden flex flex-col">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-full p-3 bg-transparent text-emerald-300 resize-none focus:outline-none font-mono text-[11.5px] leading-relaxed selection:bg-emerald-900/60"
          />
        </div>

        {/* Execution Control Bar */}
        <div className="px-3 py-2 bg-slate-900 border-y border-slate-800 flex items-center justify-between">
          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-emerald-400" /> ARM64 Sandbox
            </span>
            {executionStats.timeMs && (
              <span className="text-emerald-400">{executionStats.timeMs}ms</span>
            )}
          </div>

          <button
            onClick={() => handleRunCode()}
            disabled={isRunning}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow-md transition-all ${
              isRunning
                ? 'bg-slate-700 text-slate-400 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 shadow-emerald-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Run on Device
              </>
            )}
          </button>
        </div>

        {/* Terminal Output Console */}
        <div className="h-36 bg-black p-3 font-mono text-[10.5px] text-slate-300 overflow-y-auto border-t border-slate-800/80 shadow-inner">
          <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-1 flex items-center justify-between">
            <span>Terminal Output Console</span>
            <button
              onClick={() => setTerminalOutput('Console cleared.')}
              className="text-slate-500 hover:text-slate-300 lowercase text-[9px]"
            >
              clear
            </button>
          </div>
          <pre className="whitespace-pre-wrap break-all break-words leading-relaxed text-emerald-400/90 font-mono max-w-full">{terminalOutput}</pre>
        </div>
      </div>
    </div>
  );
};
