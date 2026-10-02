import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getAuthHeaders } from '../utils/session';
import { countPdfPagesClient } from '../utils/pdf';
import { API_URL, fetchWithTimeout } from '../utils/api';
import { calculateItemPrice } from '../utils/pricing';
import { calculateSelectedPages } from '../utils/pageRanges';
import SEOHead from '../components/SEOHead';
import OrderSteps from '../components/OrderSteps';
import PromoStrip from '../components/PromoStrip';
import PdfDropzone from '../components/order/PdfDropzone';
import DocumentCard from '../components/order/DocumentCard';
import DocumentPreview from '../components/order/DocumentPreview';
import OrderSummary from '../components/order/OrderSummary';
import type { FileConfig, PricingRates } from '../types/order';

const OrderBuilder: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [files, setFiles] = useState<FileConfig[]>([]);
  const [pollingList, setPollingList] = useState<string[]>([]);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  // Business Controls & Notices
  const [activeBanner, setActiveBanner] = useState<any>(null);
  const [activeHoliday, setActiveHoliday] = useState<any>(null);
  const [deliveryEstimation, setDeliveryEstimation] = useState<any>(null);
  const [workingCalendar, setWorkingCalendar] = useState<any>(null);
  const [isSoftBindingEnabled, setIsSoftBindingEnabled] = useState<boolean>(true);
  const [rates, setRates] = useState<PricingRates>({ bw: 3, color: 12, binding: 35 });
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<FileConfig | null>(null);

  useEffect(() => {
    fetchWithTimeout(`${API_URL}/config`)
      .then(res => res.json())
      .then(data => {
        if (data.activeBanner) setActiveBanner(data.activeBanner);
        if (data.deliveryEstimation) setDeliveryEstimation(data.deliveryEstimation);
        if (data.workingCalendar) setWorkingCalendar(data.workingCalendar);
        
        let newRates = { bw: 3, color: 12, binding: 35 };
        if (data.pricingRules && Array.isArray(data.pricingRules)) {
          const bindingRule = data.pricingRules.find((r: any) => r.ruleKey === 'SOFT_BINDING');
          const bwRule = data.pricingRules.find((r: any) => r.ruleKey === 'B_AND_W_PAGE');
          const colorRule = data.pricingRules.find((r: any) => r.ruleKey === 'COLOR_PAGE');
          
          if (bindingRule) {
            setIsSoftBindingEnabled(true);
            newRates.binding = Number(bindingRule.price) || 35;
          } else {
            setIsSoftBindingEnabled(false);
          }
          if (bwRule) newRates.bw = Number(bwRule.price) || 3;
          if (colorRule) newRates.color = Number(colorRule.price) || 12;
        }
        setRates(newRates);

        if (data.holidays && Array.isArray(data.holidays)) {
          const todayStr = new Date().toISOString().split('T')[0];
          const curr = data.holidays.find((h: any) => todayStr >= h.startDate && todayStr <= h.endDate);
          if (curr) setActiveHoliday(curr);
        }
      })
      .catch(err => console.error('Failed to load business controls config:', err));
  }, []);

  // Handle re-order configuration preload
  useEffect(() => {
    if (location.state?.reorderItems) {
      const items = location.state.reorderItems;
      const preloadedConfigs: FileConfig[] = items.map((item: any, idx: number) => {
        const pCount = item.pageCount || 1;
        const config: FileConfig = {
          id: `preload-${idx}-${Date.now()}`,
          originalFilename: item.originalFilename,
          displayPageCount: pCount,
          zapInternalPageValue: pCount,
          pageCount: pCount,
          colorMode: item.colorMode || 'B_AND_W',
          sides: item.sides || 'FRONT_ONLY',
          serviceType: item.serviceType || 'A4_DOCUMENT',
          copies: item.copies || 1,
          processingStatus: 'READY'
        };
        config.liveEstimate = calculateItemPrice({ ...config, pageCount: config.pageCount || 1 }, rates);
        return config;
      });
      setFiles(preloadedConfigs);
    }
  }, [location.state, rates]);

  const processFiles = async (rawFiles: File[]) => {
    if (!rawFiles || rawFiles.length === 0) return;

    for (const file of rawFiles) {
      const tempId = 'temp-' + Math.random().toString(36).substring(2, 9);
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

      const newFileConfig: FileConfig = {
        id: tempId,
        originalFilename: file.name,
        colorMode: 'B_AND_W',
        sides: 'FRONT_ONLY',
        serviceType: 'A4_DOCUMENT',
        copies: 1,
        processingStatus: 'UPLOADING',
        file: file
      };

      setFiles(prev => [...prev, newFileConfig]);

      let detectedPageCount: number | null = null;
      if (isPdf) {
        try {
          detectedPageCount = await countPdfPagesClient(file);
        } catch (err: any) {
          console.error('PDF page count failed for', file.name, err);
          setFiles(prev => prev.map(f => f.id === tempId ? {
            ...f,
            processingStatus: 'FAILED',
            errorMessage: "Couldn't read the page count for this PDF. Please try another file."
          } : f));
          continue;
        }
      }

      const displayPageCount = detectedPageCount ?? undefined;
      const zapInternalPageValue = detectedPageCount ?? undefined;

      const formData = new FormData();
      formData.append('file', file);
      if (zapInternalPageValue !== undefined) {
        formData.append('pageCount', zapInternalPageValue.toString());
      }

      try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${API_URL}/files/upload`, {
          method: 'POST',
          headers: authHeaders,
          body: formData
        });

        if (!res.ok) {
          let errMessage = 'Upload failed';
          try {
            const errData = await res.json();
            errMessage = errData.error || errMessage;
          } catch (e) {
            errMessage = `Upload failed with status ${res.status}`;
          }
          throw new Error(errMessage);
        }

        const data = await res.json();
        const finalPageCount = zapInternalPageValue ?? data.pageCount;

        setFiles(prev => prev.map(f => {
          if (f.id === tempId) {
            const updated: FileConfig = {
              ...f,
              id: data.id,
              displayPageCount: displayPageCount ?? data.pageCount,
              zapInternalPageValue: zapInternalPageValue ?? data.pageCount,
              pageCount: finalPageCount,
              processingStatus: data.status,
              errorMessage: data.errorMessage
            };
            if (updated.processingStatus === 'READY') {
              updated.liveEstimate = calculateItemPrice({ ...updated, pageCount: updated.pageCount || 1 }, rates);
            }
            return updated;
          }
          return f;
        }));

        if (data.status === 'PROCESSING') {
          setPollingList(prev => [...prev, data.id]);
        }
      } catch (err: any) {
        setFiles(prev => prev.map(f => f.id === tempId ? {
          ...f,
          processingStatus: 'FAILED',
          errorMessage: err.message
        } : f));
      }
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) setIsDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragActive(false);
  };
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    await processFiles(Array.from(e.target.files));
  };

  // Poll processing files
  useEffect(() => {
    if (pollingList.length === 0) return;
    const interval = setInterval(async () => {
      const activePolls = [...pollingList];
      for (const id of activePolls) {
        try {
          const authHeaders = await getAuthHeaders();
          const res = await fetch(`${API_URL}/files/${id}/status`, { headers: authHeaders });
          if (res.ok) {
            const data = await res.json();
            if (data.processingStatus !== 'PROCESSING') {
              setFiles(prev => prev.map(f => {
                if (f.id === id) {
                  const updated: FileConfig = {
                    ...f,
                    processingStatus: data.processingStatus,
                    pageCount: data.pageCount,
                    errorMessage: data.errorMessage
                  };
                  if (updated.processingStatus === 'READY') {
                    updated.liveEstimate = calculateItemPrice({ ...updated, pageCount: updated.pageCount || 1 }, rates);
                  }
                  return updated;
                }
                return f;
              }));
              setPollingList(prev => prev.filter(pId => pId !== id));
            }
          }
        } catch (err) {
          console.error('Status check failed', err);
        }
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [pollingList, rates]);

  // Sync to backend asynchronously
  const syncConfigToBackend = async (id: string, updates: Partial<FileConfig>) => {
    try {
      const authHeaders = await getAuthHeaders();
      await fetch(`${API_URL}/order-items/${id}/config`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify(updates)
      });
    } catch (e) {
      console.error('Failed to sync config to backend for', id, e);
    }
  };

  const updateFileConfig = (id: string, updates: Partial<FileConfig>) => {
    setFiles(prev => prev.map(f => {
      if (f.id !== id) return f;
      const nextFile = { ...f, ...updates };
      if (nextFile.processingStatus === 'READY') {
        nextFile.liveEstimate = calculateItemPrice({ ...nextFile, pageCount: nextFile.pageCount || 1 }, rates);
      }
      return nextFile;
    }));
    
    // Background sync to keep backend authoritative state correct
    syncConfigToBackend(id, updates);
  };

  const applyToAll = () => {
    if (files.length === 0) return;
    const firstConfig = files[0];
    const updates = {
      colorMode: firstConfig.colorMode,
      sides: firstConfig.sides,
      serviceType: firstConfig.serviceType,
      copies: firstConfig.copies
    };
    
    setFiles(prev => prev.map(f => {
      if (f.processingStatus !== 'READY') return f;
      const nextFile = { ...f, ...updates };
      nextFile.liveEstimate = calculateItemPrice({ ...nextFile, pageCount: nextFile.pageCount || 1 }, rates);
      if (f.id !== firstConfig.id) {
        syncConfigToBackend(f.id, updates);
      }
      return nextFile;
    }));
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const handleCheckout = () => {
    const readyFiles = files.filter(f => f.processingStatus === 'READY');
    const ids = readyFiles.map(f => f.id);
    navigate('/checkout', { state: { orderItemIds: ids, files: readyFiles } });
  };

  const allReady = files.length > 0 && files.every(f => f.processingStatus === 'READY');
  const totalEstimate = files.reduce((sum, f) => sum + (f.liveEstimate || 0), 0);
  
  const totalPdfPages = files.reduce((sum, f) => sum + (f.pageCount || f.displayPageCount || 1), 0);
  const pagesToPrint = files.reduce((sum, f) => {
    if (f.printMode === 'SPECIFIC_PAGES') {
      return sum + calculateSelectedPages(f.pageRanges);
    }
    return sum + ((f.pageCount || f.displayPageCount || 1) * (f.copies || 1));
  }, 0);
  
  const totalPages = pagesToPrint; // Legacy prop fallback

  const totalCopies = files.reduce((sum, f) => {
    if (f.printMode === 'SPECIFIC_PAGES' && f.pageRanges) {
      return sum + f.pageRanges.reduce((acc, r) => acc + (r.copies || 1), 0);
    }
    return sum + (f.copies || 1);
  }, 0);
  
  const hasSoftBinding = files.some(f => f.serviceType === 'SOFT_BINDING');
  const readyCount = files.filter(f => f.processingStatus === 'READY').length;

  return (
    <div className={`flow-page ${files.length > 0 ? 'has-mobile-cta' : ''}`}>
      <SEOHead
        title="Upload &amp; Customize Campus Print Order | ZapPrints"
        description="Upload PDF documents or images, configure copies, B&amp;W or color, single-sided or duplex, and get an instant live price estimate for campus pickup."
        canonicalPath="/order"
      />
      <div className="container">
        <div className="flow-hero">
          <div>
            <h1 className="flow-title rise">Build your <span className="italic-accent">order.</span></h1>
            <p className="flow-sub rise" style={{ '--d': '80ms' } as React.CSSProperties}>
              01 Upload → 02 Configure → 03 Review
            </p>
          </div>
          <OrderSteps current={files.length > 0 ? 2 : 1} />
        </div>

        {activeBanner && !isBannerDismissed && (
          <PromoStrip banner={activeBanner} onDismiss={() => setIsBannerDismissed(true)} />
        )}

        {(activeHoliday || (deliveryEstimation?.activeHolidayNotice)) && (
          <div className="notice warn" role="status">
            <div>
              <h4>We're on a short break</h4>
              <p>
                {activeHoliday?.message || deliveryEstimation?.activeHolidayNotice || "Orders can still be placed during this period."}
                {deliveryEstimation?.formattedDate && (
                  <strong style={{ display: 'block', marginTop: '0.25rem' }}>
                    Printing &amp; campus deliveries resume: {deliveryEstimation.formattedDate}.
                  </strong>
                )}
              </p>
            </div>
          </div>
        )}

        {workingCalendar && (
          <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginTop: '1rem' }}>
            <span className="eyebrow"><b>Delivery days</b></span>
            <div className="week">
              {[
                { label: 'Mon', key: 'monday' },
                { label: 'Tue', key: 'tuesday' },
                { label: 'Wed', key: 'wednesday' },
                { label: 'Thu', key: 'thursday' },
                { label: 'Fri', key: 'friday' },
                { label: 'Sat', key: 'saturday' },
                { label: 'Sun', key: 'sunday' },
              ].map(day => {
                const isOpen = Boolean((workingCalendar as any)[day.key]);
                return (
                  <span key={day.key} className={isOpen ? 'open' : ''} title={isOpen ? 'Delivering' : 'Closed'}>
                    {day.label}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className={`order-builder-layout ${files.length > 0 ? 'has-files' : 'empty-state'}`}>
          <div className="order-builder-left">
            <div className="eyebrow" style={{ marginBottom: '0.5rem' }}><b>01 Upload</b></div>
            <PdfDropzone
              isDragActive={isDragActive}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileSelect={handleFileSelect}
              compact={files.length > 0}
            />

            {files.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <div className="files-head">
                  <div>
                    <div className="eyebrow" style={{ marginBottom: '0.25rem' }}><b>02 Configure</b></div>
                    <h2>Your files ({files.length})</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    {files.length > 1 && (
                      <button type="button" className="btn btn-sm" onClick={applyToAll}>
                        Apply top settings to all
                      </button>
                    )}
                    <span className="eyebrow">{readyCount} of {files.length} ready</span>
                  </div>
                </div>

                {files.map((fileConfig) => (
                  <DocumentCard
                    key={fileConfig.id}
                    fileConfig={fileConfig}
                    isSoftBindingEnabled={isSoftBindingEnabled}
                    softBindingPrice={rates.binding}
                    onUpdate={updateFileConfig}
                    onRemove={removeFile}
                    onPreview={setPreviewFile}
                  />
                ))}
              </div>
            )}
          </div>

          {files.length === 0 && (
            <div className="ob-side">
              <div className="tb tb-white">
                <div className="tb-top"><span className="n">Files</span></div>
                <div><div className="tb-name">PDF, PNG, JPG</div><p className="tb-desc">Up to 50MB each. Word files aren&apos;t supported.</p></div>
              </div>
              <div className="tb tb-white">
                <div className="tb-top"><span className="n">Price</span></div>
                <div><div className="tb-name">Live estimate</div><p className="tb-desc">Pick colour, sides and copies and the total updates as you tap.</p></div>
              </div>
              <div className="tb tb-white">
                <div className="tb-top"><span className="n">Pickup</span></div>
                <div><div className="tb-name">Java Canteen</div><p className="tb-desc">Two pickup slots every day. Choose yours at checkout.</p></div>
              </div>
            </div>
          )}

          <div className="order-builder-right">
            <div className="eyebrow" style={{ marginBottom: '0.5rem' }}><b>03 Review</b></div>
            <OrderSummary
              files={files}
              totalEstimate={totalEstimate}
              totalPages={totalPages}
              totalPdfPages={totalPdfPages}
              pagesToPrint={pagesToPrint}
              totalCopies={totalCopies}
              hasSoftBinding={hasSoftBinding}
              allReady={allReady}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mobile-cta">
          <div className="t">
            <span className="mono">{allReady ? 'Estimated total' : 'Processing files…'}</span>
            <b>₹{totalEstimate.toFixed(2)}</b>
          </div>
          <button type="button" className="btn" disabled={!allReady} onClick={handleCheckout}>
            Checkout <ArrowRight size={16} data-arrow />
          </button>
        </div>
      )}

      {previewFile && (
        <DocumentPreview 
          fileConfig={previewFile} 
          onClose={() => setPreviewFile(null)} 
        />
      )}
    </div>
  );
};

export default OrderBuilder;
