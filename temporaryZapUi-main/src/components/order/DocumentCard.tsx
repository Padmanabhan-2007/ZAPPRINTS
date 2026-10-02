import React from 'react';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { FileConfig } from '../../types/order';
import { motion } from 'motion/react';
import PageRangeEditor from './PageRangeEditor';
import { calculateSelectedPages } from '../../utils/pageRanges';
import DocumentThumbnail from './DocumentThumbnail';

interface DocumentCardProps {
  fileConfig: FileConfig;
  isSoftBindingEnabled: boolean;
  softBindingPrice: number;
  onUpdate: (id: string, updates: Partial<FileConfig>) => void;
  onRemove: (id: string) => void;
  onPreview: (fileConfig: FileConfig) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  fileConfig,
  isSoftBindingEnabled,
  softBindingPrice,
  onUpdate,
  onRemove,
  onPreview
}) => {
  const isSpecificPages = fileConfig.printMode === 'SPECIFIC_PAGES';
  const selectedPagesCount = isSpecificPages ? calculateSelectedPages(fileConfig.pageRanges) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="file"
    >
      <div className="file-top">
        <DocumentThumbnail 
          file={fileConfig.file} 
          isImage={fileConfig.file?.type.startsWith('image/') || false}
          onClick={() => onPreview(fileConfig)}
        />
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <button type="button" className="file-name-btn" onClick={() => onPreview(fileConfig)} title="Preview file">
            <span className="file-name" title={fileConfig.originalFilename}>{fileConfig.originalFilename}</span>
          </button>
          {fileConfig.processingStatus === 'READY' && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button type="button" className="btn-preview" onClick={() => onPreview(fileConfig)} aria-label={`Preview ${fileConfig.originalFilename}`}>
                Preview
              </button>
              <button type="button" className="btn-preview" onClick={() => onRemove(fileConfig.id)} aria-label={`Remove ${fileConfig.originalFilename}`} style={{ color: 'var(--color-danger)' }}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {fileConfig.processingStatus === 'UPLOADING' && (
        <div className="file-state">
          <Loader2 size={14} className="animate-spin" />
          <span>Uploading document…</span>
        </div>
      )}
      {fileConfig.processingStatus === 'PROCESSING' && (
        <div className="file-state">
          <Loader2 size={14} className="animate-spin" />
          <span>Counting pages &amp; preparing estimate…</span>
        </div>
      )}
      {fileConfig.processingStatus === 'FAILED' && (
        <div className="file-state bad" role="alert">
          <AlertCircle size={14} />
          <span>Failed: {fileConfig.errorMessage}</span>
        </div>
      )}

      {fileConfig.processingStatus === 'READY' && (
        <>
          <div className="file-state ok">
            <CheckCircle2 size={14} />
            {fileConfig.pageCount !== undefined 
              ? (isSpecificPages 
                  ? `${fileConfig.pageCount} pages detected • ${selectedPagesCount} selected` 
                  : `${fileConfig.pageCount} ${fileConfig.pageCount === 1 ? 'page' : 'pages'} detected`) 
              : 'Ready'}
          </div>

          <div className="file-opts">
            {isSoftBindingEnabled && (
              <div>
                <span className="opt-label">Service</span>
                <div className="seg" role="group" aria-label="Service type">
                  <button type="button" aria-pressed={fileConfig.serviceType === 'A4_DOCUMENT'} onClick={() => onUpdate(fileConfig.id, { serviceType: 'A4_DOCUMENT' })}>
                    Print only
                  </button>
                  <button type="button" aria-pressed={fileConfig.serviceType === 'SOFT_BINDING'} onClick={() => onUpdate(fileConfig.id, { serviceType: 'SOFT_BINDING' })}>
                    + Soft binding ₹{softBindingPrice}
                  </button>
                </div>
              </div>
            )}

            <div>
              <span className="opt-label">Printing mode</span>
              <div className="seg" role="group" aria-label="Printing mode">
                <button type="button" aria-pressed={!isSpecificPages} onClick={() => onUpdate(fileConfig.id, { printMode: 'ENTIRE_FILE' })}>Entire file</button>
                <button type="button" aria-pressed={isSpecificPages} onClick={() => onUpdate(fileConfig.id, { printMode: 'SPECIFIC_PAGES' })}>Specific pages</button>
              </div>
            </div>

            {!isSpecificPages ? (
              <>
                <div className="opt-row">
                  <div>
                    <span className="opt-label">Colour</span>
                    <div className="seg" role="group" aria-label="Colour mode">
                      <button type="button" aria-pressed={fileConfig.colorMode === 'B_AND_W'} onClick={() => onUpdate(fileConfig.id, { colorMode: 'B_AND_W' })}>B&amp;W</button>
                      <button type="button" aria-pressed={fileConfig.colorMode === 'COLOR'} onClick={() => onUpdate(fileConfig.id, { colorMode: 'COLOR' })}>Colour</button>
                    </div>
                  </div>
                  <div>
                    <span className="opt-label">Sides</span>
                    <div className="seg" role="group" aria-label="Sides">
                      <button type="button" aria-pressed={fileConfig.sides === 'FRONT_ONLY'} onClick={() => onUpdate(fileConfig.id, { sides: 'FRONT_ONLY' })}>Single</button>
                      <button type="button" aria-pressed={fileConfig.sides === 'FRONT_AND_BACK'} onClick={() => onUpdate(fileConfig.id, { sides: 'FRONT_AND_BACK' })}>Duplex</button>
                    </div>
                  </div>
                </div>

                <div className="file-foot">
                  <div>
                    <span className="opt-label">Copies</span>
                    <div className="qty">
                      <button type="button" aria-label="Fewer copies" onClick={() => onUpdate(fileConfig.id, { copies: Math.max(1, fileConfig.copies - 1) })}>−</button>
                      <input
                        type="number"
                        inputMode="numeric"
                        aria-label="Copies"
                        min="1"
                        value={fileConfig.copies}
                        onChange={e => onUpdate(fileConfig.id, { copies: Math.max(1, parseInt(e.target.value) || 1) })}
                      />
                      <button type="button" aria-label="More copies" onClick={() => onUpdate(fileConfig.id, { copies: fileConfig.copies + 1 })}>+</button>
                    </div>
                  </div>
                  <div className="est">
                    <span className="opt-label" style={{ marginBottom: '0.25rem' }}>File estimate</span>
                    {fileConfig.liveEstimate !== undefined
                      ? <div className="v">₹{fileConfig.liveEstimate.toFixed(2)}</div>
                      : <div className="v pending">Calculating…</div>}
                  </div>
                </div>
              </>
            ) : (
              <>
                <PageRangeEditor fileConfig={fileConfig} onUpdate={onUpdate} />
                <div className="file-foot" style={{ marginTop: '0.5rem' }}>
                  <div className="est" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <span className="opt-label" style={{ marginBottom: '0.25rem' }}>Selected total</span>
                    {fileConfig.liveEstimate !== undefined
                      ? <div className="v">₹{fileConfig.liveEstimate.toFixed(2)}</div>
                      : <div className="v pending">Calculating…</div>}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default DocumentCard;
