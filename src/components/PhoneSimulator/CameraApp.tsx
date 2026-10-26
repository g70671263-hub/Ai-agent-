import React, { useState, useEffect, useRef } from 'react';
import { Camera, SwitchCamera, Image as ImageIcon, Scan, CheckCircle, RefreshCw, X } from 'lucide-react';
import { soundFX } from '../../services/audioEffects';

interface CameraAppProps {
  onPhotoCaptured?: (base64Photo: string) => void;
}

export const CameraApp: React.FC<CameraAppProps> = ({ onPhotoCaptured }) => {
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [hasStream, setHasStream] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode, width: { ideal: 720 }, height: { ideal: 1280 } },
            audio: false,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasStream(true);
          }
        }
      } catch {
        // Fallback: camera permission or hardware not available, use realistic simulated camera viewport
        setHasStream(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const snapPhoto = () => {
    soundFX.playShutter();
    let photoData = '';

    if (hasStream && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        photoData = canvas.toDataURL('image/jpeg', 0.85);
      }
    }

    // If no real stream, create a realistic captured snapshot card on canvas
    if (!photoData && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 400;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw cyberpunk sensor scene
        const gradient = ctx.createLinearGradient(0, 0, 400, 600);
        gradient.addColorStop(0, '#0f172a');
        gradient.addColorStop(0.5, '#1e293b');
        gradient.addColorStop(1, '#020617');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 600);

        // Grid lines
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        for (let x = 0; x < 400; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 600);
          ctx.stroke();
        }
        for (let y = 0; y < 600; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(400, y);
          ctx.stroke();
        }

        // Bounding box
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.strokeRect(60, 160, 280, 240);

        ctx.fillStyle = '#10b981';
        ctx.font = '14px monospace';
        ctx.fillText('AEGIS SENSOR RAW CAPTURE [50MP]', 70, 190);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px monospace';
        ctx.fillText(`ISO: 64 • 1/250s • f/1.8 • 24mm`, 70, 220);
        ctx.fillText(`Captured: ${new Date().toLocaleTimeString()}`, 70, 250);
        ctx.fillText(`GPS: 37.7749° N, 122.4194° W`, 70, 280);

        photoData = canvas.toDataURL('image/jpeg', 0.9);
      }
    }

    if (photoData) {
      setCapturedPhotos((prev) => [photoData, ...prev]);
      if (onPhotoCaptured) onPhotoCaptured(photoData);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white select-none relative overflow-hidden">
      {/* Hidden canvas for snapshot capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Overlay Controls */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 py-3 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
          <Camera className="w-4 h-4 text-emerald-400" />
          <span>50MP f/1.8</span>
        </div>

        <button
          onClick={() => setIsScanning(!isScanning)}
          className={`px-2 py-1 rounded-full text-[10px] font-mono flex items-center gap-1 border transition-colors ${
            isScanning
              ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
              : 'bg-black/50 text-slate-400 border-slate-700'
          }`}
        >
          <Scan className="w-3 h-3" />
          {isScanning ? 'AI Vision ON' : 'AI Vision OFF'}
        </button>
      </div>

      {/* Viewfinder Main View */}
      <div className="flex-1 relative flex items-center justify-center bg-slate-950 overflow-hidden">
        {hasStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="w-20 h-20 rounded-full border border-emerald-500/30 flex items-center justify-center relative mb-3">
              <Camera className="w-10 h-10 text-emerald-400" />
              <div className="absolute inset-0 border border-emerald-400/20 rounded-full animate-ping" />
            </div>
            <div className="text-xs font-mono text-emerald-400 mb-1">Aegis Multi-Spectral Sensor Active</div>
            <p className="text-[11px] text-slate-400 max-w-[220px]">
              Hardware sensor ready. Tap shutter below to capture high-res frame for AI inspection.
            </p>
          </div>
        )}

        {/* AI Object Detection Bounding Box Overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-56 h-56 border-2 border-emerald-400/80 rounded-2xl relative shadow-lg shadow-emerald-500/20">
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-emerald-300 border border-emerald-500/40">
                AI Vision • Auto-Focus
              </div>

              {/* Scanning horizontal bar animation */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce absolute top-1/2" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Shutter & Gallery Controls */}
      <div className="h-28 bg-black/90 px-6 flex items-center justify-between relative z-20 border-t border-slate-900">
        {/* Gallery Thumbnail */}
        <div className="w-12 h-12 rounded-xl border border-slate-700 overflow-hidden bg-slate-900 flex items-center justify-center">
          {capturedPhotos.length > 0 ? (
            <img
              src={capturedPhotos[0]}
              alt="Recent snap"
              onClick={() => setSelectedPhoto(capturedPhotos[0])}
              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
            />
          ) : (
            <ImageIcon className="w-5 h-5 text-slate-500" />
          )}
        </div>

        {/* Shutter Button */}
        <button
          onClick={snapPhoto}
          className="w-18 h-18 rounded-full border-4 border-white/80 p-1 flex items-center justify-center active:scale-90 transition-transform"
        >
          <div className="w-full h-full rounded-full bg-white hover:bg-slate-200 transition-colors shadow-lg shadow-white/20" />
        </button>

        {/* Switch Camera */}
        <button
          onClick={() => {
            soundFX.playTap();
            setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
          }}
          className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
        >
          <SwitchCamera className="w-5 h-5" />
        </button>
      </div>

      {/* Photo inspection modal */}
      {selectedPhoto && (
        <div className="absolute inset-0 z-30 bg-black/95 flex flex-col p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono text-emerald-400">Captured Asset Preview</span>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="p-1 rounded-full bg-slate-800 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center bg-slate-950">
            <img src={selectedPhoto} alt="Captured preview" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="pt-3 flex justify-end">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
