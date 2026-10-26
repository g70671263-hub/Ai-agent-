import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Paperclip, Image as ImageIcon, Video, FileText, Send, Sparkles, X, Languages, Globe } from 'lucide-react';
import { soundFX } from '../../services/audioEffects';
import { Attachment } from '../../types';

interface MultimodalInputProps {
  onSubmit: (prompt: string, attachments: Attachment[]) => void;
  isLoading: boolean;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
}

const SUPPORTED_LANGUAGES = [
  { code: 'auto', label: 'Auto-detect Language' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'hi-IN', label: 'Hindi (हिन्दी)' },
  { code: 'es-ES', label: 'Spanish (Español)' },
  { code: 'ar-SA', label: 'Arabic (العربية)' },
  { code: 'bn-BD', label: 'Bengali (বাংলা)' },
  { code: 'fr-FR', label: 'French (Français)' },
  { code: 'ja-JP', label: 'Japanese (日本語)' },
  { code: 'de-DE', label: 'German (Deutsch)' },
  { code: 'zh-CN', label: 'Chinese (中文)' },
];

export const MultimodalInput: React.FC<MultimodalInputProps> = ({
  onSubmit,
  isLoading,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const [prompt, setPrompt] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Web Speech API if supported in browser
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage === 'auto' ? 'en-US' : selectedLanguage;

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setSpeechTranscript(currentTranscript);
        setPrompt((prev) => (prev ? prev + ' ' + currentTranscript : currentTranscript));
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLanguage]);

  const toggleVoiceRecording = () => {
    soundFX.playTap();
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setSpeechTranscript('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = selectedLanguage === 'auto' ? 'en-US' : selectedLanguage;
          recognitionRef.current.start();
          setIsRecording(true);
          soundFX.playAlert();
        } catch {
          // If already running or permission denied
          setIsRecording(false);
        }
      } else {
        // Fallback simulated speech input if browser lacks Web Speech API
        const sampleSpoken = 'Call Mom and ask her if she received the package';
        setPrompt(sampleSpoken);
        soundFX.playAlert();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isAudio = file.type.startsWith('audio/');

      reader.onload = () => {
        const base64Data = reader.result as string;
        const newAttachment: Attachment = {
          id: `att_${Date.now()}_${Math.random()}`,
          name: file.name,
          type: isImage ? 'image' : isVideo ? 'video' : isAudio ? 'audio' : 'file',
          mimeType: file.type || 'application/octet-stream',
          data: base64Data,
          size: file.size,
        };
        setAttachments((prev) => [...prev, newAttachment]);
        soundFX.playTap();
      };

      if (isImage || isVideo || isAudio || file.type.includes('pdf')) {
        reader.readAsDataURL(file);
      } else {
        // Plain text / code
        reader.readAsText(file);
      }
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    soundFX.playTap();
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() && attachments.length === 0) return;
    if (isLoading) return;

    soundFX.playTap();
    onSubmit(prompt, attachments);
    setPrompt('');
    setAttachments([]);
    setSpeechTranscript('');
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl backdrop-blur-sm">
      {/* Top Bar: Language Selector & Multimodal Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium">Multimodal AI Commander</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            Text • Voice • Media • Files
          </span>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs">
          <Languages className="w-3.5 h-3.5 text-emerald-400" />
          <select
            value={selectedLanguage}
            onChange={(e) => onSelectLanguage(e.target.value)}
            className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attachments preview row */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 group relative"
            >
              {att.type === 'image' && (
                <img src={att.data} alt={att.name} className="w-6 h-6 object-cover rounded" />
              )}
              {att.type === 'video' && <Video className="w-4 h-4 text-purple-400" />}
              {att.type === 'file' && <FileText className="w-4 h-4 text-amber-400" />}
              <span className="font-mono text-[11px] truncate max-w-[140px]">{att.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="text-slate-400 hover:text-rose-400 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Voice Recording Indicator */}
      {isRecording && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-rose-950/70 border border-rose-500/50 flex items-center justify-between text-xs text-rose-200 animate-pulse">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Listening in {selectedLanguage === 'auto' ? 'Any Language' : selectedLanguage}...</span>
          </div>
          <span className="text-[10px] text-rose-300">Tap mic to stop</span>
        </div>
      )}

      {/* Text Area Input */}
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Command your mobile in any language (e.g. 'Call Mom', 'Code Python automation', 'Send WhatsApp to Sarah', 'Browse latest AI news', 'Take photo and scan invoice')..."
          rows={3}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/70 resize-none font-sans leading-relaxed"
        />

        {/* Input Bottom Toolbar */}
        <div className="flex items-center justify-between pt-2">
          {/* Media & Voice intake triggers */}
          <div className="flex items-center gap-1.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*,video/*,audio/*,.pdf,.txt,.py,.js,.json,.csv"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
              title="Upload file, photo, or video"
            >
              <Paperclip className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline text-[11px]">Attach</span>
            </button>

            <button
              type="button"
              onClick={() => {
                // Quick sample photo attachment
                const canvas = document.createElement('canvas');
                canvas.width = 300;
                canvas.height = 200;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.fillStyle = '#1e293b';
                  ctx.fillRect(0, 0, 300, 200);
                  ctx.fillStyle = '#10b981';
                  ctx.font = '16px monospace';
                  ctx.fillText('SAMPLE_INVOICE_OCT.PNG', 20, 80);
                  ctx.fillStyle = '#94a3b8';
                  ctx.font = '12px monospace';
                  ctx.fillText('Amount Due: $1,450.00', 20, 110);
                  ctx.fillText('Vendor: AI Cloud Services', 20, 130);
                  const sampleImage = canvas.toDataURL('image/png');
                  setAttachments((prev) => [
                    ...prev,
                    {
                      id: `att_${Date.now()}`,
                      name: 'sample_invoice.png',
                      type: 'image',
                      mimeType: 'image/png',
                      data: sampleImage,
                    },
                  ]);
                  soundFX.playTap();
                }
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
              title="Add sample snapshot"
            >
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline text-[11px]">Snapshot</span>
            </button>

            {/* Voice Mic Button */}
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`p-2 rounded-xl transition-all flex items-center gap-1 text-xs ${
                isRecording
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Speak voice command in any language"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline text-[11px]">{isRecording ? 'Stop' : 'Voice'}</span>
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || (!prompt.trim() && attachments.length === 0)}
            className={`px-3 sm:px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold shadow-lg transition-all flex-shrink-0 ${
              isLoading || (!prompt.trim() && attachments.length === 0)
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 shadow-emerald-600/30'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Formulating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span className="sm:hidden">Send Plan</span>
                <span className="hidden sm:inline">Formulate Plan</span>
                <Send className="w-3.5 h-3.5 ml-0.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
