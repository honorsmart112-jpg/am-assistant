import React, { useState } from 'react';
import { Download, Facebook, Instagram, Trash2, Smartphone, Wand2, X, Copy, Check, Loader2 } from 'lucide-react';
import { MediaItem, AdCopy } from '../types';
import { generateAdCopy } from '../services/geminiService';

interface Props {
  media: MediaItem[];
  onDelete: (id: string) => void;
  onUpdateMedia: (id: string, updates: Partial<MediaItem>) => void;
}

export const MediaLibrary: React.FC<Props> = ({ media, onDelete, onUpdateMedia }) => {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const handleDownload = (url: string | undefined, filename: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Media Library</h2>
          <p className="text-slate-500">Pilih gambar untuk terus jana ayat iklan.</p>
        </div>
      </header>

      {media.length === 0 ? (
         <div className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
           <p className="text-slate-400 font-medium">Tiada media.</p>
           <p className="text-slate-400 text-sm mt-1">Sila pergi ke Telegram Sync untuk tarik gambar.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {media.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-lg transition-all duration-300">
              {/* Image Preview Area */}
              <div className="relative aspect-square bg-slate-100 cursor-pointer" onClick={() => setSelectedItem(item)}>
                <img src={item.squareUrl || item.originalUrl} alt="Product" className="w-full h-full object-cover" />
                
                {/* Status Indicator */}
                {item.adCopy && (
                  <div className="absolute top-2 left-2 bg-green-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                    AI READY
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center">
                     <Wand2 size={14} className="mr-2" />
                     Edit / Jana Ads
                   </div>
                </div>
              </div>
              
              {/* Card Content */}
              <div className="p-4">
                <h4 className="font-bold text-slate-800 truncate mb-1">
                  {item.productName || 'Produk Tanpa Nama'}
                </h4>
                <div className="flex justify-between items-center mt-3">
                   <p className="text-xs text-slate-400">
                     {new Date(item.importedAt).toLocaleDateString()}
                   </p>
                   <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="bg-slate-50 p-3 flex gap-2 border-t border-slate-100">
                 <button 
                  onClick={() => setSelectedItem(item)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center transition-colors"
                 >
                   <Wand2 size={14} className="mr-1.5" />
                   {item.adCopy ? 'Lihat Iklan' : 'Jana Iklan'}
                 </button>
                 <button 
                  onClick={() => handleDownload(item.squareUrl, `sq_${item.id}.jpg`)}
                  className="px-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center"
                  title="Download 1:1"
                 >
                   <Download size={14} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Ad Modal */}
      {selectedItem && (
        <QuickAdModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onUpdate={(updates) => onUpdateMedia(selectedItem.id, updates)}
        />
      )}
    </div>
  );
};

// --- Sub-Component: Quick Ad Modal ---
interface ModalProps {
  item: MediaItem;
  onClose: () => void;
  onUpdate: (updates: Partial<MediaItem>) => void;
}

const QuickAdModal: React.FC<ModalProps> = ({ item, onClose, onUpdate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [productName, setProductName] = useState(item.productName || '');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const imageSource = item.squareUrl || item.originalUrl;
      const copy = await generateAdCopy(productName, imageSource);
      onUpdate({ adCopy: copy, productName });
    } catch (e) {
      console.error(e);
      alert("Gagal menjana. Sila cuba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyFullAd = () => {
    if (!item.adCopy) return;
    const fullText = `${item.adCopy.title}\n\n${item.adCopy.description}\n\n${item.adCopy.sellingPoints.map(s => `✅ ${s}`).join('\n')}\n\n${item.adCopy.cta}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (url?: string, suffix?: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `ads_${suffix}_${item.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Image Preview & Downloads */}
        <div className="md:w-5/12 bg-slate-100 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Preview Gambar</h3>
            <div className="aspect-square bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-4">
              <img src={item.squareUrl || item.originalUrl} className="w-full h-full object-cover" alt="Preview" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleDownload(item.squareUrl, '1x1')} className="flex items-center justify-center gap-2 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50">
                <Download size={14}/> 1080x1080
              </button>
              <button onClick={() => handleDownload(item.storyUrl, '9x16')} className="flex items-center justify-center gap-2 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50">
                <Smartphone size={14}/> Story/Reels
              </button>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
             <p className="text-xs text-slate-400 text-center">Gambar telah di-optimumkan untuk Ads.</p>
          </div>
        </div>

        {/* Right: AI Ad Generator */}
        <div className="md:w-7/12 p-6 flex flex-col bg-white overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Wand2 className="text-blue-600" size={20} />
              AI Copywriting
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          {!item.adCopy ? (
            <div className="flex-1 flex flex-col justify-center items-center py-10">
              <div className="w-full max-w-sm space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Produk</label>
                  <input 
                    type="text" 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Contoh: Kerepek Pisang Salai"
                  />
                </div>
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !productName}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
                >
                  {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />}
                  Jana Iklan Sekarang
                </button>
                <p className="text-xs text-center text-slate-500">
                  AI akan analisis gambar & jana ayat jualan dalam Bahasa Melayu.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 space-y-4">
              {/* Result View */}
              <div className="space-y-4">
                 <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                   <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Headline</span>
                   <p className="font-bold text-slate-900 text-lg leading-tight mt-1">{item.adCopy.title}</p>
                 </div>
                 
                 <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Body Copy</span>
                   <p className="text-slate-700 text-sm whitespace-pre-line mt-1">{item.adCopy.description}</p>
                   
                   <div className="mt-3 space-y-1">
                     {item.adCopy.sellingPoints.map((pt, i) => (
                       <div key={i} className="flex items-start text-sm text-slate-600">
                         <Check size={14} className="text-green-500 mt-1 mr-2 shrink-0" />
                         {pt}
                       </div>
                     ))}
                   </div>
                   
                   <p className="mt-3 font-bold text-blue-600 text-sm">{item.adCopy.cta}</p>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                 <button 
                  onClick={copyFullAd}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg font-medium transition-colors"
                 >
                   {copied ? <Check size={18} /> : <Copy size={18} />}
                   {copied ? 'Disalin!' : 'Copy Semua'}
                 </button>
                 
                 <button 
                   onClick={() => alert("Membuka Facebook Marketplace API...")}
                   className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors shadow-lg shadow-blue-200"
                 >
                   <Facebook size={18} />
                   Upload FB
                 </button>
              </div>
              
              <button 
                onClick={() => onUpdate({ adCopy: undefined })} 
                className="w-full text-xs text-slate-400 hover:text-slate-600 py-2"
              >
                Jana semula ayat lain
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};