
import { LSXData } from '../types';
import React from 'react';

interface LSXReportProps {
  data: LSXData;
  imageUrl: string;
}

export const LSXReport: React.FC<LSXReportProps> = ({ data, imageUrl }) => {
  const handleCopyMarkdown = () => {
    const markdown = `
# LỆNH SẢN XUẤT - METHEU
- **Mã lệnh:** ${data.orderCode}
- **Loại sản phẩm:** ${data.productType}
- **Phôi vải:** ${data.fabric}
- **Chủ đề:** ${data.theme}

## CHI TIẾT KỸ THUẬT & MÀU CHỈ
| STT | Họa tiết | Kỹ thuật | Màu chỉ DMC | Thời gian | Yêu cầu kỹ thuật |
|-----|----------|----------|-------------|-----------|------------------|
${data.details.map(d => `| ${d.stt} | ${d.motif} | ${d.technique} | #${d.dmcCode} (${d.colorName}) | ${d.timeMinutes} | ${d.technicalRequirement} |`).join('\n')}
| **TỔNG CỘNG** | | | | **${data.totalTime} phút** | |

## GHI CHÚ QC
${data.qcNote}

--
Quản lý sản xuất: (Ký tên)
    `;
    navigator.clipboard.writeText(markdown);
    alert('Đã sao chép mã Markdown!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 main-content">
      {/* Nút thao tác - Ẩn khi in */}
      <div className="flex justify-end gap-3 no-print">
        <button 
          onClick={handleCopyMarkdown}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#f8e1b3] text-[#7b1113] rounded-full text-xs font-bold transition-all hover:bg-stone-50 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          Sao chép Markdown
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-8 py-2.5 metheu-gradient text-[#f8e1b3] rounded-full text-xs font-bold transition-all shadow-lg hover:brightness-110 uppercase tracking-widest"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Xuất Lệnh sản xuất (PDF)
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Xem trước thiết kế */}
        <div className="lg:w-1/3 no-print">
          <div className="sticky top-24 p-6 bg-white rounded-3xl shadow-xl border border-[#f8e1b3]/30">
            <div className="flex items-center gap-2 mb-6 border-b border-[#f8e1b3]/50 pb-4">
               <div className="w-2 h-2 bg-[#7b1113] rounded-full"></div>
               <h3 className="font-serif text-xl text-[#7b1113] italic">Mẫu thiết kế</h3>
            </div>
            <div className="relative group">
              <img src={imageUrl} alt="Design" className="w-full h-auto rounded-xl object-contain bg-[#fdfaf2] border border-[#f8e1b3]/20 shadow-inner" />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl"></div>
            </div>
            <div className="mt-6 p-4 bg-[#7b1113]/5 rounded-xl border-l-4 border-[#7b1113] text-[#7b1113] text-sm italic leading-relaxed">
              "Lưu ý bám sát bảng phối màu chỉ DMC bên dưới để đảm bảo linh hồn cho tác phẩm."
            </div>
          </div>
        </div>

        {/* Tài liệu Lệnh sản xuất chính */}
        <div className="lg:w-2/3 space-y-8 flex-1">
          <div className="p-12 bg-white rounded-[2.5rem] shadow-2xl border border-[#f8e1b3]/50 linen-texture lsx-container min-h-[1100px] relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#7b1113]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Ảnh xem trước chỉ hiện khi IN */}
            <div className="hidden print:block mb-10 text-center border-b border-stone-100 pb-10">
               <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-300 mb-6">Mẫu thiết kế kỹ thuật đính kèm</div>
               <img src={imageUrl} alt="Design Print" className="max-h-72 mx-auto rounded-lg border border-[#f8e1b3]/50 shadow-sm" />
            </div>

            <div className="flex justify-between items-start mb-16 relative z-10">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg border border-[#f8e1b3]">
                  <img src="./logo.png" alt="Logo Metheu" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-[#7b1113] text-[10px] font-bold uppercase tracking-[0.4em] mb-1">Xưởng Thêu Thủ Công Metheu</div>
                  <h1 className="font-serif text-5xl text-[#7b1113] mb-3 leading-none tracking-tight">Lệnh Sản Xuất</h1>
                  <div className="h-1 w-32 bg-[#7b1113] rounded-full"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-stone-400 uppercase font-bold tracking-[0.2em] mb-2">Số lệnh hệ thống</div>
                <div className="text-2xl font-mono font-bold text-[#7b1113] bg-[#7b1113]/5 px-4 py-2 rounded-lg border border-[#7b1113]/10">{data.orderCode}</div>
                <div className="text-[10px] text-stone-400 mt-2 uppercase italic font-medium">Ngày lập: {new Date().toLocaleDateString('vi-VN')}</div>
              </div>
            </div>

            <section className="mb-14">
              <h2 className="text-[11px] font-bold uppercase text-[#7b1113]/40 mb-6 tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#f8e1b3]"></span> I. Thông tin định danh
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-1 group">
                  <div className="text-[9px] text-stone-400 uppercase font-bold tracking-widest">Loại sản phẩm</div>
                  <div className="text-[#7b1113] font-bold border-b border-[#f8e1b3]/30 pb-2 text-lg group-hover:border-[#7b1113] transition-colors">{data.productType}</div>
                </div>
                <div className="space-y-1 group">
                  <div className="text-[9px] text-stone-400 uppercase font-bold tracking-widest">Chất liệu phôi</div>
                  <div className="text-[#7b1113] font-bold border-b border-[#f8e1b3]/30 pb-2 text-lg group-hover:border-[#7b1113] transition-colors">{data.fabric}</div>
                </div>
                <div className="space-y-1 group">
                  <div className="text-[9px] text-stone-400 uppercase font-bold tracking-widest">Chủ đề</div>
                  <div className="text-[#7b1113] font-medium border-b border-[#f8e1b3]/30 pb-2 text-lg italic group-hover:border-[#7b1113] transition-colors truncate">{data.theme}</div>
                </div>
              </div>
            </section>

            <section className="mb-14">
              <h2 className="text-[11px] font-bold uppercase text-[#7b1113]/40 mb-6 tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#f8e1b3]"></span> II. Phác đồ kỹ thuật & Màu chỉ
              </h2>
              <div className="overflow-hidden rounded-2xl border border-[#f8e1b3] shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#7b1113]/5 text-[#7b1113] text-[9px] uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-5 py-4 font-bold w-12 text-center border-r border-[#f8e1b3]">#</th>
                      <th className="px-5 py-4 font-bold border-r border-[#f8e1b3]">Họa tiết</th>
                      <th className="px-5 py-4 font-bold border-r border-[#f8e1b3]">Màu chỉ thêu</th>
                      <th className="px-5 py-4 font-bold border-r border-[#f8e1b3]">Kỹ thuật</th>
                      <th className="px-5 py-4 font-bold text-center w-20">TG (P)</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-[#f8e1b3]/50">
                    {data.details.map((item) => (
                      <tr key={item.stt} className="hover:bg-[#fdfaf2] transition-colors">
                        <td className="px-5 py-5 text-[#7b1113]/30 font-mono text-center border-r border-[#f8e1b3]/30">{item.stt}</td>
                        <td className="px-5 py-5">
                          <div className="font-bold text-[#7b1113] uppercase tracking-wide text-xs">{item.motif}</div>
                          <div className="text-[10px] text-stone-500 mt-1.5 leading-relaxed italic">{item.technicalRequirement}</div>
                        </td>
                        <td className="px-5 py-5 border-l border-r border-[#f8e1b3]/30">
                           <div className="flex items-center gap-3">
                              <div 
                                className="w-8 h-8 rounded-md shadow-inner border border-black/5 shrink-0" 
                                style={{ backgroundColor: item.colorHex }}
                              ></div>
                              <div>
                                <div className="font-mono font-black text-[#7b1113] text-xs">#{item.dmcCode}</div>
                                <div className="text-[10px] text-stone-400 font-bold uppercase truncate max-w-[100px]">{item.colorName}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-5 py-5 text-stone-600 font-medium text-xs leading-relaxed">{item.technique}</td>
                        <td className="px-5 py-5 text-center font-bold text-[#7b1113]">{item.timeMinutes}</td>
                      </tr>
                    ))}
                    <tr className="bg-[#7b1113] metheu-gradient">
                      <td colSpan={4} className="px-5 py-6 text-right font-bold uppercase text-[#f8e1b3] text-[10px] tracking-[0.3em]">Tổng thời gian thêu dự kiến</td>
                      <td className="px-5 py-6 text-center font-black text-2xl text-[#f8e1b3] italic">
                        {data.totalTime}'
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-14">
              <h2 className="text-[11px] font-bold uppercase text-[#7b1113]/40 mb-6 tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#f8e1b3]"></span> III. Bảng phối sắc hệ thống (DMC Palette)
              </h2>
              <div className="flex flex-wrap gap-4">
                {data.palette.map((color) => (
                  <div key={color.code} className="flex items-center gap-4 p-3 pr-6 bg-white rounded-xl border border-[#f8e1b3] shadow-sm min-w-[150px] hover:shadow-md transition-all group">
                    <div className="w-12 h-12 rounded-lg shadow-inner border border-black/5 group-hover:scale-110 transition-transform" style={{ backgroundColor: color.hex }}></div>
                    <div>
                      <div className="text-xs font-black leading-none text-[#7b1113] tracking-tighter">Mã #{color.code}</div>
                      <div className="text-[9px] text-stone-400 uppercase font-black tracking-widest mt-2">{color.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-2 gap-12 pt-12 border-t border-[#f8e1b3]/50 mt-20 relative z-10">
              <div className="space-y-4">
                <h2 className="text-[10px] font-bold uppercase text-[#7b1113]/50 tracking-[0.3em]">IV. Kiểm soát chất lượng (QC)</h2>
                <div className="p-6 bg-[#fdfaf2] rounded-2xl text-stone-700 text-[11px] leading-relaxed border border-[#f8e1b3] italic shadow-inner">
                  {data.qcNote}
                </div>
              </div>
              <div className="flex flex-col justify-end items-center space-y-16 pt-4">
                 <div className="text-center">
                    <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#7b1113]/40 mb-2">Ký duyệt Quản lý Xưởng</div>
                    <div className="w-56 border-b border-[#7b1113]/30 relative h-16 mx-auto mt-8">
                        <img src="./logo.png" alt="Dấu xưởng" className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 opacity-30 grayscale rotate-[-15deg]" />
                    </div>
                 </div>
              </div>
            </section>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#f8e1b3] text-xl opacity-50">★</div>
          </div>
          
          <div className="text-center text-[10px] text-stone-300 font-bold uppercase tracking-[0.5em] no-print py-4">
            Metheu Production AI System &copy; 2025
          </div>
        </div>
      </div>
    </div>
  );
};
