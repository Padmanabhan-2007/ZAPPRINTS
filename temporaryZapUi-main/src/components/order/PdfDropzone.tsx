import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { motion } from 'motion/react';

interface PdfDropzoneProps {
  isDragActive: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  compact?: boolean;
}

const PdfDropzone: React.FC<PdfDropzoneProps> = ({
  isDragActive,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  compact = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`upload-dropzone ${compact ? 'compact' : ''} ${isDragActive ? 'drag-active' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Upload files"
      onClick={() => fileInputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <span className="up-mark"><Upload size={20} /></span>
      {!compact && <span className="up-corner">PDF · 50MB</span>}
      <span className="up-big">
        {isDragActive ? 'Drop to upload.' : compact ? 'Add more files' : <>Drop PDF files here,<br />or tap to browse.</>}
      </span>
      {compact && <span className="mono" style={{ color: 'var(--text-muted)' }}>PDF up to 50MB</span>}
      <input
        ref={fileInputRef}
        type="file"
        id="file-upload"
        multiple
        accept=".pdf,application/pdf"
        style={{ display: 'none' }}
        onChange={(e) => {
          onFileSelect(e);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
      />
    </motion.div>
  );
};

export default PdfDropzone;
