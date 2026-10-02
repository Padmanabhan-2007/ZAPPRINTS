import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ReceiptPrinter, type ReceiptPrinterStage } from '../components/printAnimation/ReceiptPrinter';
import { ArrowRight, Home, Printer, CheckCircle2 } from 'lucide-react';
import { getAuthHeaders } from '../utils/session';
import { API_URL } from '../utils/api';
import OrderSteps from '../components/OrderSteps';

export const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stateData = location.state as { order?: any; orderId?: string } | undefined;

  const [order, setOrder] = useState<any>(stateData?.order || null);
  const [stage, setStage] = useState<ReceiptPrinterStage>('processing');
  const [showActions, setShowActions] = useState<boolean>(false);

  // Scroll to top immediately so the receipt animation is visible
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Fetch full order if only orderId was passed or if we need fresh item details
  useEffect(() => {
    const fetchOrder = async () => {
      const orderId = stateData?.orderId || stateData?.order?.id;
      if (!orderId) return;

      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_URL}/customer/orders/${orderId}`, {
          headers
        });
        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            setOrder(data.order);
          }
        }
      } catch (err) {
        console.error('Failed to fetch full order details for success screen:', err);
      }
    };

    if (!stateData?.order || !stateData?.order?.OrderItem) {
      fetchOrder();
    }
  }, [stateData]);

  // Handle stage timeline: processing -> printing -> complete
  useEffect(() => {
    // 1. Start in 'processing'
    const printTimer = setTimeout(() => {
      setStage('printing');
    }, 1200);

    // 2. Transition to 'complete' after printing keyframes finish (1.75s + buffer)
    const completeTimer = setTimeout(() => {
      setStage('complete');
    }, 3400);

    // 3. Reveal final actions cleanly
    const actionsTimer = setTimeout(() => {
      setShowActions(true);
    }, 3800);

    return () => {
      clearTimeout(printTimer);
      clearTimeout(completeTimer);
      clearTimeout(actionsTimer);
    };
  }, []);

  // Format order date cleanly (e.g. "21 Aug 2026, 01:45 AM")
  const formatDate = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const displayOrderId = order?.humanOrderNumber
    ? `#${order.humanOrderNumber}`
    : (order?.id
    ? `#${order.id.slice(0, 8).toUpperCase()}`
    : (stateData?.order?.humanOrderNumber
    ? `#${stateData.order.humanOrderNumber}`
    : (stateData?.orderId
    ? `#${stateData.orderId.slice(0, 8).toUpperCase()}`
    : '#ORDER')));

  const totalAmount = order?.totalAmount
    ? Number(order.totalAmount).toFixed(2)
    : stateData?.order?.totalAmount
    ? Number(stateData.order.totalAmount).toFixed(2)
    : '0.00';

  const items = order?.OrderItem || stateData?.order?.OrderItem || [];
  const itemCount = items.length || 1;
  const customerName = order?.customerName || stateData?.order?.customerName || 'Customer';
  const customerPhone = order?.customerPhone || stateData?.order?.customerPhone;
  const pickupLocation = order?.DeliveryLocation?.name || stateData?.order?.DeliveryLocation?.name || 'Java Canteen';
  const deliverySlot = order?.DeliverySlot
    ? `${order.DeliverySlot.startTime} - ${order.DeliverySlot.endTime}`
    : stateData?.order?.DeliverySlot
    ? `${stateData.order.DeliverySlot.startTime} - ${stateData.order.DeliverySlot.endTime}`
    : 'Standard Slot';

  return (
    <div className="done-page">
      <div className="container done-wrap">
        <OrderSteps current={4} />

        {/* Receipt Printer Visual Component */}
        <ReceiptPrinter.Root stage={stage}>
          <ReceiptPrinter.Machine>
            <ReceiptPrinter.Header>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Printer size={18} style={{ color: 'var(--color-accent-light)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.5px', color: '#f8fafc' }}>
                  ZAP PRINTS
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '20px'
                }}
              >
                LIVE TERMINAL
              </span>
            </ReceiptPrinter.Header>

            <ReceiptPrinter.Screen>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Order Confirmed
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                      {displayOrderId}
                    </div>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-accent-light)' }}>
                    ₹{totalAmount}
                  </div>
                </div>

                <ReceiptPrinter.Status />
              </div>
            </ReceiptPrinter.Screen>
          </ReceiptPrinter.Machine>

          <ReceiptPrinter.Output>
            <ReceiptPrinter.Paper>
              {/* Receipt Header */}
              <div style={{ textAlign: 'center', marginBottom: '1rem', borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.75rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '1px', color: '#0f172a' }}>
                  ZAPPRINTS
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                  Smart Printing. Delivered.
                </div>
              </div>

              {/* Order Meta */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Order No:</span>
                  <span style={{ fontWeight: 700 }}>{displayOrderId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Customer:</span>
                  <span style={{ fontWeight: 600 }}>{customerName}</span>
                </div>
                {customerPhone && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Phone:</span>
                    <span>{customerPhone}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Date:</span>
                  <span>{formatDate(order?.createdAt)}</span>
                </div>
              </div>

              {/* Collection & Delivery Details */}
              <div style={{ borderTop: '1px dashed #cbd5e1', borderBottom: '1px dashed #cbd5e1', padding: '0.6rem 0', margin: '0.6rem 0', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Pickup Hub:</span>
                  <span style={{ fontWeight: 600 }}>{pickupLocation}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Slot:</span>
                  <span style={{ fontWeight: 600 }}>{deliverySlot}</span>
                </div>
              </div>

              {/* Items Summary */}
              <div style={{ fontSize: '0.78rem', marginBottom: '0.85rem' }}>
                <div style={{ color: '#64748b', fontWeight: 600, marginBottom: '0.35rem' }}>
                  ITEMS ({itemCount} document{itemCount > 1 ? 's' : ''})
                </div>
                {items.length > 0 ? (
                  items.map((item: any, idx: number) => (
                    <div key={item.id || idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                        {item.originalFilename || `Document #${idx + 1}`}
                      </span>
                      <span>
                        {item.copies}x {item.colorMode === 'B_AND_W' ? 'B&W' : 'Color'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Print Order Bundle</span>
                    <span>{itemCount} file</span>
                  </div>
                )}
              </div>

              {/* Payment Summary */}
              <div style={{ borderTop: '1px solid #0f172a', paddingTop: '0.6rem', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.95rem' }}>
                  <span>TOTAL PAID</span>
                  <span style={{ color: 'var(--orange)' }}>₹{totalAmount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--orange)', fontWeight: 700 }}>
                  <span>PAYMENT STATUS</span>
                  <span>✓ PAID (ONLINE)</span>
                </div>
              </div>

              {/* Receipt Footer */}
              <div style={{ marginTop: '1.25rem', textAlign: 'center', borderTop: '1px dashed #cbd5e1', paddingTop: '0.75rem', fontSize: '0.72rem', color: '#64748b' }}>
                <div>Thank you for choosing ZapPrints!</div>
                <div style={{ marginTop: '2px', fontWeight: 600 }}>Your prints are being prepared.</div>
              </div>
            </ReceiptPrinter.Paper>
          </ReceiptPrinter.Output>
        </ReceiptPrinter.Root>

        {/* Post-print confirmation message and next steps */}
        <div
          className="done-head"
          style={{
            marginTop: '-0.5rem',
            opacity: showActions ? 1 : 0,
            transform: showActions ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            pointerEvents: showActions ? 'auto' : 'none'
          }}
        >
          <div className="eyebrow" style={{ color: 'var(--color-accent)' }}>
            <CheckCircle2 size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
            Payment received
          </div>
          <h1 style={{ marginTop: '0.75rem' }}>Order <span className="italic-accent">confirmed.</span></h1>
          <p>Your prints have been received and are being prepared.</p>

          <div className="done-actions" style={{ marginTop: '1.75rem' }}>
            <button
              type="button"
              onClick={() => {
                const targetId = order?.id || stateData?.orderId;
                if (targetId) {
                  navigate(`/orders/${targetId}`);
                } else {
                  navigate('/orders');
                }
              }}
              className="btn btn-primary btn-lg"
            >
              Track my order <ArrowRight size={18} data-arrow />
            </button>

            <Link to="/" className="btn btn-secondary btn-lg">
              <Home size={16} /> Back to home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;
