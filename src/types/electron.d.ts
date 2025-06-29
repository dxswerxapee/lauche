export interface SystemInfo {
  platform: string;
  arch: string;
  version: string;
  totalMemory: number;
  freeMemory: number;
  cpus: number;
}

export interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
  getSystemInfo: () => Promise<SystemInfo>;
  showNotification: (title: string, body: string) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
} 