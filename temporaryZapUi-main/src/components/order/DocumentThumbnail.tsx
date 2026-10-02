import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { FileText, Image as ImageIcon } from 'lucide-react';

if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

interface DocumentThumbnailProps {
  file?: File;
  isImage: boolean;
  onClick: () => void;
}

const DocumentThumbnail: React.FC<DocumentThumbnailProps> = ({ file, isImage, onClick }) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!file) return;

    if (isImage) {
      const url = URL.createObjectURL(file);
      setImgUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    // PDF
    let isActive = true;
    let renderTask: any = null;

    const renderThumbnail = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        if (!isActive) return;

        const typedArray = new Uint8Array(arrayBuffer);
        const loadingTask = pdfjsLib.getDocument({
          data: typedArray,
          useWorkerFetch: false,
          useSystemFonts: true
        });

        const pdf = await loadingTask.promise;
        if (!isActive) return;

        const page = await pdf.getPage(1); // first page only
        if (!isActive) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        if (!context) return;

        // Render very small for performance
        const viewport = page.getViewport({ scale: 0.25 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // Let CSS handle exact display size
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.objectFit = 'contain';

        renderTask = page.render({
          canvasContext: context,
          viewport: viewport
        } as any);

        await renderTask.promise;
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.error('Thumbnail render failed:', err);
          if (isActive) setError(true);
        }
      }
    };

    renderThumbnail();

    return () => {
      isActive = false;
      if (renderTask) {
        try {
          renderTask.cancel();
        } catch (e) {}
      }
    };
  }, [file, isImage]);

  return (
    <div 
      className="doc-thumbnail-btn"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      aria-label="Preview document"
    >
      {isImage && imgUrl ? (
        <img src={imgUrl} alt="Thumbnail" />
      ) : !isImage && !error ? (
        <canvas ref={canvasRef} />
      ) : (
        <div className="doc-thumbnail-fallback">
          {isImage ? <ImageIcon size={24} /> : <FileText size={24} />}
        </div>
      )}
    </div>
  );
};

export default DocumentThumbnail;
