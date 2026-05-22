import { useRef, useState, useEffect } from 'react';
import { Button } from '../common/Button';

export const SignatureCanvas = ({ onSave, initialData }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';

    if (initialData) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setIsEmpty(false);
      };
      img.src = initialData;
    }
  }, [initialData]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    setIsEmpty(false);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      onSave(canvas.toDataURL('image/png'));
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Get correct mouse/touch coordinates relative to canvas
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e.type.includes('touch')) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      // Prevent scrolling while drawing on mobile
      e.preventDefault(); 
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onSave(null);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="border-2 border-neutral-300 border-dashed rounded-lg bg-neutral-50 overflow-hidden relative">
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-400 pointer-events-none">
            Tanda tangan di sini
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          className="w-full touch-none cursor-crosshair bg-transparent relative z-10"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
      </div>
      <div className="flex justify-end">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={clearCanvas}
          className="text-neutral-500 hover:text-red-600"
        >
          Hapus Ulang
        </Button>
      </div>
    </div>
  );
};
