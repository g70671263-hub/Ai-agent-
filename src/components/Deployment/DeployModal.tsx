import React, { useState, useEffect } from 'react';
import { GitBranch, Globe, UploadCloud, Copy, Check, Terminal, ExternalLink, ShieldCheck, Download, X, CheckCircle2, AlertCircle, Loader2, KeyRound, ArrowRight } from 'lucide-react';
import { soundFX } from '../../services/audioEffects';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [username, setUsername] = useState('sarfraz123january');
  const [repoName, setRepoName] = useState('aegis-mobile-ai');
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [repoUrl, setRepoUrl] = useState('https://github.com/sarfraz123january/aegis-mobile-ai.git');

  // Push status states
  const [isPushing, setIsPushing] = useState(false);
  const [pushResult, setPushResult] = useState<{
    success: boolean;
    message: string;
    repositoryUrl?: string;
    hint?: string;
  } | null>(null);

  // Sync repoUrl when username or repoName changes
  useEffect(() => {
    setRepoUrl(`https://github.com/${username.trim() || 'sarfraz123january'}/${repoName.trim() || 'aegis-mobile-ai'}.git`);
  }, [username, repoName]);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    soundFX.playTap();
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handlePushToGithub = async () => {
    setIsPushing(true);
    setPushResult(null);
    soundFX.playTap();

    try {
      const response = await fetch('/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          repoName: repoName.trim(),
          token: token.trim(),
          repoUrl: repoUrl.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        soundFX.playApproval();
        setPushResult({
          success: true,
          message: data.message || 'Pushed to GitHub main branch successfully!',
          repositoryUrl: data.repositoryUrl || `https://github.com/${username}/${repoName}`,
        });
      } else {
        soundFX.playRejection();
        setPushResult({
          success: false,
          message: data.error || 'Failed to push to GitHub.',
          hint: data.hint || 'Make sure the repository exists on GitHub and your token has the "repo" scope.',
        });
      }
    } catch (err: any) {
      soundFX.playRejection();
      setPushResult({
        success: false,
        message: err.message || 'Network error while attempting git push',
        hint: 'Please check your connection or use the terminal command below.',
      });
    } finally {
      setIsPushing(false);
    }
  };

  const gitPushCommand = `git remote add origin ${repoUrl}\ngit branch -M main\ngit push -u origin main`;
  const vercelCliCommand = `npm i -g vercel\nvercel --prod`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md flex-shrink-0">
              <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-bold text-white flex items-center gap-1.5 sm:gap-2">
                <span>GitHub & Vercel Push Engine</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 text-[9px] sm:text-[10px] font-mono">
                  BRANCH: MAIN
                </span>
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400">
                Direct automated push to your GitHub repo and 1-click Vercel deployment
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6">
          {/* Push Status Banner if exists */}
          {pushResult && (
            <div
              className={`p-4 rounded-2xl border text-xs ${
                pushResult.success
                  ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-600/50 text-rose-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {pushResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="font-bold text-sm text-white">{pushResult.message}</div>
                  {pushResult.hint && <div className="text-slate-300 text-[11px]">{pushResult.hint}</div>}
                  {pushResult.repositoryUrl && (
                    <a
                      href={pushResult.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-300 underline font-mono text-[11px] pt-1"
                    >
                      <span>Open {pushResult.repositoryUrl} on GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Direct Push to GitHub */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                  <GitBranch className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">1. Direct Automated Push to GitHub</h3>
                  <p className="text-[11px] text-slate-400">All files are committed on local branch main. Enter your GitHub token to push now.</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Ready to Push
              </span>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">
                  GitHub Username:
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="sarfraz123january"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">
                  Repository Name:
                </label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="aegis-mobile-ai"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* GitHub Personal Access Token (PAT) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                  <span>GitHub Personal Access Token (PAT):</span>
                </label>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo&description=Aegis%20Mobile%20AI"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-purple-400 hover:text-purple-300 underline flex items-center gap-1"
                >
                  <span>Generate Token (with 'repo' scope)</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white pr-16 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                >
                  {showToken ? 'Hide' : 'Show'}
                </button>
              </div>

              <p className="text-[10px] text-slate-400">
                GitHub requires a Personal Access Token (PAT) for automated push authentication. Tokens are processed in memory and never stored.
              </p>
            </div>

            {/* Action Push Button */}
            <button
              onClick={handlePushToGithub}
              disabled={isPushing}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all active:scale-[0.98]"
            >
              {isPushing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Pushing to github.com/{username}/{repoName}...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Push to GitHub Main Branch Now</span>
                </>
              )}
            </button>

            {/* Terminal Fallback Box */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="bg-black p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 relative group">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[10px] text-slate-500">
                  <span>Or run directly from your shell terminal:</span>
                  <button
                    onClick={() => handleCopy(gitPushCommand, 'git')}
                    className="flex items-center gap-1 text-slate-400 hover:text-white p-1 rounded"
                  >
                    {copiedCmd === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCmd === 'git' ? 'Copied' : 'Copy Command'}</span>
                  </button>
                </div>
                <pre className="text-emerald-400 whitespace-pre-wrap">{gitPushCommand}</pre>
              </div>
            </div>
          </div>

          {/* STEP 2: Deploy to Vercel */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-bold text-xs">
                  ▲
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">2. Deploy to Vercel</h3>
                  <p className="text-[11px] text-slate-400">vercel.json and serverless backend API configured for 1-click cloud hosting.</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                1-Click Ready
              </span>
            </div>

            {/* Vercel 1-Click Button */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://vercel.com/new/git/external?repository-url=${encodeURIComponent(repoUrl)}&env=GEMINI_API_KEY`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <span>▲ Deploy with Vercel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <span className="text-xs text-slate-400">or run via Vercel CLI:</span>
            </div>

            {/* Vercel CLI command box */}
            <div className="bg-black p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 relative group">
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[10px] text-slate-500">
                <span>Vercel CLI Command:</span>
                <button
                  onClick={() => handleCopy(vercelCliCommand, 'vercel')}
                  className="flex items-center gap-1 text-slate-400 hover:text-white p-1 rounded"
                >
                  {copiedCmd === 'vercel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCmd === 'vercel' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-white whitespace-pre-wrap">{vercelCliCommand}</pre>
            </div>

            {/* Environment variable note */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Required Vercel Environment Variable:
              </div>
              <div className="font-mono text-emerald-400 text-xs pl-5">
                GEMINI_API_KEY = "your-gemini-api-key"
              </div>
              <div className="text-slate-400 pl-5 text-[10px]">
                Add this in Vercel Dashboard → Project Settings → Environment Variables.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/70 flex justify-between items-center">
          <span className="text-xs text-slate-400 font-mono">
            Files verified: vercel.json • api/index.ts • server.ts • dist
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
