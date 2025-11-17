import React, { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
  src: string | null;
}

const MAX_DIMENSION = 400; // Max width/height for higher quality

const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ isOpen, onClose, onSave, src }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (src && canvasRef.current) {
      setIsProcessing(true);
      setProcessedSrc(null);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let { width, height } = img;
        
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/png');
        setProcessedSrc(dataUrl);
        setIsProcessing(false);
      };
      img.onerror = () => {
          console.error("Failed to load image for processing.");
          alert("Could not process the selected image. Please try a different one.");
          setIsProcessing(false);
          onClose();
      }
      img.src = src;
    }
  }, [src, isOpen]);

  if (!isOpen || !src) return null;

  const handleSave = () => {
    if (processedSrc) {
      onSave(processedSrc);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">Logo Preview &amp; Resize</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 flex-grow flex flex-col items-center justify-center overflow-auto">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                Your logo has been automatically resized to fit within a {MAX_DIMENSION}x{MAX_DIMENSION} area to ensure quality.
            </p>
            <div className="border-2 border-dashed dark:border-gray-600 p-4 rounded-lg min-h-[150px] flex items-center justify-center">
                {isProcessing && (
                    <div className="w-64 h-64 flex items-center justify-center text-gray-500">Processing...</div>
                )}
                {processedSrc && (
                    <img src={processedSrc} alt="Logo Preview" className="max-w-full max-h-64 object-contain" />
                )}
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center space-x-2">
                <X size={20}/>
                <span>Cancel</span>
            </button>
            <button onClick={handleSave} disabled={isProcessing || !processedSrc} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center space-x-2 disabled:opacity-50">
                <Check size={20}/>
                <span>Confirm &amp; Save</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorModal;
