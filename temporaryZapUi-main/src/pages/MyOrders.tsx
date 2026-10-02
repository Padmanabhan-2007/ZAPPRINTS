import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Package, ArrowRight } from 'lucide-react';
import { getAuthHeaders, getSessionId } from '../utils/session';
import { auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { API_URL } from '../utils/api';

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

const getStatusClass = (status: string): string => {
  if (['QUEUED', 'CLAIMED', 'PROCESSING', 'CONFIRMED', 'PAYMENT_PENDING'].includes(status)) return 'badge-secondary';
  if (status === 'PRINTING') return 'badge-secondary';
  if (status === 'READY') return 'badge-primary';
  if (status === 'COMPLETED') return 'badge-primary';
  return 'badge-danger';
};

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const authHeaders = await getAuthHeaders();
        const sessionId = getSessionId();
        const res = await fetch(`${API_URL}/customer/orders?sessionId=${sessionId}`, {
          headers: authHeaders
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: '#22c55e' }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fcfbf9', minHeight: '80vh', padding: 'var(--space-8) var(--space-4)' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-6)' }}>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1e293b', letterSpacing: '-0.5px' }}>My Orders</h1>
            <p className="text-sm text-muted">Manage and track your print orders</p>
          </div>
          <Link to="/order" className="btn btn-primary" style={{ borderRadius: '30px', padding: '0.6rem 1.2rem' }}>
            New Print Job
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="card text-center" style={{ padding: '3rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#ffffff' }}>
            <Package size={48} style={{ margin: '0 auto var(--space-4) auto', color: '#64748b' }} />
            <h2 className="text-lg font-bold" style={{ marginBottom: 'var(--space-2)', color: '#1e293b' }}>No orders yet</h2>
            <p className="text-muted" style={{ marginBottom: 'var(--space-6)', maxWidth: '400px', margin: '0 auto var(--space-6) auto', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Ready to skip the print-shop run before class? Upload your documents and order now!
            </p>
            <Link to="/order" className="btn btn-primary" style={{ borderRadius: '30px', padding: '0.6rem 1.5rem' }}>Start Order</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="card hover-glow animate-fade-in" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#ffffff' }}>
                <div className="flex justify-between items-start flex-wrap gap-2" style={{ marginBottom: 'var(--space-3)' }}>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted" style={{ fontWeight: 600 }}>
                        ORDER ID: {order.id.slice(0, 8).toUpperCase()}
                      </span>
                      {order.humanOrderNumber && (
                        <span 
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            color: '#16a34a',
                            border: '1px solid rgba(34, 197, 94, 0.25)',
                            letterSpacing: '0.02em'
                          }}
                        >
                          Job #{order.humanOrderNumber}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold" style={{ color: '#1e293b', marginTop: '2px' }}>{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`badge ${getStatusClass(order.orderStatus)}`} style={{ padding: '0.3rem 0.8rem', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 600 }}>
                      {statusMap[order.orderStatus] || order.orderStatus}
                    </span>
                    <span
                      style={{
                        padding: '0.3rem 0.8rem',
                        borderRadius: '30px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
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
                
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <div className="text-xs text-muted" style={{ marginBottom: 'var(--space-2)', fontWeight: 600 }}>ITEMS</div>
                  <div className="flex flex-col gap-2">
                    {order.OrderItem?.map((item: any) => (
                      <div key={item.id} className="text-sm flex justify-between items-center flex-wrap gap-1" style={{ backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                        <span className="truncate font-medium" style={{ maxWidth: '240px', color: '#334155' }}>{item.originalFilename}</span>
                        <span className="font-semibold text-xs text-muted" style={{ flexShrink: 0 }}>
                          {item.copies} {item.copies > 1 ? 'copies' : 'copy'} • {item.colorMode === 'B_AND_W' ? 'B&W' : 'Color'} • {item.sides === 'FRONT_AND_BACK' ? 'Double-sided' : 'Single-sided'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <hr style={{ borderColor: 'rgba(0,0,0,0.05)', margin: '1rem 0' }} />

                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <span className="text-xs text-muted" style={{ fontWeight: 600 }}>TOTAL AMOUNT</span>
                    <div className="text-md font-bold" style={{ color: '#22c55e' }}>₹{Number(order.totalAmount).toFixed(2)}</div>
                  </div>
                  <Link to={`/orders/${order.id}`} className="btn flex items-center gap-2" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', borderRadius: '30px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#ffffff', color: '#1e293b' }}>
                    Track Order <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
