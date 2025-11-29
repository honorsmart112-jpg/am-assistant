export type ProcessStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AdCopy {
  title: string;
  description: string;
  sellingPoints: string[];
  cta: string;
}

export interface MediaItem {
  id: string;
  originalUrl: string;
  source: 'telegram' | 'upload';
  importedAt: string; // ISO Date
  status: ProcessStatus;
  
  // Processed versions
  squareUrl?: string; // 1:1
  storyUrl?: string; // 9:16
  
  // AI Generated Content
  adCopy?: AdCopy;
  productName?: string; // Extracted or user input
}

export interface TelegramConfig {
  botToken: string;
  channelId: string;
  isConnected: boolean;
}

export type ViewState = 'dashboard' | 'telegram-sync' | 'media-library' | 'ad-builder';
