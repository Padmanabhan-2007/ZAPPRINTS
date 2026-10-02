import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
import { getAuthHeaders } from '../utils/session';
import { loadRazorpayScript } from '../utils/razorpay';
import { API_URL, fetchWithTimeout } from '../utils/api';
import { getAvailableLocationsForSlot, getValidDeliveryLocationOnSlotChange } from '../utils/delivery';
import { getSavedCustomer, saveCustomer } from '../utils/customerStorage';
import OrderSteps from '../components/OrderSteps';

const isSlotSelectable = (startTime: string): boolean => {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  const [slotHour, slotMinute] = startTime.split(':').map(Number);
  if (slotHour === undefined || slotMinute === undefined) return false;

  let cutoffHour = slotHour;
  let cutoffMinute = slotMinute - 20;

  if (cutoffMinute < 0) {
    cutoffHour -= 1;
    cutoffMinute += 60;
  }

  if (currentHours < cutoffHour) {
    return true;
  } else if (currentHours === cutoffHour && currentMinutes < cutoffMinute) {
    return true;
  }
  return false;
};

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderItemIds = location.state?.orderItemIds || [];

  const [formData, setFormData] = useState(() => {
    const saved = getSavedCustomer();
    return {
      name: saved.name || '',
      phone: saved.phone || '',
      deliveryLocation: '',
      deliverySlot: ''
    };
  });

  const [allLocations, setAllLocations] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [slotLocationMap, setSlotLocationMap] = useState<Record<string, string[]>>({});
  const [deliveryEstimation, setDeliveryEstimation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderState, setOrderState] = useState<any>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [capacityData, setCapacityData] = useState<any>(null);

  // Guarantee checkout starts at top position immediately upon mounting
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (orderItemIds.length === 0) {
      navigate('/order');
      return;
    }

    // Load locations, slots, slotLocationMap, and delivery estimation
    fetchWithTimeout(`${API_URL}/config`)
      .then((res) => res.json())
      .then((data) => {
        setAllLocations(data.deliveryLocations || []);
        setSlots(data.deliverySlots || []);
        setSlotLocationMap(data.slotLocationMap || {});
        if (data.deliveryEstimation) {
          setDeliveryEstimation(data.deliveryEstimation);
        }
      })
      .catch((err) => {
        console.error('Failed to load configs', err);
        setError('Failed to load locations and slots config');
      });

    // Check printer capacity for these items
    getAuthHeaders().then(authHeaders => {
      fetch(`${API_URL}/delivery-slots/capacity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ orderItemIds })
      })
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setCapacityData(data);
          }
        })
        .catch(err => {
          console.error('Failed to load slot capacity', err);
        });
    });
  }, [orderItemIds, navigate]);

  const selectSlot = (newSlotId: string) => {
    const validLocation = getValidDeliveryLocationOnSlotChange(
      newSlotId,
      formData.deliveryLocation,
      slotLocationMap
    );

    setFormData((prev) => ({
      ...prev,
      deliverySlot: newSlotId,
      deliveryLocation: validLocation
    }));
    setOrderState(null);
  };

  const selectLocation = (locationId: string) => {
    setFormData((prev) => ({ ...prev, deliveryLocation: locationId }));
    setOrderState(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (e.target.name === 'deliveryLocation') {
      setOrderState(null);
    }
  };

  // Compute available locations for the currently selected slot using stable IDs
  const availableLocations = getAvailableLocationsForSlot(
    formData.deliverySlot,
    slotLocationMap,
    allLocations
  );

  const handlePayment = async () => {
    if (!orderState) return;
    setPaymentProcessing(true);
    setError('');

    try {
      const authHeaders = await getAuthHeaders();
      const createRes = await fetch(`${API_URL}/payments/razorpay/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({
          orderId: orderState.id
        })
      });

      const createContentType = createRes.headers.get('content-type') || '';
      if (!createContentType.includes('application/json')) {
        const text = await createRes.text();
        console.error('Payment Create Response Non-JSON:', {
          status: createRes.status,
          url: createRes.url,
          contentType: createContentType,
          body: text
        });
        throw new Error(`Server returned non-JSON response (HTTP ${createRes.status})`);
      }

      const createData = await createRes.json();
      if (!createRes.ok) {
        throw new Error(createData.error || 'Failed to create payment intent');
      }

      const { razorpayOrderId, amount, keyId } = createData;

      const options = {
        key: keyId,
        amount: amount,
        currency: 'INR',
        name: 'Zap Prints',
        description: 'Print Order Payment',
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${API_URL}/payments/razorpay/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...authHeaders
              },
              body: JSON.stringify({
                orderId: orderState.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            const verifyContentType = verifyRes.headers.get('content-type') || '';
            if (!verifyContentType.includes('application/json')) {
              const text = await verifyRes.text();
              console.error('Payment Verify Response Non-JSON:', {
                status: verifyRes.status,
                url: verifyRes.url,
                contentType: verifyContentType,
                body: text
              });
              throw new Error(`Payment verification returned non-JSON response (HTTP ${verifyRes.status})`);
            }

            const verifyResult = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyResult.error || 'Payment verification failed');
            }

            if (verifyResult.success) {
              setPaymentSuccess(true);
              // Save customer name and phone locally for seamless future checkout
              saveCustomer(formData.name, formData.phone);

              // Cleanly navigate to Order Success screen with full confirmed order context
              setTimeout(() => {
                navigate('/order-success', {
                  state: {
                    order: orderState,
                    orderId: orderState.id
                  }
                });
              }, 800);
            }
          } catch (e: any) {
            setError(e.message);
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phone
        },
        theme: {
          color: '#ffa51f'
        },
        modal: {
          ondismiss: () => {
            setPaymentProcessing(false);
          }
        }
      };

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || typeof window.Razorpay !== 'function') {
        throw new Error('Razorpay Checkout SDK failed to load. Please check your internet connection.');
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e: any) {
      setError(e.message);
      setPaymentProcessing(false);
    }
  };

  const handleValidate = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please fill in your name and phone number');
      return;
    }
    if (!formData.deliverySlot) {
      setError('Please select a delivery time slot first');
      return;
    }
    if (!formData.deliveryLocation) {
      setError('Please select an available delivery location for your selected slot');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_URL}/checkout/validate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({
          orderItemIds,
          customerName: formData.name,
          customerPhone: formData.phone,
          deliveryLocationId: formData.deliveryLocation,
          deliverySlotId: formData.deliverySlot
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Validation failed');
      }
      const data = await res.json();
      setOrderState(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flow-page">
      <div className="container">
        <div className="flow-hero">
          <div>
            <h1 className="flow-title rise">Delivery &amp; <span className="italic-accent">payment.</span></h1>
            <p className="flow-sub rise" style={{ '--d': '80ms' } as React.CSSProperties}>
              Tell us who you are, pick a pickup slot and spot, then pay securely.
            </p>
          </div>
          <OrderSteps current={paymentSuccess ? 4 : 3} />
        </div>

        {error && (
          <div className="notice bad" role="alert">
            <div><p style={{ color: 'var(--color-danger)', fontWeight: 600 }}>{error}</p></div>
          </div>
        )}

        <div className="co-grid">
          {/* LEFT: details, slot, location */}
          <div>
            <section className="co-block">
              <div className="eyebrow"><b>01</b> Your details</div>
              <label className="field">
                <span className="opt-label">Full name</span>
                <input type="text" name="name" className="input" placeholder="Enter your full name" autoComplete="name" value={formData.name} onChange={handleChange} required />
              </label>
              <label className="field">
                <span className="opt-label">Phone number</span>
                <input type="tel" name="phone" className="input" placeholder="e.g. 9876543210" autoComplete="tel" inputMode="tel" value={formData.phone} onChange={handleChange} required />
              </label>
            </section>

            <section className="co-block">
              <div className="eyebrow"><b>02</b> Delivery slot</div>
              {slots.length === 0 ? (
                <div className="empty-note">Loading time slots…</div>
              ) : (
                <div className="tiles" role="group" aria-label="Delivery slot">
                  {slots.map((slot: any) => {
                    const todayAvailable = isSlotSelectable(slot.startTime);
                    let dayLabel = 'Today';
                    if (!todayAvailable || (deliveryEstimation && !deliveryEstimation.isToday)) {
                      dayLabel = deliveryEstimation?.formattedDate ? deliveryEstimation.formattedDate : 'Next available day';
                    }

                    let capStatus = 'Available';
                    if (capacityData?.isCurrentBatchFull) {
                      capStatus = capacityData.queueWhenCapacityFull ? 'Queued' : 'Full';
                    }

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        className="tile"
                        aria-pressed={formData.deliverySlot === slot.id}
                        onClick={() => selectSlot(slot.id)}
                      >
                        <span className="time">{slot.startTime} – {slot.endTime}</span>
                        <span className="meta"><span>{dayLabel}</span><span>{capStatus}</span></span>
                      </button>
                    );
                  })}
                </div>
              )}

              {capacityData?.isCurrentBatchFull && !capacityData?.queueWhenCapacityFull && (
                <div className="notice bad" role="alert">
                  <div>
                    <h4>Maximum printing capacity reached for this slot.</h4>
                    {capacityData.nextAvailableSlotInfo && (
                      <p><strong>Next available:</strong> {capacityData.nextAvailableSlotInfo.label}</p>
                    )}
                  </div>
                </div>
              )}

              {capacityData?.isCurrentBatchFull && capacityData?.queueWhenCapacityFull && (
                <div className="notice warn" role="status">
                  <div>
                    <h4>Capacity reached for this slot.</h4>
                    <p>Your order will be queued and processed when capacity becomes available.</p>
                  </div>
                </div>
              )}

              {deliveryEstimation?.activeHolidayNotice && (
                <p className="hint" style={{ marginTop: '0.75rem', color: '#8a5a06' }}>
                  Notice: {deliveryEstimation.activeHolidayNotice} (First available delivery: {deliveryEstimation.formattedDate})
                </p>
              )}
            </section>

            <section className="co-block">
              <div className="eyebrow"><b>03</b> Pickup location</div>
              {!formData.deliverySlot ? (
                <div className="empty-note">Select a time slot first.</div>
              ) : availableLocations.length === 0 ? (
                <div className="empty-note">No delivery locations available for this slot.</div>
              ) : (
                <div className="tiles compact" role="group" aria-label="Delivery location">
                  {availableLocations.map((loc: any) => (
                    <button
                      key={loc.id}
                      type="button"
                      className="tile"
                      aria-pressed={formData.deliveryLocation === loc.id}
                      onClick={() => selectLocation(loc.id)}
                    >
                      <span className="time">{loc.name}</span>
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="btn btn-primary btn-lg btn-block"
                onClick={handleValidate}
                disabled={loading}
                style={{ marginTop: '1.75rem' }}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Calculate final total <ArrowRight size={18} data-arrow /></>}
              </button>
            </section>
          </div>

          {/* RIGHT: receipt summary */}
          <aside className="summary" aria-label="Order summary">
            <div className="summary-head">
              <span className="mono"><b>Order summary</b></span>
              <span className="mono" style={{ color: orderState ? 'var(--color-accent)' : 'var(--text-muted)' }}>
                {orderState ? 'Locked' : 'Draft'}
              </span>
            </div>
            {orderState ? (
              <>
                <div className="summary-body">
                  {location.state?.files?.length > 0 && (
                    <div style={{ paddingBottom: '0.75rem', marginBottom: '0.5rem', borderBottom: '1px dashed var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {location.state.files.map((file: any) => (
                        <div key={file.id} style={{ fontSize: '0.85rem' }}>
                          <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{file.originalFilename}</div>
                          {file.printMode === 'SPECIFIC_PAGES' && file.pageRanges?.length > 0 ? (
                            <div style={{ paddingLeft: '0.5rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                              {file.pageRanges.map((r: any) => (
                                <div key={r.id}>
                                  Pages {r.start}–{r.end} — {r.colorMode === 'COLOR' ? 'Colour' : 'B&W'} — {r.sides === 'FRONT_AND_BACK' ? 'Duplex' : 'Single'} — {r.copies}x
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{ paddingLeft: '0.5rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                              Entire file ({file.pageCount} pages) — {file.colorMode === 'COLOR' ? 'Colour' : 'B&W'} — {file.sides === 'FRONT_AND_BACK' ? 'Duplex' : 'Single'} — {file.copies}x
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="dotrow"><span>Order value</span><span>₹{Number(orderState.subtotal).toFixed(2)}</span></div>
                  <div className="dotrow">
                    <span>Delivery</span>
                    <span style={{ color: Number(orderState.deliveryFee) === 0 ? 'var(--color-accent)' : undefined }}>
                      {Number(orderState.deliveryFee) === 0 ? 'FREE' : `₹${Number(orderState.deliveryFee).toFixed(2)}`}
                    </span>
                  </div>
                  {orderState.orderFlag === 'TOO_SMALL_ORDER' && (
                    <div className="notice warn" style={{ marginTop: 0 }}>
                      <div><p><strong>Too small order</strong></p></div>
                    </div>
                  )}
                </div>
                <div className="summary-total">
                  <span className="mono">Final total</span>
                  <span className="amt">₹{Number(orderState.totalAmount).toFixed(2)}</span>
                </div>
                <div className="summary-foot">
                  {paymentSuccess ? (
                    <div className="notice" role="status" style={{ marginTop: 0, borderLeftColor: 'var(--color-accent)' }}>
                      <div><p><strong>Payment confirmed.</strong> Your order has been placed.</p></div>
                    </div>
                  ) : (
                    <>
                      <p className="hint">Order locked. Ready for payment.</p>
                      <button
                        type="button"
                        className="btn btn-accent btn-lg btn-block"
                        onClick={handlePayment}
                        disabled={paymentProcessing}
                      >
                        {paymentProcessing ? <Loader2 className="animate-spin" size={18} /> : <>Pay with Razorpay <ArrowRight size={18} data-arrow /></>}
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="summary-foot" style={{ paddingTop: '1.25rem' }}>
                <div className="empty-note">Fill in your details and calculate the final total to unlock payment.</div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
