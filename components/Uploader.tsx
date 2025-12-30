
import React, { useRef, useState, useEffect } from 'react';

interface UploaderProps {
  onImageSelect: (base64: string) => void;
  isAnalyzing: boolean;
}

export const Uploader: React.FC<UploaderProps> = ({ onImageSelect, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền trình duyệt.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCameraActive(false);
  };

  const capturePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        stopCamera();
        onImageSelect(dataUrl);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="w-full">
      <div 
        className={`flex flex-col items-center justify-center p-12 border-2 border-dashed border-[#f8e1b3] rounded-[2rem] bg-[#fdfaf2]/50 hover:bg-white transition-all overflow-hidden ${isCameraActive ? '' : 'cursor-pointer'}`}
        onClick={() => !isAnalyzing && !isCameraActive && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        
        <canvas ref={canvasRef} className="hidden" />

        {isCameraActive ? (
          <div className="w-full flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
            <div className="relative w-full aspect-square md:aspect-video bg-stone-900 rounded-[1.5rem] overflow-hidden shadow-2xl border-4 border-[#f8e1b3]/30">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#7b1113]/10 mix-blend-overlay"></div>
              <div className="absolute top-6 left-6 flex items-center gap-3 px-4 py-1.5 bg-[#7b1113] rounded-full shadow-lg">
                <div className="w-4 h-4 rounded-full overflow-hidden">
                  <img src="./logo.png" alt="Icon" className="w-full h-full object-cover" />
                </div>
                <span className="text-[#f8e1b3] text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                  Studio View
                </span>
              </div>
            </div>
            <div className="flex gap-4 w-full">
              <button 
                onClick={stopCamera}
                className="flex-1 py-4 px-8 bg-stone-100 text-[#7b1113] rounded-2xl font-bold hover:bg-stone-200 transition-colors uppercase tracking-widest text-xs"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={capturePhoto}
                className="flex-[2] py-4 px-8 metheu-gradient text-[#f8e1b3] rounded-2xl font-black hover:brightness-110 shadow-xl flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs"
              >
                <div className="w-5 h-5 rounded-full border-2 border-[#f8e1b3] relative">
                  <div className="absolute inset-1 bg-[#f8e1b3] rounded-full scale-50"></div>
                </div>
                Chụp mẫu thêu
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 p-6 rounded-full bg-[#7b1113]/5 text-[#7b1113] shadow-inner border border-[#f8e1b3]/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-serif text-[#7b1113] mb-3 italic">Bản vẽ & Phác thảo</h3>
            <p className="text-stone-500 text-center max-w-sm text-sm mb-10 leading-relaxed font-medium">
              {isAnalyzing 
                ? "Hệ thống đang bóc tách từng họa tiết..." 
                : "Tải lên hoặc chụp trực tiếp mẫu vẽ tay, ảnh chụp sản phẩm mẫu để lập lệnh sản xuất."}
            </p>
            
            {!isAnalyzing && (
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <button className="flex-1 px-8 py-4 metheu-gradient text-[#f8e1b3] rounded-2xl hover:shadow-2xl transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Tải tệp ảnh
                </button>
                <button 
                  onClick={startCamera}
                  className="flex-1 px-8 py-4 bg-white text-[#7b1113] border-2 border-[#7b1113] rounded-2xl hover:bg-[#7b1113] hover:text-[#f8e1b3] transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Camera
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
