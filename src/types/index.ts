export interface StorageData {
  isEnabled: boolean;
  interval: number;
  lastPingTime: string | null;
  status: 'success' | 'error' | 'running';
  pingUrl: string;
  lastError?: string;
  retryCount?: number;
}

export interface PingResponse {
  ok: boolean;
  status: number;
  statusText: string;
}

export interface Message {
  action: 'resetAlarm';
  interval?: number;
} 