import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, ArrowLeft, CheckCheck, Smartphone, ShieldCheck } from 'lucide-react';
import { soundFX } from '../../services/audioEffects';
import { ChatThread } from '../../types';

interface MessagesAppProps {
  initialDraftPayload?: { recipient?: string; messageText?: string; app?: string } | null;
  onClearInitialDraft?: () => void;
}

const defaultThreads: ChatThread[] = [
  {
    id: 't1',
    contactName: 'Mom',
    app: 'Messages',
    lastMessage: 'Let me know when you get home safely ❤️',
    timestamp: '11:42 AM',
    unreadCount: 1,
    messages: [
      { id: 'm1', sender: 'contact', text: 'Hey sweetheart, how is your project going?', timestamp: '11:30 AM' },
      { id: 'm2', sender: 'user', text: 'Going great Mom! Built an autonomous mobile agent.', timestamp: '11:35 AM' },
      { id: 'm3', sender: 'contact', text: 'Let me know when you get home safely ❤️', timestamp: '11:42 AM' },
    ],
  },
  {
    id: 't2',
    contactName: 'Sarah Connor',
    app: 'WhatsApp',
    lastMessage: 'Can you verify the deployment status on AWS?',
    timestamp: '10:15 AM',
    unreadCount: 0,
    messages: [
      { id: 'm4', sender: 'contact', text: 'Can you verify the deployment status on AWS?', timestamp: '10:15 AM' },
    ],
  },
  {
    id: 't3',
    contactName: 'Dev Team Lead',
    app: 'WhatsApp',
    lastMessage: 'PR approved, waiting on permission audit check.',
    timestamp: 'Yesterday',
    unreadCount: 0,
    messages: [
      { id: 'm5', sender: 'contact', text: 'PR approved, waiting on permission audit check.', timestamp: 'Yesterday' },
    ],
  },
];

export const MessagesApp: React.FC<MessagesAppProps> = ({ initialDraftPayload, onClearInitialDraft }) => {
  const [threads, setThreads] = useState<ChatThread[]>(defaultThreads);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputMsg, setInputMsg] = useState('');
  const [activeService, setActiveService] = useState<'All' | 'Messages' | 'WhatsApp'>('All');

  // Handle incoming AI authorized draft
  useEffect(() => {
    if (initialDraftPayload) {
      const recipient = initialDraftPayload.recipient || 'Mom';
      const text = initialDraftPayload.messageText || '';

      // Find or create thread
      let targetThread = threads.find((t) => t.contactName.toLowerCase().includes(recipient.toLowerCase()));
      if (!targetThread) {
        targetThread = {
          id: `t_${Date.now()}`,
          contactName: recipient,
          app: (initialDraftPayload.app as any) || 'Messages',
          lastMessage: text,
          timestamp: 'Just now',
          unreadCount: 0,
          messages: [],
        };
        setThreads((prev) => [targetThread!, ...prev]);
      }

      setActiveThreadId(targetThread.id);
      setInputMsg(text);

      // Auto dispatch if requested
      if (text) {
        setTimeout(() => {
          handleSendMessage(targetThread!.id, text);
        }, 1200);
      }

      if (onClearInitialDraft) onClearInitialDraft();
    }
  }, [initialDraftPayload]);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  const handleSendMessage = (threadId: string, textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    soundFX.playTap();

    const now = new Date();
    const timeStr = `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          const newMsg = {
            id: `msg_${Date.now()}`,
            sender: 'user' as const,
            text: text.trim(),
            timestamp: timeStr,
          };
          return {
            ...t,
            lastMessage: text.trim(),
            timestamp: timeStr,
            messages: [...t.messages, newMsg],
          };
        }
        return t;
      })
    );

    setInputMsg('');

    // Simulated reply after 2 seconds
    setTimeout(() => {
      setThreads((prev) =>
        prev.map((t) => {
          if (t.id === threadId) {
            const replyMsg = {
              id: `msg_${Date.now() + 1}`,
              sender: 'contact' as const,
              text: `Acknowledged: "${text.trim().slice(0, 32)}..." Received and verified!`,
              timestamp: 'Just now',
            };
            return {
              ...t,
              lastMessage: replyMsg.text,
              timestamp: 'Just now',
              messages: [...t.messages, replyMsg],
            };
          }
          return t;
        })
      );
      soundFX.playAlert();
    }, 2500);
  };

  const filteredThreads = activeService === 'All' ? threads : threads.filter((t) => t.app === activeService);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white select-none">
      {/* Top Header */}
      <div className="px-4 pt-3 pb-2 border-b border-slate-800 flex items-center justify-between">
        {activeThread ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveThreadId(null)}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                {activeThread.contactName}
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                  {activeThread.app}
                </span>
              </div>
              <div className="text-[10px] text-emerald-400">Online • End-to-End Encrypted</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <h1 className="text-base font-semibold text-slate-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Messaging Hub
            </h1>
            <div className="flex gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              {(['All', 'Messages', 'WhatsApp'] as const).map((svc) => (
                <button
                  key={svc}
                  onClick={() => setActiveService(svc)}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    activeService === svc ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {svc}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeThread ? (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="flex justify-center">
              <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Aegis Human-Verified Chat Session
              </div>
            </div>

            {activeThread.messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-slate-800/90 text-slate-200 rounded-bl-none border border-slate-700/60'
                    }`}
                  >
                    {m.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-500 font-mono">
                    <span>{m.timestamp}</span>
                    {isUser && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat input */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(activeThread.id)}
              placeholder="Type a message or let AI draft..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handleSendMessage(activeThread.id)}
              disabled={!inputMsg.trim()}
              className={`p-2.5 rounded-full flex items-center justify-center transition-transform ${
                inputMsg.trim()
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 shadow-md shadow-emerald-600/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
          {filteredThreads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setActiveThreadId(thread.id)}
              className="p-3 rounded-xl hover:bg-slate-900/80 cursor-pointer flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {thread.contactName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-200">{thread.contactName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">[{thread.app}]</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 max-w-[190px]">{thread.lastMessage}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-slate-500 font-mono">{thread.timestamp}</span>
                {thread.unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-black text-[10px] font-bold flex items-center justify-center">
                    {thread.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
