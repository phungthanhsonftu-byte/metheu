import React, { useRef, useState } from 'react';

interface UploaderProps {
  onImageSelect: (base64: string) => void;
  isAnalyzing: boolean;
}

export const Uploader: React.FC<UploaderProps> = ({ onImageSelect, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh (JPG, PNG, ...)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreviewUrl(base64);
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        disabled={isAnalyzing}
      />

      <div
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer
          transition-all duration-300 ease-in-out
          ${dragActive 
            ? 'border-[#7b1113] bg-[#7b1113]/5 scale-105' 
            : 'border-[#f8e1b3] bg-white hover:border-[#7b1113] hover:bg-[#fdfaf2]'
          }
          ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {previewUrl ? (
          <div className="space-y-4">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-64 mx-auto rounded-2xl shadow-lg border-2 border-[#f8e1b3]"
            />
            <p className="text-sm text-stone-500 italic">
              Click để chọn ảnh khác
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#7b1113] to-[#5a0c0e] flex items-center justify-center shadow-xl">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 text-[#f8e1b3]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
            
            <div>
              <p className="text-[#7b1113] font-bold text-lg mb-2">
                Kéo thả ảnh thiết kế vào đây
              </p>
              <p className="text-stone-500 text-sm">
                hoặc click để chọn file từ máy tính
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-stone-400 uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                JPG, PNG
              </span>
              <span className="w-1 h-1 rounded-full bg-stone-300"></span>
              <span>Tối đa 10MB</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
