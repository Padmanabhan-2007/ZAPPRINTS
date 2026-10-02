import React, { useState } from 'react';
import { X } from 'lucide-react';
// cache buster
import type { FileConfig, PageRange } from '../../types/order';
import { parsePageRangesInput, validatePageRanges } from '../../utils/pageRanges';

interface PageRangeEditorProps {
  fileConfig: FileConfig;
  onUpdate: (id: string, updates: Partial<FileConfig>) => void;
}

const PageRangeEditor: React.FC<PageRangeEditorProps> = ({ fileConfig, onUpdate }) => {
  const [newRangeInput, setNewRangeInput] = useState('');
  const [rangeError, setRangeError] = useState('');

  const handleAddRange = () => {
    if (!newRangeInput.trim()) return;
    
    try {
      const parsed = parsePageRangesInput(newRangeInput, fileConfig.pageCount || 1);
      const combined = [...(fileConfig.pageRanges || []), ...parsed];
      const validation = validatePageRanges(combined, fileConfig.pageCount || 1);
      
      if (!validation.isValid) {
        setRangeError(validation.error || 'Invalid range');
        return;
      }
      
      onUpdate(fileConfig.id, { pageRanges: combined });
      setNewRangeInput('');
      setRangeError('');
    } catch (err: any) {
      setRangeError(err.message || 'Invalid format');
    }
  };

  const removeRange = (rangeId: string) => {
    const filtered = (fileConfig.pageRanges || []).filter(r => r.id !== rangeId);
    onUpdate(fileConfig.id, { pageRanges: filtered });
  };

  const updateRange = (rangeId: string, updates: Partial<PageRange>) => {
    const updated = (fileConfig.pageRanges || []).map(r => r.id === rangeId ? { ...r, ...updates } : r);
    onUpdate(fileConfig.id, { pageRanges: updated });
  };

  const ranges = fileConfig.pageRanges || [];

  return (
    <div className="page-range-editor" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {ranges.map(range => (
        <div key={range.id} className="pr-row" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', background: 'var(--paper-sunk)', padding: '0.5rem', borderRadius: '8px' }}>
          <div className="mono" style={{ fontSize: '0.9rem', width: '60px', fontWeight: 600 }}>
            {range.start === range.end ? range.start : `${range.start}-${range.end}`}
          </div>
          
          <div className="seg compact" role="group" aria-label="Colour mode" style={{ flex: '1 1 auto' }}>
            <button type="button" aria-pressed={range.colorMode === 'B_AND_W'} onClick={() => updateRange(range.id, { colorMode: 'B_AND_W' })}>B&amp;W</button>
            <button type="button" aria-pressed={range.colorMode === 'COLOR'} onClick={() => updateRange(range.id, { colorMode: 'COLOR' })}>Colour</button>
          </div>

          <div className="seg compact" role="group" aria-label="Sides" style={{ flex: '1 1 auto' }}>
            <button type="button" aria-pressed={range.sides === 'FRONT_ONLY'} onClick={() => updateRange(range.id, { sides: 'FRONT_ONLY' })}>Single</button>
            <button type="button" aria-pressed={range.sides === 'FRONT_AND_BACK'} onClick={() => updateRange(range.id, { sides: 'FRONT_AND_BACK' })}>Duplex</button>
          </div>

          <div className="qty compact" style={{ flexShrink: 0 }}>
            <button type="button" aria-label="Fewer copies" onClick={() => updateRange(range.id, { copies: Math.max(1, range.copies - 1) })}>−</button>
            <input type="number" readOnly value={range.copies} style={{ width: '28px', textAlign: 'center', background: 'transparent', border: 'none', font: 'inherit' }} />
            <button type="button" aria-label="More copies" onClick={() => updateRange(range.id, { copies: range.copies + 1 })}>+</button>
          </div>

          <button type="button" className="icon-btn" onClick={() => removeRange(range.id)} title="Remove range" style={{ color: 'var(--color-danger)' }}>
            <X size={16} />
          </button>
        </div>
      ))}

      {ranges.length === 0 && (
        <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', background: 'var(--paper-sunk)', borderRadius: '8px' }}>
          No pages selected yet.
        </div>
      )}
      
      <div className="pr-add" style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
        <div style={{ flex: 1 }}>
          <input 
            type="text" 
            placeholder="e.g. 1-5, 8, 12-14" 
            value={newRangeInput}
            onChange={e => { setNewRangeInput(e.target.value); setRangeError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddRange(); } }}
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-page)', font: 'inherit', fontSize: '0.95rem' }}
          />
          {rangeError && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.35rem', fontWeight: 600 }}>{rangeError}</div>}
        </div>
        <button type="button" className="btn btn-secondary" onClick={handleAddRange}>
          Add
        </button>
      </div>
    </div>
  );
};

export default PageRangeEditor;
