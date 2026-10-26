import React, { useState, useEffect } from 'react';
import { Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX, User, Clock, ArrowLeft } from 'lucide-react';
import { soundFX } from '../../services/audioEffects';
import { Contact } from '../../types';

interface PhoneAppProps {
  initialCallPayload?: { contactName?: string; phoneNumber?: string; speaker?: boolean } | null;
  onClearInitialCall?: () => void;
}

const defaultContacts: Contact[] = [
  { id: '1', name: 'Mom', phone: '+1 (555) 234-8901', avatarColor: 'bg-rose-500', recentCall: 'Yesterday, 6:15 PM' },
  { id: '2', name: 'Sarah Connor', phone: '+1 (555) 910-3482', avatarColor: 'bg-blue-500', recentCall: 'Today, 10:24 AM' },
  { id: '3', name: 'Dev Team Lead', phone: '+1 (555) 773-1920', avatarColor: 'bg-emerald-500', recentCall: 'Oct 24, 2:40 PM' },
  { id: '4', name: 'Emergency Services', phone: '911', avatarColor: 'bg-amber-600' },
  { id: '5', name: 'Alex Rivera', phone: '+1 (555) 843-0091', avatarColor: 'bg-purple-500' },
];

export const PhoneApp: React.FC<PhoneAppProps> = ({ initialCallPayload, onClearInitialCall }) => {
  const [activeTab, setActiveTab] = useState<'keypad' | 'contacts' | 'recents'>('keypad');
  const [dialNumber, setDialNumber] = useState('');
  const [inCall, setInCall] = useState(false);
  const [callTarget, setCallTarget] = useState({ name: 'Alex Rivera', phone: '+1 (555) 843-0091' });
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callState, setCallState] = useState<'calling' | 'connected' | 'ended'>('calling');
  const [callNotes, setCallNotes] = useState<string[]>([]);

  // Trigger call if an AI action authorized it
  useEffect(() => {
    if (initialCallPayload) {
      setCallTarget({
        name: initialCallPayload.contactName || 'Authorized Contact',
        phone: initialCallPayload.phoneNumber || '+1 (555) 000-1122',
      });
      setIsSpeaker(!!initialCallPayload.speaker);
      startCall(initialCallPayload.contactName || 'Authorized Contact', initialCallPayload.phoneNumber || '+1 (555) 000-1122');
      if (onClearInitialCall) onClearInitialCall();
    }
  }, [initialCallPayload]);

  // Duration timer
  useEffect(() => {
    let interval: any;
    if (inCall && callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration((d) => d + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [inCall, callState]);

  const startCall = (name: string, phone: string) => {
    setCallTarget({ name, phone });
    setInCall(true);
    setCallState('calling');
    setCallDuration(0);
    setCallNotes(['[Aegis AI] Secure VoLTE connection routed.', '[Aegis AI] Handshake verified with carrier network.']);
    soundFX.playCallRing();

    // Auto connect after 2 seconds
    setTimeout(() => {
      setCallState('connected');
      setCallNotes((prev) => [
        ...prev,
        `[Call Connected] Audio streaming @ 24kHz HD voice codec.`,
        `[Transcript] "${name}: Hello? Yes, I got your alert, what's up?"`,
      ]);
    }, 2200);
  };

  const endCall = () => {
    setCallState('ended');
    soundFX.playDeny();
    setTimeout(() => {
      setInCall(false);
      setCallDuration(0);
    }, 1000);
  };

  const handleKeypadPress = (digit: string) => {
    soundFX.playTap();
    setDialNumber((prev) => prev + digit);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // IN-CALL VIEW
  if (inCall) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white p-6 relative">
        <div className="flex-1 flex flex-col items-center justify-center pt-8">
          <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-emerald-500/50 flex items-center justify-center mb-4 relative shadow-lg shadow-emerald-500/10">
            <User className="w-12 h-12 text-emerald-400" />
            {callState === 'calling' && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">{callTarget.name}</h2>
          <p className="text-sm text-slate-400 mb-3">{callTarget.phone}</p>

          <div className="px-3 py-1 rounded-full bg-slate-800/80 text-xs font-mono font-medium border border-slate-700 mb-6">
            {callState === 'calling' && <span className="text-amber-400 animate-pulse">Calling via Aegis Cellular...</span>}
            {callState === 'connected' && <span className="text-emerald-400">{formatSeconds(callDuration)} • HD Voice</span>}
            {callState === 'ended' && <span className="text-rose-400">Call Ended</span>}
          </div>

          {/* Simulated audio waveform */}
          {callState === 'connected' && (
            <div className="flex items-center gap-1.5 h-8 my-3">
              {[40, 75, 20, 90, 60, 30, 85, 45, 95, 30, 70].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-emerald-400/80 rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 0.12}s`,
                    animationDuration: '0.9s',
                  }}
                />
              ))}
            </div>
          )}

          {/* Call transcript / telemetry */}
          <div className="w-full max-h-32 overflow-y-auto bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1 mb-4 shadow-inner">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Live Call Audio Feed</div>
            {callNotes.map((note, idx) => (
              <div key={idx} className="leading-relaxed">{note}</div>
            ))}
          </div>
        </div>

        {/* Call control action buttons */}
        <div className="pb-6">
          <div className="grid grid-cols-3 gap-4 mb-6 max-w-xs mx-auto">
            <button
              onClick={() => {
                soundFX.playTap();
                setIsMuted(!isMuted);
              }}
              className={`p-3.5 rounded-full flex flex-col items-center justify-center transition-all ${
                isMuted ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span className="text-[10px] mt-1">Mute</span>
            </button>

            <button
              onClick={() => {
                soundFX.playTap();
                setIsSpeaker(!isSpeaker);
              }}
              className={`p-3.5 rounded-full flex flex-col items-center justify-center transition-all ${
                isSpeaker ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="text-[10px] mt-1">Speaker</span>
            </button>

            <button
              onClick={() => {
                soundFX.playTap();
                setCallNotes((prev) => [...prev, `[AI Note] User tapped AI Assist marker at ${formatSeconds(callDuration)}`]);
              }}
              className="p-3.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 flex flex-col items-center justify-center"
            >
              <Clock className="w-5 h-5" />
              <span className="text-[10px] mt-1">Record</span>
            </button>
          </div>

          <div className="flex justify-center">
            <button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 active:scale-95 transition-transform"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white select-none">
      {/* Top Bar */}
      <div className="px-4 pt-3 pb-2 border-b border-slate-800/80 flex items-center justify-between">
        <h1 className="text-base font-semibold text-slate-200 flex items-center gap-2">
          <Phone className="w-4 h-4 text-emerald-400" />
          Phone & Dialer
        </h1>
        <div className="text-[11px] text-emerald-400/80 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full">
          VoLTE Ready
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 border-b border-slate-800 text-xs font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('keypad')}
          className={`py-2 text-center transition-colors ${activeTab === 'keypad' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : 'hover:text-slate-200'}`}
        >
          Keypad
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`py-2 text-center transition-colors ${activeTab === 'contacts' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : 'hover:text-slate-200'}`}
        >
          Contacts ({defaultContacts.length})
        </button>
        <button
          onClick={() => setActiveTab('recents')}
          className={`py-2 text-center transition-colors ${activeTab === 'recents' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : 'hover:text-slate-200'}`}
        >
          Recents
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'keypad' && (
          <div className="p-4 flex flex-col h-full justify-between">
            {/* Display */}
            <div className="min-h-14 flex items-center justify-center text-center">
              <span className="text-2xl font-mono tracking-wider text-white">
                {dialNumber || <span className="text-slate-600 text-lg">Enter number...</span>}
              </span>
              {dialNumber && (
                <button
                  onClick={() => setDialNumber((prev) => prev.slice(0, -1))}
                  className="ml-3 text-slate-400 hover:text-rose-400 p-1 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto my-2">
              {[
                { d: '1', sub: '' },
                { d: '2', sub: 'ABC' },
                { d: '3', sub: 'DEF' },
                { d: '4', sub: 'GHI' },
                { d: '5', sub: 'JKL' },
                { d: '6', sub: 'MNO' },
                { d: '7', sub: 'PQRS' },
                { d: '8', sub: 'TUV' },
                { d: '9', sub: 'WXYZ' },
                { d: '*', sub: '' },
                { d: '0', sub: '+' },
                { d: '#', sub: '' },
              ].map((k) => (
                <button
                  key={k.d}
                  onClick={() => handleKeypadPress(k.d)}
                  className="w-16 h-16 rounded-full bg-slate-900 hover:bg-slate-800 active:bg-emerald-950/60 border border-slate-800 text-white flex flex-col items-center justify-center transition-all shadow-sm active:scale-95"
                >
                  <span className="text-xl font-semibold leading-none">{k.d}</span>
                  {k.sub && <span className="text-[8px] text-slate-400 tracking-wider mt-0.5">{k.sub}</span>}
                </button>
              ))}
            </div>

            {/* Call button */}
            <div className="flex justify-center pb-2">
              <button
                disabled={!dialNumber}
                onClick={() => startCall('Manual Call', dialNumber)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                  dialNumber
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 shadow-emerald-600/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <PhoneCall className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="divide-y divide-slate-800/80 p-2">
            {defaultContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => startCall(contact.name, contact.phone)}
                className="p-2.5 rounded-lg hover:bg-slate-900 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${contact.avatarColor} text-white font-bold flex items-center justify-center text-xs shadow-sm`}>
                    {contact.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">{contact.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{contact.phone}</div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400 hover:bg-emerald-900">
                  <Phone className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recents' && (
          <div className="divide-y divide-slate-800/80 p-2">
            {defaultContacts.filter((c) => c.recentCall).map((contact) => (
              <div
                key={contact.id}
                onClick={() => startCall(contact.name, contact.phone)}
                className="p-3 rounded-lg hover:bg-slate-900 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${contact.avatarColor} text-white font-bold flex items-center justify-center text-xs`}>
                    {contact.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">{contact.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {contact.recentCall}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-mono">Incoming HD</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
