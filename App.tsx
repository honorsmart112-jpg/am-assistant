import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TelegramSync } from './components/TelegramSync';
import { MediaLibrary } from './components/MediaLibrary';
import { AdBuilder } from './components/AdBuilder';
import { ViewState, MediaItem, TelegramConfig } from './types';
import { processImage } from './services/imageProcessingService';

// Mock Data yang lebih realistik untuk demo
const MOCK_DATA = [
  { url: "https://picsum.photos/seed/shoes/800/800", name: "Kasut Sukan Running" },
  { url: "https://picsum.photos/seed/bag/600/800", name: "Beg Tangan Kulit Premium" },
  { url: "https://picsum.photos/seed/watch/1200/900", name: "Jam Tangan Pintar Pro" },
  { url: "https://picsum.photos/seed/skincare/800/800", name: "Serum Wajah Glowing" },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>({
    botToken: '',
    channelId: '',
    isConnected: false
  });

  // Helper untuk show notification
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle Telegram Connection
  const handleConnect = (token: string, channel: string) => {
    if (!token) {
      setTelegramConfig(prev => ({ ...prev, isConnected: false }));
      return;
    }
    setTelegramConfig({
      botToken: token,
      channelId: channel,
      isConnected: true
    });
    showToast("Bot Telegram Berjaya Disambungkan!");
  };

  // Simulate fetching images from Telegram Webhook
  const handleFetchUpdates = async () => {
    const newItems: MediaItem[] = [];
    const timestamp = new Date().toISOString();
    
    // Pick 1-2 random items to simulate incoming messages
    const count = Math.floor(Math.random() * 2) + 1;
    const shuffled = [...MOCK_DATA].sort(() => 0.5 - Math.random()).slice(0, count);

    for (let i = 0; i < shuffled.length; i++) {
      const data = shuffled[i];
      const id = Math.random().toString(36).substr(2, 9);
      
      // Auto Process immediately upon "receipt"
      const { square, story } = await processImage(data.url);

      newItems.push({
        id,
        originalUrl: data.url,
        source: 'telegram',
        importedAt: timestamp,
        status: 'completed',
        squareUrl: square,
        storyUrl: story,
        productName: data.name // Auto-assign realistic name
      });
    }

    setMediaItems(prev => [...newItems, ...prev]);
    showToast(`${newItems.length} gambar baru diterima dari Telegram!`);
    setCurrentView('media-library');
  };

  const handleUpdateMedia = (id: string, updates: Partial<MediaItem>) => {
    setMediaItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const handleDeleteMedia = (id: string) => {
    if (window.confirm("Padam gambar ini?")) {
      setMediaItems(prev => prev.filter(m => m.id !== id));
      showToast("Gambar dipadam.", 'info');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard media={mediaItems} setView={setCurrentView} />;
      case 'telegram-sync':
        return <TelegramSync config={telegramConfig} onConnect={handleConnect} onFetchUpdates={handleFetchUpdates} />;
      case 'media-library':
        return <MediaLibrary media={mediaItems} onDelete={handleDeleteMedia} onUpdateMedia={handleUpdateMedia} />;
      case 'ad-builder':
        return <AdBuilder media={mediaItems} onUpdateMedia={handleUpdateMedia} />;
      default:
        return <Dashboard media={mediaItems} setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-fadeIn">
          <div className={`px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-blue-600'
          }`}>
            {notification.message}
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 text-white p-4 z-20 flex justify-between items-center shadow-md">
        <h1 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text">AdsFlow</h1>
        <div className="flex gap-2">
          <button onClick={() => setCurrentView('dashboard')} className="text-xs bg-slate-800 px-3 py-1 rounded border border-slate-700">Home</button>
          <button onClick={() => setCurrentView('media-library')} className="text-xs bg-blue-600 px-3 py-1 rounded">Library</button>
        </div>
      </div>

      <main className="flex-1 md:ml-64 p-4 md:p-8 mt-14 md:mt-0 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;