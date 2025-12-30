
import React, { useState, useCallback } from 'react';
import { AppState, LSXData } from './types';
import { analyzeEmbroideryDesign } from './services/geminiService';
import { Uploader } from './components/Uploader';
import { LSXReport } from './components/LSXReport';

const FABRICS = [
  { id: 'Linen', name: 'Vải Linen (Lanh)', description: 'Thấm hút tốt, mộc mạc' },
  { id: 'Lụa Tơ Tằm', name: 'Lụa Tơ Tằm', description: 'Mềm mại, óng ả, cao cấp' },
  { id: 'Nhung', name: 'Vải Nhung', description: 'Dày, sang trọng, thêu nổi' },
  { id: 'Organza', name: 'Vải Organza (Tơ)', description: 'Trong suốt, bay bổng' },
  { id: 'Cotton', name: 'Vải Cotton', description: 'Bền màu, dễ thêu' },
  { id: 'Canvas', name: 'Vải Bố (Canvas)', description: 'Dày dặn, thêu túi/decor' }
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lsxData, setLsxData] = useState<LSXData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fabric, setFabric] = useState<string>(FABRICS[0].id);

  const handleImageSelect = useCallback(async (base64: string) => {
    setSelectedImage(base64);
    setState(AppState.ANALYZING);
    setError(null);

    try {
      const data = await analyzeEmbroideryDesign(base64, fabric);
      setLsxData(data);
      setState(AppState.RESULT);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError("Không thể phân tích ảnh. Vui lòng kiểm tra lại chất lượng hình ảnh thiết kế.");
      setState(AppState.ERROR);
    }
  }, [fabric]);

  const handleReset = () => {
    setState(AppState.IDLE);
    setSelectedImage(null);
    setLsxData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf2]">
      {/* Navigation / Header */}
      <nav className="metheu-gradient sticky top-0 z-50 border-b border-[#f8e1b3]/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-inner border-2 border-white/20 bg-[#7b1113]">
              <img src="./logo.png" alt="METHEU" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://api.dicebear.com/7.x/initials/svg?seed=Metheu&backgroundColor=7b1113&fontFamily=Playfair+Display')} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl tracking-tight text-[#f8e1b3]">METHEU</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#f8e1b3]/70 font-bold -mt-1">Hand-Embroidery Lab</p>
            </div>
          </div>
          
          {state !== AppState.IDLE && (
            <button 
              onClick={handleReset}
              className="text-[#f8e1b3] hover:bg-white/10 px-5 py-2 rounded-full border border-[#f8e1b3]/30 transition-all flex items-center gap-2 text-sm font-bold no-print"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Lập lệnh mới
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {state === AppState.IDLE && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="mb-12 max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-[#7b1113] text-[#f8e1b3] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-6 shadow-sm">
                Trợ lý Sản xuất Thông minh
              </span>
              <h2 className="font-serif text-6xl text-[#7b1113] mb-8 leading-tight">
                Nhận diện & Bóc tách <br/>
                <span className="italic text-[#a37e58]">Mọi dòng sản phẩm thêu</span>
              </h2>
              <p className="text-stone-700 text-lg leading-relaxed max-w-2xl mx-auto">
                Từ mũ, sổ tay đến váy vóc cao cấp, hệ thống AI của METHEU tự động nhận diện phôi sản phẩm
                và lập lộ trình thêu chi tiết nhất cho nghệ nhân.
              </p>
            </div>

            {/* Fabric Selection UI */}
            <div className="w-full max-w-5xl mb-16">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#7b1113]/50 mb-8">1. Chọn phôi vải thêu</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {FABRICS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFabric(f.id)}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 group relative overflow-hidden ${
                      fabric === f.id 
                        ? 'border-[#7b1113] bg-[#7b1113] text-[#f8e1b3] shadow-2xl scale-105' 
                        : 'border-[#f8e1b3] bg-white text-[#7b1113] hover:border-[#7b1113]'
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight uppercase tracking-wider">{f.name}</div>
                    <div className={`text-[9px] uppercase tracking-widest opacity-60 ${fabric === f.id ? 'text-[#f8e1b3]' : 'text-stone-400'}`}>
                      {f.id}
                    </div>
                    {fabric === f.id && (
                      <div className="absolute top-1 right-2 text-[#f8e1b3]/30 text-xl font-serif">★</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full max-w-2xl bg-white p-8 rounded-[2rem] shadow-xl border border-[#f8e1b3]/50">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#7b1113]/50 mb-8 text-left">2. Tải ảnh phôi hoặc thiết kế</h3>
              <Uploader onImageSelect={handleImageSelect} isAnalyzing={false} />
            </div>
          </div>
        )}

        {state === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative w-32 h-32 mb-10">
              <div className="absolute inset-0 border-4 border-[#f8e1b3] rounded-full scale-110 animate-pulse opacity-50"></div>
              <div className="absolute inset-0 border-2 border-[#7b1113] rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full border-2 border-[#f8e1b3]">
                <img src="./logo.png" alt="Analyzing" className="w-full h-full object-cover animate-pulse" />
              </div>
            </div>
            <h3 className="text-2xl font-serif text-[#7b1113] animate-pulse italic">Đang định danh sản phẩm & họa tiết...</h3>
            <p className="text-stone-500 mt-4 max-w-xs text-center text-sm leading-relaxed">
              Phân tích cấu trúc phôi và bóc tách kỹ thuật thêu cho vải <span className="font-bold text-[#7b1113] uppercase tracking-wider">{fabric}</span>.
            </p>
          </div>
        )}

        {state === AppState.RESULT && lsxData && selectedImage && (
          <LSXReport data={lsxData} imageUrl={selectedImage} />
        )}

        {state === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
             <div className="w-20 h-20 bg-red-50 text-[#7b1113] rounded-full flex items-center justify-center mb-8 shadow-inner">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             </div>
             <h3 className="text-2xl font-serif text-[#7b1113] mb-4">Không thể bóc tách thiết kế</h3>
             <p className="text-stone-500 mb-10 max-w-sm italic">"{error}"</p>
             <button 
               onClick={handleReset}
               className="px-10 py-4 metheu-gradient text-[#f8e1b3] rounded-full hover:shadow-2xl transition-all shadow-lg font-bold uppercase tracking-widest text-sm"
             >
               Thử lại với ảnh khác
             </button>
          </div>
        )}
      </main>

      <footer className="border-t border-[#f8e1b3] py-16 text-center bg-white/50 no-print">
        <div className="max-w-xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-full overflow-hidden border border-[#7b1113]/20 shadow-sm">
                <img src="./logo.png" alt="Logo Footer" className="w-full h-full object-cover" />
             </div>
             <span className="text-[#7b1113] font-bold tracking-widest text-xs uppercase">Metheu Embroidery Studio</span>
          </div>
          <p className="text-stone-400 text-[10px] leading-relaxed italic uppercase tracking-[0.1em]">
            Hệ thống hỗ trợ quản lý sản xuất được tinh chỉnh riêng cho tiêu chuẩn nghệ thuật METHEU Lab. 
            Mọi thông số mang tính chất tham khảo cho bộ phận điều phối.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
