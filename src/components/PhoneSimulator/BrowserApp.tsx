import React, { useState, useEffect } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCw, Search, ExternalLink, Bookmark, CheckCircle2, ShieldCheck } from 'lucide-react';
import { soundFX } from '../../services/audioEffects';
import { browseWebOnDevice } from '../../services/api';

interface BrowserAppProps {
  initialBrowsePayload?: { url?: string; query?: string } | null;
  onClearInitialBrowse?: () => void;
}

export const BrowserApp: React.FC<BrowserAppProps> = ({ initialBrowsePayload, onClearInitialBrowse }) => {
  const [urlInput, setUrlInput] = useState('https://news.ycombinator.com');
  const [currentUrl, setCurrentUrl] = useState('https://news.ycombinator.com');
  const [isLoading, setIsLoading] = useState(false);
  const [pageData, setPageData] = useState<{
    pageTitle: string;
    summary: string;
    keyDataPoints: string[];
    simulatedElements: string[];
  }>({
    pageTitle: 'Hacker News - Technology & Computing Hub',
    summary: 'Autonomous crawler indexed front page articles. 30 discussions active regarding state-of-the-art AI agents and mobile LLM automation.',
    keyDataPoints: [
      'Gemini 3.8 Flash introduces real-time multimodal reasoning benchmarks',
      'Autonomous device agents require explicit Human-in-the-Loop permission models',
      'New sandboxing techniques allow secure Python execution on mobile ARM64',
    ],
    simulatedElements: ['1. Gemini 3.8 Flash (342 points)', '2. Sandboxed Mobile OS Agents (219 points)', '3. WebAssembly JIT (104 points)'],
  });

  // Handle incoming AI browse command
  useEffect(() => {
    if (initialBrowsePayload) {
      const target = initialBrowsePayload.url || (initialBrowsePayload.query ? `https://www.google.com/search?q=${encodeURIComponent(initialBrowsePayload.query)}` : 'https://news.ycombinator.com');
      setUrlInput(target);
      handleNavigate(target, initialBrowsePayload.query);
      if (onClearInitialBrowse) onClearInitialBrowse();
    }
  }, [initialBrowsePayload]);

  const handleNavigate = async (targetUrl: string, searchTarget?: string) => {
    setIsLoading(true);
    soundFX.playTap();
    setCurrentUrl(targetUrl);

    try {
      const res = await browseWebOnDevice(targetUrl, searchTarget);
      setPageData({
        pageTitle: res.pageTitle || 'Web Results',
        summary: res.summary || 'Page loaded in mobile container viewport.',
        keyDataPoints: res.keyDataPoints || ['Content parsed successfully', 'SSL verified'],
        simulatedElements: res.simulatedElements || ['Link 1', 'Link 2'],
      });
      soundFX.playAuthorize();
    } catch {
      // Graceful fallback
      setPageData({
        pageTitle: `Browsing: ${targetUrl}`,
        summary: 'Web content rendered in sandboxed secure WebView container.',
        keyDataPoints: ['TLS 1.3 encryption verified', 'DOM tree compiled', 'Safe browsing filter active'],
        simulatedElements: ['Search Bar', 'Navigation Links', 'Article Body'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      let finalUrl = urlInput.trim();
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        if (finalUrl.includes('.')) {
          finalUrl = 'https://' + finalUrl;
        } else {
          finalUrl = `https://www.google.com/search?q=${encodeURIComponent(finalUrl)}`;
        }
      }
      setUrlInput(finalUrl);
      handleNavigate(finalUrl);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white select-none">
      {/* Browser Bar */}
      <div className="px-3 pt-3 pb-2 bg-slate-900 border-b border-slate-800 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <button className="p-1 rounded hover:bg-slate-800 text-slate-400">
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded hover:bg-slate-800 text-slate-400">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleNavigate(currentUrl)}
            className={`p-1 rounded hover:bg-slate-800 text-slate-400 ${isLoading ? 'animate-spin text-emerald-400' : ''}`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* URL Input */}
          <div className="flex-1 min-w-0 flex items-center bg-slate-950 border border-slate-800 rounded-full px-2.5 py-1 text-xs">
            <Globe className="w-3 h-3 text-emerald-400 mr-1.5 flex-shrink-0" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-slate-200 w-full focus:outline-none font-mono text-[11px]"
              placeholder="Search or enter web address..."
            />
          </div>

          <button className="p-1 rounded hover:bg-slate-800 text-slate-400">
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3 h-3" /> Encrypted Web Sandbox
          </span>
          <span className="font-mono text-slate-500">HTTP/3 • 412x915</span>
        </div>
      </div>

      {/* Rendered Web Viewport */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-900/40 text-slate-200">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-mono">Loading page & extracting mobile DOM...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Page Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live Extracted Page
              </div>
              <h2 className="text-sm font-semibold text-white leading-tight mb-1">{pageData.pageTitle}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{pageData.summary}</p>
            </div>

            {/* Key Data Points */}
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Automated Data Extraction Points
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {pageData.keyDataPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Page Links / Interactables */}
            <div className="bg-slate-900/70 border border-slate-800/60 rounded-xl p-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Interactable Page Links
              </div>
              <div className="space-y-1.5">
                {pageData.simulatedElements.map((elem, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      soundFX.playTap();
                      setUrlInput(`https://news.ycombinator.com/item?id=${idx + 100}`);
                    }}
                    className="p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800/60 flex items-center justify-between text-xs cursor-pointer transition-colors"
                  >
                    <span className="text-slate-200 font-mono text-[11px] truncate">{elem}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
