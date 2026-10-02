import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { FileConfig } from '../../types/order';

interface OrderSummaryProps {
  files: FileConfig[];
  totalEstimate: number;
  totalPages: number;
  totalPdfPages?: number;
  pagesToPrint?: number;
  totalCopies: number;
  hasSoftBinding: boolean;
  allReady: boolean;
  onCheckout: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  files,
  totalEstimate,
  totalPages,
  totalPdfPages,
  pagesToPrint,
  totalCopies,
  hasSoftBinding,
  allReady,
  onCheckout
}) => {
  return (
    <div className="summary">
      <div className="summary-head">
        <span className="mono"><b>Order summary</b></span>
        <span className="mono" style={{ color: 'var(--text-muted)' }}>Est.</span>
      </div>
      <div className="summary-body">
        <div className="dotrow"><span>Files</span><span>{files.length}</span></div>
        {files.length > 0 && (
          <>
            {totalPdfPages !== undefined && pagesToPrint !== undefined ? (
              <>
                <div className="dotrow"><span>PDF pages</span><span>{totalPdfPages}</span></div>
                <div className="dotrow"><span>Pages to print</span><span>{pagesToPrint}</span></div>
              </>
            ) : (
              <div className="dotrow"><span>Total pages</span><span>{totalPages}</span></div>
            )}
            <div className="dotrow"><span>Copies/Equiv.</span><span>{totalCopies}</span></div>
            {hasSoftBinding && (
              <div className="dotrow"><span>Service</span><span style={{ color: 'var(--color-accent)' }}>Soft binding</span></div>
            )}
          </>
        )}
      </div>
      <div className="summary-total">
        <span className="mono">Estimated total</span>
        <span className="amt">₹{totalEstimate.toFixed(2)}</span>
      </div>
      <div className="summary-foot">
        <p className="hint">Delivery slot and pickup location are chosen at checkout.</p>
        {files.length > 0 ? (
          <>
            <button
              type="button"
              className="btn btn-accent btn-lg btn-block"
              disabled={!allReady}
              onClick={onCheckout}
            >
              Continue to checkout <ArrowRight size={18} data-arrow />
            </button>
            {!allReady && <p className="hint bad">Please wait for all files to finish processing.</p>}
          </>
        ) : (
          <div className="empty-note">Upload documents to see your live estimate.</div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
