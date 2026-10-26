/**
 * Types for Aegis OmniAutomate AI Mobile OS
 */

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type ActionCategory =
  | 'calling'
  | 'messaging'
  | 'coding'
  | 'browsing'
  | 'app_control'
  | 'system_settings'
  | 'camera_gallery'
  | 'file_system';

export type ActionStatus =
  | 'pending_permission'
  | 'authorized'
  | 'denied'
  | 'executing'
  | 'completed'
  | 'failed';

export interface ActionStep {
  id: string;
  targetApp: string;
  category: ActionCategory;
  title: string;
  details: string;
  riskLevel: RiskLevel;
  permissionRequested: string;
  payload: Record<string, any>;
  status: ActionStatus;
  timestamp: string;
  executionResult?: {
    output?: string;
    error?: string;
    executionTimeMs?: number;
    meta?: Record<string, any>;
  };
}

export interface PlanResponse {
  detectedLanguage?: string;
  intentSummary: string;
  explanation: string;
  requiresPermission: boolean;
  actionPlan: ActionStep[];
  poweredBy?: string;
  warning?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'file';
  mimeType: string;
  data: string; // base64 or object URL
  size?: number;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  actionTitle: string;
  category: ActionCategory;
  targetApp: string;
  permission: string;
  riskLevel: RiskLevel;
  decision: 'authorized' | 'denied';
  payloadSummary: string;
  executionStatus: 'success' | 'failed' | 'cancelled';
  userNotes?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatarColor: string;
  recentCall?: string;
}

export interface ChatThread {
  id: string;
  contactName: string;
  app: 'Messages' | 'WhatsApp' | 'Telegram';
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: {
    id: string;
    sender: 'user' | 'contact' | 'ai';
    text: string;
    timestamp: string;
  }[];
}

export interface FileItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder' | 'code' | 'image' | 'doc';
  size: string;
  modified: string;
  content?: string;
}

export type AIModelBrainId =
  | 'gemini-3.8-flash'
  | 'gemini-4-argon'
  | 'gemini-3.1-flash-lite'
  | 'local-npu';

export interface AIModelBrainConfig {
  id: AIModelBrainId;
  name: string;
  tagline: string;
  badge: string;
  color: string;
  latencyRating: 'Ultra-Fast (0-150ms)' | 'Fast (200-500ms)' | 'Deep Reasoning (1-3s)' | 'Instant (0ms Offline)';
  reasoningLevel: 'Low' | 'Medium' | 'High' | 'Deep Thinking';
  supportedModalities: string[];
  description: string;
}

export type DeviceMode = 'simulator' | 'real_mobile';
export type UILayoutMode = 'auto' | 'mobile_fullscreen' | 'desktop_studio';

export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  rssi?: number; // dBm
  connected: boolean;
  batteryLevel?: number;
  services?: string[];
  lastSeen: string;
}

export interface RealMobileBridgeState {
  isConnected: boolean;
  isBluetoothConnected: boolean;
  bluetoothDevice?: BluetoothDeviceInfo | null;
  deviceId: string;
  deviceName: string;
  pairingPin: string;
  batteryLevel?: number;
  isCharging?: boolean;
  latitude?: number;
  longitude?: number;
  networkType?: string;
  lastPing: string;
}

export interface DeviceSettings {
  wifi: boolean;
  bluetooth: boolean;
  cellular5G: boolean;
  airplaneMode: boolean;
  flashlight: boolean;
  locationGps: boolean;
  batterySaver: boolean;
  doNotDisturb: boolean;
  volume: number; // 0 - 100
  brightness: number; // 0 - 100
  batteryLevel: number; // 88%
}

