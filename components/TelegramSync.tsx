import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { TelegramConfig } from '../types';

interface Props {
  config: TelegramConfig;
  onConnect: (token: string, channel: string) => void;
  onFetchUpdates: () => void;
}

export const TelegramSync: React.FC<Props> = ({ config, onConnect, onFetchUpdates }) => {
  const [token, setToken] = useState(config.botToken);
  const [channel, setChannel] = useState(config.channelId);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      onConnect(token, channel);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Telegram Sync</h2>
        <p className="text-slate-500">Sambungkan bot anda untuk automasi gambar produk.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Konfigurasi Bot</h3>
            {config.isConnected ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full flex items-center">
                <CheckCircle2 size={16} className="mr-1" /> Bersambung
              </span>
            ) : (
              <span className="px-3 py-1 bg-slate-100 text-slate-500 text-sm font-medium rounded-full">
                Tidak Bersambung
              </span>
            )}
          </div>

          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bot Token</label>
              <input 
                type="text" 
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                disabled={config.isConnected}
              />
              <p className="text-xs text-slate-400 mt-1">Dapatkan dari @BotFather</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Channel ID / Chat ID</label>
              <input 
                type="text" 
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                placeholder="@namachannel atau -100123456789"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                disabled={config.isConnected}
              />
            </div>

            {!config.isConnected ? (
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="animate-spin mr-2" size={18} />
                ) : (
                  <Send className="mr-2" size={18} />
                )}
                {isLoading ? 'Menghubungkan...' : 'Simpan & Sambung'}
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => onConnect('', '')} // Disconnect hack
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Putuskan Sambungan
              </button>
            )}
          </form>
        </div>

        {/* Sync Action Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <RefreshCw size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Simulasi Incoming Messages</h3>
          <p className="text-slate-600 mb-6 max-w-xs">
            Oleh kerana ini adalah demo web, kita tidak boleh menggunakan Webhook sebenar. Klik butang di bawah untuk mensimulasikan gambar masuk dari Telegram.
          </p>
          <button 
            onClick={onFetchUpdates}
            disabled={!config.isConnected}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tarik Gambar Terbaru
          </button>
          {!config.isConnected && (
            <p className="text-xs text-red-500 mt-2 flex items-center">
              <AlertCircle size={12} className="mr-1" />
              Sila sambungkan bot dahulu
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
