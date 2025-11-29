import React from 'react';
import { LayoutDashboard, MessageCircle, Image as ImageIcon, Wand2, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'telegram-sync', label: 'Telegram Sync', icon: MessageCircle },
    { id: 'media-library', label: 'Media Library', icon: ImageIcon },
    { id: 'ad-builder', label: 'Ads Builder AI', icon: Wand2 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 z-20 hidden md:flex">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
          AdsFlow
        </h1>
        <p className="text-xs text-slate-400 mt-1">Telegram Automation</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center space-x-3 text-slate-400 hover:text-red-400 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
          <LogOut size={20} />
          <span>Log Keluar</span>
        </button>
      </div>
    </aside>
  );
};
