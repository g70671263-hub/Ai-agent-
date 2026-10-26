import React, { useState } from 'react';
import { Folder, FileText, Image as ImageIcon, FileCode, HardDrive, Search, Trash2, Eye, X, ArrowLeft } from 'lucide-react';
import { soundFX } from '../../services/audioEffects';
import { FileItem } from '../../types';

const defaultFiles: FileItem[] = [
  {
    id: 'f1',
    name: 'invoice_october_2026.pdf',
    path: '/storage/emulated/0/Documents/invoice_october_2026.pdf',
    type: 'doc',
    size: '1.4 MB',
    modified: 'Today, 09:12 AM',
    content: 'INVOICE #9821\nClient: Sarfraz Enterprise\nAmount: $4,250.00 USD\nStatus: Paid via Stripe\nTax ID: US-99210-91',
  },
  {
    id: 'f2',
    name: 'device_automation_worker.py',
    path: '/storage/emulated/0/Scripts/device_automation_worker.py',
    type: 'code',
    size: '8.2 KB',
    modified: 'Yesterday',
    content: '#!/usr/bin/env python3\nimport android_os\n\ndef run():\n    print("[Aegis Worker] Background sync active.")\n\nif __name__ == "__main__":\n    run()',
  },
  {
    id: 'f3',
    name: 'contacts_backup_vcf.vcf',
    path: '/storage/emulated/0/Documents/contacts_backup_vcf.vcf',
    type: 'file',
    size: '42 KB',
    modified: 'Oct 23, 2026',
    content: 'BEGIN:VCARD\nVERSION:3.0\nFN:Mom\nTEL;TYPE=CELL:+15552348901\nEND:VCARD\nBEGIN:VCARD\nVERSION:3.0\nFN:Sarah Connor\nTEL;TYPE=CELL:+15559103482\nEND:VCARD',
  },
  {
    id: 'f4',
    name: 'sensor_telemetry.json',
    path: '/storage/emulated/0/Downloads/sensor_telemetry.json',
    type: 'code',
    size: '12.6 KB',
    modified: 'Oct 25, 2026',
    content: '{\n  "gps": { "lat": 37.7749, "lon": -122.4194 },\n  "battery": 88,\n  "network": "5G-SA",\n  "system": "Aegis OmniAutomate OS"\n}',
  },
  {
    id: 'f5',
    name: 'IMG_20261026_0109.jpg',
    path: '/storage/emulated/0/DCIM/Camera/IMG_20261026_0109.jpg',
    type: 'image',
    size: '4.8 MB',
    modified: 'Just now',
    content: '[Raw JPEG Image Data - 50MP Wide Sensor]',
  },
];

export const FilesApp: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(defaultFiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFX.playDeny();
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const getFileIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'doc':
        return <FileText className="w-5 h-5 text-rose-400" />;
      case 'code':
        return <FileCode className="w-5 h-5 text-emerald-400" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-blue-400" />;
      default:
        return <FileText className="w-5 h-5 text-amber-400" />;
    }
  };

  const filteredFiles = files.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white select-none">
      {/* Top Bar */}
      <div className="px-4 pt-3 pb-2 border-b border-slate-800 flex items-center justify-between">
        <h1 className="text-base font-semibold text-slate-200 flex items-center gap-2">
          <Folder className="w-4 h-4 text-amber-400" />
          File Explorer
        </h1>
        <span className="text-[10px] text-slate-400 font-mono">/storage/emulated/0</span>
      </div>

      {/* Storage Gauge */}
      <div className="p-3 mx-3 my-2 rounded-xl bg-slate-900 border border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="flex items-center gap-1.5 font-medium text-slate-200">
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" /> Internal Storage
          </span>
          <span className="text-[11px] font-mono text-slate-400">79.8 GB / 128 GB (62%)</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden flex">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '62%' }} />
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-3 pb-2">
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
          <Search className="w-3.5 h-3.5 text-slate-500 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, scripts, media..."
            className="bg-transparent w-full focus:outline-none text-slate-200 text-xs"
          />
        </div>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 divide-y divide-slate-800/60">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            onClick={() => {
              soundFX.playTap();
              setSelectedFile(file);
            }}
            className="py-2.5 px-2 rounded-xl hover:bg-slate-900/80 cursor-pointer flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                {getFileIcon(file.type)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-slate-200 truncate">{file.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {file.size} • {file.modified}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => handleDelete(file.id, e)}
                className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* File Viewer Modal */}
      {selectedFile && (
        <div className="absolute inset-0 z-30 bg-black/95 flex flex-col p-4 animate-in fade-in">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              {getFileIcon(selectedFile.type)}
              <div>
                <div className="text-xs font-semibold text-white">{selectedFile.name}</div>
                <div className="text-[10px] font-mono text-slate-400">{selectedFile.path}</div>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1 rounded-full bg-slate-800 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 my-3 bg-slate-950 p-3 rounded-xl border border-slate-800 overflow-y-auto font-mono text-xs text-slate-300">
            <pre className="whitespace-pre-wrap leading-relaxed">{selectedFile.content || 'Binary data preview.'}</pre>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setSelectedFile(null)}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
