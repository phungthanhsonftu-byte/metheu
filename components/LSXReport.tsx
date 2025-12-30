import React from 'react';
import { LSXData } from '../types';

interface LSXReportProps {
  data: LSXData;
  imageUrl: string;
}

export const LSXReport: React.FC<LSXReportProps> = ({ data, imageUrl }) => {
  const handlePrint = () => {
    window.print();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}p`;
    }
    return `${mins} phút`;
  };

  return (
    <div className="space-y-8">
      {/* Header với nút in */}
      <div className="flex justify-between items-center no-print">
        <div>
          <h2 className="text-3xl font-serif text-[#7b1113] font-bold">Lệnh Sản Xuất</h2>
          <p className="text-stone-500 text-sm mt-1">Mã đơn: <span className="font-mono font-bold text-[#7b1113]">{data.orderCode}</span></p>
        </div>
        <button
          onClick={handlePrint}
          className="px-8 py-3 metheu-gradient text-[#f8e1b3] rounded-full hover:shadow-2xl transition-all shadow-lg font-bold uppercase tracking-widest text-sm flex items-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          In LSX
        </button>
      </div>

      {/* Main Report Container */}
      <div className="lsx-container bg-white rounded-[2rem] shadow-2xl border-2 border-[#f8e1b3] overflow-hidden">
        {/* Print Header - only visible when printing */}
        <div className="hidden print:block p-8 border-b-2 border-[#f8e1b3] bg-gradient-to-r from-[#7b1113] to-[#5a0c0e]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-3xl text-[#f8e1b3] font-serif font-bold">M</span>
              </div>
              <div>
                <h1 className="text-3xl font-serif font-bold text-[#f8e1b3]">METHEU</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#f8e1b3]/70 font-bold">Hand-Embroidery Lab</p>
              </div>
            </div>
            <div className="text-right text-[#f8e1b3]">
              <p className="text-sm">Lệnh Sản Xuất</p>
              <p className="font-mono font-bold text-xl">{data.orderCode}</p>
            </div>
          </div>
        </div>

        {/* Thông tin tổng quan */}
        <div className="p-10 space-y-8">
          {/* Product Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold block mb-2">Loại Sản Phẩm</label>
                <p className="text-2xl font-serif text-[#7b1113] font-bold">{data.productType}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold block mb-2">Loại Vải</label>
                  <p className="text-lg text-[#7b1113] font-semibold">{data.fabric}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold block mb-2">Chủ Đề</label>
                  <p className="text-lg text-[#7b1113] font-semibold">{data.theme}</p>
                </div>
              </div>

              <div className="bg-[#7b1113] text-[#f8e1b3] rounded-2xl p-6 shadow-lg">
                <label className="text-[10px] uppercase tracking-[0.2em] opacity-70 font-bold block mb-2">Tổng Thời Gian Ước Tính</label>
                <p className="text-4xl font-serif font-bold">{formatTime(data.totalTime)}</p>
                <p className="text-xs mt-2 opacity-70">≈ {Math.ceil(data.totalTime / 480)} ngày làm việc (8h/ngày)</p>
              </div>
            </div>

            {/* Design Preview */}
            <div className="relative">
              <label className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold block mb-3">Thiết Kế Tham Khảo</label>
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-[#f8e1b3]">
                <img 
                  src={imageUrl} 
                  alt="Design" 
                  className="w-full h-auto object-contain bg-white"
                  style={{ maxHeight: '400px' }}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-[#7b1113] shadow-lg">
                  {data.details.length} họa tiết
                </div>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#7b1113]/50 mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#7b1113]/20"></span>
              Bảng Màu Chỉ DMC
            </h3>
            <div className="flex flex-wrap gap-3">
              {data.palette.map((color, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 bg-white border border-[#f8e1b3] rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div 
                    className="w-8 h-8 rounded-lg shadow-inner border-2 border-white ring-1 ring-stone-200" 
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <div>
                    <p className="font-mono text-xs text-stone-500 font-bold">{color.code}</p>
                    <p className="text-sm font-semibold text-[#7b1113]">{color.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chi tiết họa tiết */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#7b1113]/50 mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#7b1113]/20"></span>
              Chi Tiết Họa Tiết & Kỹ Thuật
            </h3>
            <div className="space-y-3">
              {data.details.map((detail, idx) => (
                <div 
                  key={idx}
                  className="bg-gradient-to-r from-white to-[#fdfaf2] border-l-4 border-[#7b1113] rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#7b1113] text-[#f8e1b3] flex items-center justify-center font-bold text-sm">
                          {detail.stt}
                        </span>
                        <h4 className="text-lg font-serif font-bold text-[#7b1113]">{detail.motif}</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block mb-1">Kỹ Thuật</span>
                          <p className="font-semibold text-[#7b1113]">{detail.technique}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block mb-1">Màu Chỉ</span>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-5 h-5 rounded border-2 border-white ring-1 ring-stone-200" 
                              style={{ backgroundColor: detail.colorHex }}
                            ></div>
                            <span className="font-mono text-xs font-bold">{detail.dmcCode}</span>
                            <span className="text-stone-600">- {detail.colorName}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block mb-1">Thời Gian</span>
                          <p className="font-bold text-[#7b1113]">{formatTime(detail.timeMinutes)}</p>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold block mb-1">Yêu Cầu Kỹ Thuật</span>
                        <p className="text-sm text-amber-900 leading-relaxed">{detail.technicalRequirement}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QC Note */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#7b1113] flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#f8e1b3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[#7b1113] mb-2">Ghi Chú Kiểm Tra Chất Lượng</h4>
                <p className="text-stone-700 leading-relaxed">{data.qcNote}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-[#f8e1b3] text-center text-xs text-stone-400 space-y-2">
            <p>Lệnh sản xuất này được tạo tự động bởi hệ thống METHEU Lab</p>
            <p className="font-mono text-[10px]">Generated: {new Date().toLocaleString('vi-VN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
