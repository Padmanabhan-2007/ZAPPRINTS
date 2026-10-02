import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, RefreshCw, MapPin, Clock } from 'lucide-react';
import { getAuthHeaders } from '../utils/session';
import { auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { API_URL } from '../utils/api';
import { CutePrinter404 } from './NotFound';

const statusMap: Record<string, string> = {
  PAYMENT_PENDING: 'Preparing (Payment Pending)',
  CONFIRMED: 'Preparing',
  QUEUED: 'Preparing',
  CLAIMED: 'Preparing',
  PROCESSING: 'Preparing',
  PRINTING: 'Printing',
  READY: 'Ready for Pickup',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded'
};

const getStepIndex = (status: string): number => {
  if (status === 'COMPLETED') return 4;
  if (status === 'READY') return 3;
  if (status === 'PRINTING') return 2;
  if (['QUEUED', 'CLAIMED', 'PROCESSING', 'CONFIRMED', 'PAYMENT_PENDING'].includes(status)) return 1;
  return 0;
};

const OrderTracker: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${API_URL}/customer/orders/${id}`, {
          headers: authHeaders
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to retrieve order details');
        }

        const data = await res.json();
        setOrder(data.order);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [id, navigate]);

  const handleOrderAgain = () => {
    if (!order || !order.OrderItem) return;
    navigate('/order', {
      state: {
        reorderItems: order.OrderItem.map((item: any) => ({
          originalFilename: item.originalFilename,
          copies: item.copies,
          colorMode: item.colorMode,
          sides: item.sides,
          serviceType: item.serviceType
        }))
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: '#22c55e' }} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <CutePrinter404
        title="Order Not Found"
        message={error || "We couldn't locate this print job in our database. It might have expired or the order link is incorrect."}
      />
    );
  }

  const step = getStepIndex(order.orderStatus);

  return (
    <div style={{ backgroundColor: '#fcfbf9', minHeight: '80vh', padding: 'var(--space-8) var(--space-4)' }}>
      <div className="container" style={{ maxWidth: '650px', margin: '0 auto' }}>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <Link to="/orders" className="flex items-center gap-2 text-muted text-sm font-medium hover:text-primary" style={{ display: 'inline-flex', marginBottom: 'var(--space-4)' }}>
            <ArrowLeft size={16} /> Back to My Orders
          </Link>
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold" style={{ color: '#1e293b', letterSpacing: '-0.5px' }}>
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </h1>
                {order.humanOrderNumber && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      color: '#16a34a',
                      border: '1px solid rgba(34, 197, 94, 0.25)'
                    }}
                  >
                    Job #{order.humanOrderNumber}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted">Ordered on {new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
            </div>
            <button onClick={handleOrderAgain} className="btn flex items-center gap-2" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', borderRadius: '30px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#ffffff', color: '#1e293b', cursor: 'pointer' }}>
              <RefreshCw size={14} /> Order Again
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        {step > 0 && (
          <div className="card" style={{ marginBottom: 'var(--space-6)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#ffffff' }}>
            <div className="flex flex-col gap-2" style={{ marginBottom: '1.5rem' }}>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm" style={{ color: '#64748b' }}>Order Status:</span>
                <span className="font-bold text-sm" style={{ color: '#22c55e' }}>{statusMap[order.orderStatus] || order.orderStatus}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm" style={{ color: '#64748b' }}>Delivery Status:</span>
                <span
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    backgroundColor:
                      order.deliveryStatus === 'DELIVERED'
                        ? 'rgba(34, 197, 94, 0.1)'
                        : order.deliveryStatus === 'OUT_FOR_DELIVERY'
                        ? 'rgba(234, 88, 12, 0.1)'
                        : 'rgba(100, 116, 139, 0.1)',
                    color:
                      order.deliveryStatus === 'DELIVERED'
                        ? '#16a34a'
                        : order.deliveryStatus === 'OUT_FOR_DELIVERY'
                        ? '#ea580c'
                        : '#64748b',
                    border:
                      order.deliveryStatus === 'DELIVERED'
                        ? '1px solid rgba(34, 197, 94, 0.3)'
                        : order.deliveryStatus === 'OUT_FOR_DELIVERY'
                        ? '1px solid rgba(234, 88, 12, 0.3)'
                        : '1px solid rgba(100, 116, 139, 0.2)'
                  }}
                >
                  {order.deliveryStatus === 'DELIVERED'
                    ? '✓ Delivered'
                    : order.deliveryStatus === 'OUT_FOR_DELIVERY'
                    ? '🚚 Out for Delivery'
                    : 'Delivery Pending'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center relative" style={{ padding: '0 0.5rem' }}>
              {/* Step Line Progress */}
              <div style={{ position: 'absolute', left: '10%', right: '10%', top: '15px', height: '4px', backgroundColor: '#e2e8f0', zIndex: 1 }}>
                <div style={{ 
                  height: '100%', 
                  backgroundColor: '#22c55e', 
                  width: `${((step - 1) / 3) * 100}%`,
                  transition: 'width 0.4s ease'
                }} />
              </div>

              {[
                { label: 'Preparing', num: 1 },
                { label: 'Printing', num: 2 },
                { label: 'Ready', num: 3 },
                { label: 'Completed', num: 4 }
              ].map((s) => (
                <div key={s.num} className="flex flex-col items-center" style={{ zIndex: 2 }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: step >= s.num ? '#22c55e' : '#ffffff',
                    border: `2px solid ${step >= s.num ? '#22c55e' : '#cbd5e1'}`,
                    color: step >= s.num ? 'white' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: 'var(--space-2)'
                  }}>
                    {s.num}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: step >= s.num ? '#22c55e' : '#64748b' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collection Details */}
        <div className="card" style={{ marginBottom: 'var(--space-6)', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', padding: '2rem', backgroundColor: '#ffffff' }}>
          <h2 className="text-lg font-bold" style={{ marginBottom: '1.25rem', color: '#1e293b', letterSpacing: '-0.3px' }}>Collection Details</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center" style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(34,197,94,0.08)', color: '#22c55e' }}>
                <MapPin size={18} />
              </div>
              <div>
                <div className="text-xs text-muted" style={{ fontWeight: 600 }}>PICKUP LOCATION</div>
                <div className="text-sm font-semibold" style={{ color: '#1e293b' }}>{order.DeliveryLocation?.name || 'Java Canteen'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center" style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(34,197,94,0.08)', color: '#22c55e' }}>
                <Clock size={18} />
              </div>
              <div>
                <div className="text-xs text-muted" style={{ fontWeight: 600 }}>DELIVERY SLOT</div>
                <div className="text-sm font-semibold" style={{ color: '#1e293b' }}>{order.DeliverySlot ? `${order.DeliverySlot.startTime} - ${order.DeliverySlot.endTime}` : 'Morning Slot'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Item Summary */}
        <div className="card" style={{ borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', padding: '2rem', backgroundColor: '#ffffff' }}>
          <h2 className="text-lg font-bold" style={{ marginBottom: '1.25rem', color: '#1e293b', letterSpacing: '-0.3px' }}>Receipt & Items</h2>
          <div className="flex flex-col gap-3" style={{ marginBottom: 'var(--space-4)' }}>
            {order.OrderItem?.map((item: any) => (
              <div key={item.id} className="flex justify-between items-start" style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '12px' }}>
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#334155' }}>{item.originalFilename}</div>
                  <div className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>{item.copies} {item.copies > 1 ? 'copies' : 'copy'} • {item.colorMode === 'B_AND_W' ? 'Black & White' : 'Color'} • {item.sides === 'FRONT_ONLY' ? 'Single Sided' : 'Double Sided'}</div>
                </div>
                <span className="text-sm font-bold" style={{ color: '#1e293b' }}>₹{Number(item.liveEstimate || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <hr style={{ borderColor: 'rgba(0,0,0,0.05)', margin: '1.5rem 0' }} />

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm text-muted">
              <span>Subtotal</span>
              <span className="font-semibold">₹{Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted">
              <span>Delivery Fee</span>
              <span className="font-semibold">₹{Number(order.deliveryFee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-md" style={{ color: '#22c55e', marginTop: 'var(--space-2)' }}>
              <span>Paid Amount</span>
              <span>₹{Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;
