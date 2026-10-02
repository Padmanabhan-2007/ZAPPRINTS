import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, FileText, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import type { FileConfig } from '../../types/order';
import * as pdfjsLib from 'pdfjs-dist';

// Ensure worker is configured properly just like in pdf.ts
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

interface DocumentPreviewProps {
  fileConfig: FileConfig;
  onClose: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ fileConfig, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [scale, setScale] = useState(1.0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const isImage = fileConfig.file?.type.startsWith('image/');
  
  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    
    // Close on Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (!fileConfig.file) {
      setError('File content is not available for preview.');
      // Delay to avoid sync setState in effect
      setTimeout(() => setLoading(false), 0);
      return;
    }

    if (isImage) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    // It's a PDF
    let isActive = true;
    setError(null);
    setLoading(true);

    const loadPdf = async () => {
      try {
        const arrayBuffer = await fileConfig.file!.arrayBuffer();
        if (!isActive) return;
        const typedArray = new Uint8Array(arrayBuffer);
        
        const loadingTask = pdfjsLib.getDocument({
          data: typedArray,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
          cMapPacked: true,
          useWorkerFetch: false,
          useSystemFonts: true
        });
        
        const pdf = await loadingTask.promise;
        if (!isActive) return;
        setPdfDoc(pdf);
        setLoading(false);
      } catch (err) {
        if (!isActive) return;
        console.error('Error loading PDF preview:', err);
        setError('Preview unavailable for this PDF.');
        setLoading(false);
      }
    };
    
    loadPdf();
    
    return () => {
      isActive = false;
    };
  }, [fileConfig.file, isImage]);

  useEffect(() => {
    if (!pdfDoc || isImage || !canvasRef.current) return;
    
    let isActive = true;
    
    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (!isActive) return;
        
        const viewport = page.getViewport({ scale: scale * 1.5 }); // High DPI
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        if (!context) return;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // CSS pixels
        canvas.style.width = `${viewport.width / 1.5}px`;
        canvas.style.height = `${viewport.height / 1.5}px`;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        
        if (renderTaskRef.current) {
          await renderTaskRef.current.cancel();
        }
        
        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        
        await renderTask.promise;
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.error('Render error:', err);
        }
      }
    };
    
    renderPage();
    
    return () => {
      isActive = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageNum, scale, isImage]);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.25, 3.0));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));
  const handleNextPage = () => setPageNum(p => (pdfDoc ? Math.min(p + 1, pdfDoc.numPages) : p));
  const handlePrevPage = () => setPageNum(p => Math.max(p - 1, 1));
  
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isImage && fileConfig.file) {
      const url = URL.createObjectURL(fileConfig.file);
      setTimeout(() => setImgUrl(url), 0);
      return () => URL.revokeObjectURL(url);
    }
  }, [isImage, fileConfig.file]);

  return (
    <div className="preview-overlay" role="dialog" aria-modal="true" aria-labelledby="preview-title">
      <div className="preview-backdrop" onClick={onClose} />
      <div className="preview-container">
        
        <header className="preview-header">
          <div className="preview-title-group">
            {isImage ? <ImageIcon size={20} /> : <FileText size={20} />}
            <div>
              <h2 id="preview-title" className="preview-filename">{fileConfig.originalFilename}</h2>
              {pdfDoc && <span className="preview-pages">{pdfDoc.numPages} pages detected</span>}
            </div>
          </div>
          <button className="icon-btn preview-close" onClick={onClose} aria-label="Close preview" autoFocus>
            <X size={24} />
          </button>
        </header>
        
        <div className="preview-toolbar">
          {pdfDoc && (
            <div className="preview-nav">
              <button className="btn btn-secondary" onClick={handlePrevPage} disabled={pageNum <= 1} aria-label="Previous page">
                <ChevronLeft size={16} />
              </button>
              <span className="preview-page-indicator">
                {pageNum} / {pdfDoc.numPages}
              </span>
              <button className="btn btn-secondary" onClick={handleNextPage} disabled={pageNum >= pdfDoc.numPages} aria-label="Next page">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
          <div className="preview-zoom">
            <button className="btn btn-secondary" onClick={handleZoomOut} aria-label="Zoom out">
              <ZoomOut size={16} />
            </button>
            <span className="preview-zoom-indicator">{Math.round(scale * 100)}%</span>
            <button className="btn btn-secondary" onClick={handleZoomIn} aria-label="Zoom in">
              <ZoomIn size={16} />
            </button>
          </div>
        </div>

        <main className="preview-content-grid">
          {!loading && !error && !isImage && pdfDoc && (
            <aside className="preview-sidebar" aria-label="Page navigation">
              {Array.from({ length: pdfDoc.numPages }).map((_, i) => {
                const p = i + 1;
                const isSelected = fileConfig.printMode === 'SPECIFIC_PAGES' 
                  ? (fileConfig.pageRanges || []).some(r => p >= r.start && p <= r.end)
                  : true;
                
                return (
                  <button
                    key={p}
                    className={`preview-thumb-btn ${pageNum === p ? 'active' : ''} ${!isSelected ? 'muted' : ''}`}
                    onClick={() => setPageNum(p)}
                    aria-label={`Go to page ${p}`}
                    title={!isSelected ? `Page ${p} (Not printed)` : `Page ${p}`}
                  >
                    {p}
                  </button>
                );
              })}
            </aside>
          )}

          <div className="preview-main-area">
            {loading && (
              <div className="preview-loading">
                <Loader2 size={32} className="animate-spin" />
                <p>Preparing preview…</p>
              </div>
            )}
            
            {error && (
              <div className="preview-error">
                <AlertCircle size={32} />
                <p>{error}</p>
                <p className="preview-error-sub">Your file is still uploaded. You can close this and continue with your order.</p>
              </div>
            )}

            {!loading && !error && isImage && imgUrl && (
              <img 
                src={imgUrl} 
                alt={`Preview of ${fileConfig.originalFilename}`}
                style={{ transform: `scale(${scale})`, transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                className="preview-image"
              />
            )}

            {!loading && !error && !isImage && (
              <div 
                className="preview-pdf-wrapper"
                style={{ 
                  opacity: (fileConfig.printMode === 'SPECIFIC_PAGES' && !(fileConfig.pageRanges || []).some(r => pageNum >= r.start && pageNum <= r.end)) ? 0.3 : 1,
                  transition: 'opacity 0.2s'
                }}
              >
                <canvas ref={canvasRef} className="preview-pdf-canvas" />
                {(fileConfig.printMode === 'SPECIFIC_PAGES' && !(fileConfig.pageRanges || []).some(r => pageNum >= r.start && pageNum <= r.end)) && (
                  <div className="preview-page-skipped-label">Not in print range</div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentPreview;
