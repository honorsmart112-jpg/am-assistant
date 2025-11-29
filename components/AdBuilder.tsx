import React, { useState } from 'react';
import { Wand2, Save, Copy, Loader2, Check } from 'lucide-react';
import { MediaItem, AdCopy } from '../types';
import { generateAdCopy } from '../services/geminiService';

interface Props {
  media: MediaItem[];
  onUpdateMedia: (id: string, updates: Partial<MediaItem>) => void;
}

export const AdBuilder: React.FC<Props> = ({ media, onUpdateMedia }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [productNameInput, setProductNameInput] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const selectedItem = media.find(m => m.id === selectedId);

  const handleGenerate = async () => {
    if (!selectedItem || !productNameInput.trim()) return;

    setIsGenerating(true);
    try {
      // Use squareUrl (Base64 data) if available, otherwise fallback to originalUrl
      // Using Base64 ensures the AI can "see" the image content reliably in a browser environment
      const imageSource = selectedItem.squareUrl || selectedItem.originalUrl;
      
      const copy = await generateAdCopy(productNameInput, imageSource); 
      onUpdateMedia(selectedItem.id, {
        adCopy: copy,
        productName: productNameInput
      });
    } catch (error) {
      alert("Gagal menjana ayat iklan. Sila semak API Key anda.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col lg:flex-row gap-6">
      {/* Left: Gallery Selector */}
      <div className="lg:w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-700">Pilih Produk</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {media.length === 0 && (
            <div className="text-center p-8 text-slate-400">
              Tiada gambar dijumpai. Sila sync dari Telegram dahulu.
            </div>
          )}
          {media.map((item) => (
            <div 
              key={item.id}
              onClick={() => {
                setSelectedId(item.id);
                setProductNameInput(item.productName || '');
              }}
              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all border ${
                selectedId === item.id 
                  ? 'bg-blue-50 border-blue-500 shadow-sm' 
                  : 'hover:bg-slate-50 border-transparent'
              }`}
            >
              <img src={item.squareUrl || item.originalUrl} alt="Thumb" className="w-16 h-16 object-cover rounded-md bg-slate-200" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {item.productName || `Produk #${item.id.slice(0, 4)}`}
                </p>
                <p className="text-xs text-slate-500">
                  {item.adCopy ? '✅ Ada Copywriting' : '❌ Belum Jana'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Workspace */}
      <div className="lg:w-2/3 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        {!selectedItem ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <Wand2 size={48} className="mb-4 opacity-50" />
            <p>Pilih produk di sebelah kiri untuk mula menjana iklan.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-full md:w-1/3">
                <div className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative group">
                  <img src={selectedItem.squareUrl || selectedItem.originalUrl} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold px-2 py-1 bg-black/50 rounded">1080x1080</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Produk</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={productNameInput}
                      onChange={(e) => setProductNameInput(e.target.value)}
                      placeholder="Cth: Tudung Bawal Anti-Kedut"
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating || !productNameInput}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 className="animate-spin mr-2" size={18}/> : <Wand2 className="mr-2" size={18}/>}
                      Jana AI
                    </button>
                  </div>
                </div>

                {selectedItem.adCopy && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 relative group">
                      <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Tajuk (Headline)</label>
                      <p className="font-bold text-slate-800 text-lg">{selectedItem.adCopy.title}</p>
                      <button 
                        onClick={() => copyToClipboard(selectedItem.adCopy?.title || '', 'title')}
                        className="absolute top-2 right-2 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedField === 'title' ? <Check size={16}/> : <Copy size={16}/>}
                      </button>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 relative group">
                      <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Deskripsi</label>
                      <p className="text-slate-700 whitespace-pre-line text-sm leading-relaxed">{selectedItem.adCopy.description}</p>
                      <button 
                        onClick={() => copyToClipboard(selectedItem.adCopy?.description || '', 'desc')}
                        className="absolute top-2 right-2 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedField === 'desc' ? <Check size={16}/> : <Copy size={16}/>}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Selling Points</label>
                        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                          {selectedItem.adCopy.sellingPoints.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col justify-center items-center text-center">
                        <label className="text-xs font-bold text-blue-400 uppercase mb-1 block">CTA Cadangan</label>
                        <p className="text-blue-800 font-bold">{selectedItem.adCopy.cta}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};