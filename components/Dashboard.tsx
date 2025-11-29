import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MediaItem } from '../types';
import { CheckCircle2, Image, UploadCloud, TrendingUp } from 'lucide-react';

interface Props {
  media: MediaItem[];
  setView: (view: any) => void;
}

export const Dashboard: React.FC<Props> = ({ media, setView }) => {
  const processedCount = media.filter(m => m.status === 'completed').length;
  const withCopyCount = media.filter(m => m.adCopy).length;

  const data = [
    { name: 'Imported', value: media.length },
    { name: 'Processed', value: processedCount },
    { name: 'AI Copy', value: withCopyCount },
    { name: 'Uploaded', value: Math.floor(processedCount * 0.8) }, // Mock uploaded stat
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500">Selamat kembali, ini status automasi ads anda hari ini.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Image size={24} />
            </div>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">+12%</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{media.length}</h3>
          <p className="text-slate-500 text-sm">Jumlah Gambar</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{withCopyCount}</h3>
          <p className="text-slate-500 text-sm">Ads Generated</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <CheckCircle2 size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{processedCount}</h3>
          <p className="text-slate-500 text-sm">Siap Diproses</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <UploadCloud size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">4.5s</h3>
          <p className="text-slate-500 text-sm">Purata Masa/Ads</p>
        </div>
      </div>

      {/* Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Prestasi Proses</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  cursor={{fill: '#F1F5F9'}}
                />
                <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl text-white flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-2">Mula Automasi</h3>
          <p className="text-slate-300 text-sm mb-6">Ada produk baru masuk di Telegram? Proses sekarang.</p>
          <button 
            onClick={() => setView('telegram-sync')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-3"
          >
            Sync Telegram
          </button>
          <button 
            onClick={() => setView('media-library')}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Lihat Galeri
          </button>
        </div>
      </div>
    </div>
  );
};
