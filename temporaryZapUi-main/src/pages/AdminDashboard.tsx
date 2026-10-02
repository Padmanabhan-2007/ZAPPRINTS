import React, { useState, useEffect } from 'react';
import { API_URL } from '../utils/api';

interface PrintJob {
  id: string;
  status: string;
  tray?: string;
  errorCode?: string | null;
  errorMessage?: string | null;
  hardwareIssue?: any;
  startedAt?: string | null;
  completedAt?: string | null;
}

interface OrderItem {
  id: string;
  originalFilename: string;
  copies: number;
  colorMode: string;
  sides: string;
  pageCount: number;
  calculatedPrice: string;
  PrintJob?: PrintJob[];
}

interface Payment {
  id: string;
  status: string;
  amount: string;
  razorpayPaymentId: string | null;
  razorpayOrderId: string | null;
  refundId: string | null;
}

interface Order {
  id: string;
  humanOrderNumber?: string | null;
  customerName: string;
  customerPhone: string;
  subtotal: string;
  deliveryFee: string;
  totalAmount: string;
  orderFlag?: string | null;
  orderStatus: string;
  deliveryStatus: string;
  createdAt: string;
  DeliveryLocation: { name: string };
  DeliverySlot: { id?: string; startTime: string; endTime: string };
  OrderItem?: OrderItem[];
  Payment?: Payment[];
}

interface ActivePrintJobInfo {
  id: string;
  status: string;
  tray?: string;
  humanOrderNumber?: string | null;
  filename?: string | null;
  hardwareIssue?: any;
}

interface PrintStation {
  id: string;
  stationId?: string;
  name: string;
  status: string;
  printerStatus?: string;
  printerIssue?: {
    type: string;
    tray: string;
    reasons: string[];
    message: string;
    timestamp: string;
    printJobId?: string | null;
    cupsJobId?: string | null;
  } | null;
  activePrintJob?: ActivePrintJobInfo | null;
  lastHeartbeat: string | null;
}

interface Location {
  id: string;
  name: string;
  isActive: boolean;
}

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  capacity: number;
  isActive: boolean;
  SlotLocationAvailability?: { deliveryLocationId: string }[];
}

interface PricingRule {
  id: string;
  ruleKey: string;
  price: string;
  isActive: boolean;
}

interface BannerItem {
  id: string;
  title: string;
  message: string;
  offerType: string;
  offerValue?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

interface HolidayItem {
  id: string;
  startDate: string;
  endDate: string;
  message?: string | null;
  isActive: boolean;
}

interface WorkingCalendarDays {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

interface PrinterPaperCapacityState {
  safeCapacity: number;
  usedSheets: number;
  reservedSheets: number;
  remainingSheets: number;
  batchNumber: number;
  batchId: string;
  status: string;
  createdAt: string;
  queueWhenCapacityFull: boolean;
}

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings' | 'stations' | 'business'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [stations, setStations] = useState<PrintStation[]>([]);
  const [paperCapacity, setPaperCapacity] = useState<PrinterPaperCapacityState | null>(null);
  const [reloadingPaper, setReloadingPaper] = useState<boolean>(false);
  const [togglingQueueMode, setTogglingQueueMode] = useState<boolean>(false);
  const [reloadMessage, setReloadMessage] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>('');


  // Bulk order selection state
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [bulkUpdating, setBulkUpdating] = useState<boolean>(false);
  const [bulkMessage, setBulkMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Date & Delivery Slot Filter states
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterSlotId, setFilterSlotId] = useState<string>('ALL');
  const [filterOrderStatus, setFilterOrderStatus] = useState<string>('ALL');
  const [filterDeliveryStatus, setFilterDeliveryStatus] = useState<string>('ALL');

  // Settings sub-states
  const [locations, setLocations] = useState<Location[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [slotLocationSelections, setSlotLocationSelections] = useState<Record<string, string[]>>({});
  const [savingSlotLocationId, setSavingSlotLocationId] = useState<string | null>(null);
  const [slotLocationSavedMessage, setSlotLocationSavedMessage] = useState<{ [slotId: string]: string }>({});
  
  // Settings Inputs
  const [newLocationName, setNewLocationName] = useState('');
  const [newSlotStart, setNewSlotStart] = useState('');
  const [newSlotEnd, setNewSlotEnd] = useState('');
  const [newSlotCapacity, setNewSlotCapacity] = useState('10');

  // Business Controls sub-states
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [holidays, setHolidays] = useState<HolidayItem[]>([]);
  const [calendar, setCalendar] = useState<WorkingCalendarDays>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  });

  // Banner form inputs
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerMsg, setNewBannerMsg] = useState('');
  const [newBannerType, setNewBannerType] = useState('ANNOUNCEMENT');
  const [newBannerValue, setNewBannerValue] = useState('');
  const [newBannerCtaText, setNewBannerCtaText] = useState('');
  const [newBannerCtaLink, setNewBannerCtaLink] = useState('');
  const [newBannerStart, setNewBannerStart] = useState('');
  const [newBannerEnd, setNewBannerEnd] = useState('');

  // Holiday form inputs
  const [newHolidayStart, setNewHolidayStart] = useState('');
  const [newHolidayEnd, setNewHolidayEnd] = useState('');
  const [newHolidayMsg, setNewHolidayMsg] = useState('');

  // Mobile menu control
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Helper to extract CSRF token from cookie
  const getCsrfTokenFromCookie = (): string => {
    const match = document.cookie.match(new RegExp('(^| )csrf_token=([^;]*)'));
    return match ? match[2] || '' : '';
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/me`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        setCsrfToken(data.csrfToken || getCsrfTokenFromCookie());
        loadDashboardData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        setCsrfToken(data.csrfToken || getCsrfTokenFromCookie());
        loadDashboardData();
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch {
      setLoginError('Server error connecting to authentication endpoint');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/admin/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'x-csrf-token': csrfToken }
      });
    } finally {
      setIsAuthenticated(false);
      setCsrfToken('');
    }
  };

  const loadDashboardData = async () => {
    try {
      const resStats = await fetch(`${API_URL}/admin/dashboard/summary`, {
        credentials: 'include'
      });
      const dataStats = await resStats.json();
      if (resStats.ok) {
        setStats(dataStats.stats);
        setStations(dataStats.stations);
      }

      const resOrders = await fetch(`${API_URL}/admin/orders`, {
        credentials: 'include'
      });
      const dataOrders = await resOrders.json();
      if (resOrders.ok) {
        setOrders(dataOrders.orders);
      }

      // Load locations, slots, pricing rules
      const resLoc = await fetch(`${API_URL}/admin/locations`, {
        credentials: 'include'
      });
      const dataLoc = await resLoc.json();
      if (resLoc.ok) setLocations(dataLoc.locations);

      const resSlots = await fetch(`${API_URL}/admin/slots`, {
        credentials: 'include'
      });
      const dataSlots = await resSlots.json();
      if (resSlots.ok) {
        setSlots(dataSlots.slots);
        const initialMap: Record<string, string[]> = {};
        for (const s of dataSlots.slots) {
          initialMap[s.id] = (s.SlotLocationAvailability || []).map((sla: any) => sla.deliveryLocationId);
        }
        setSlotLocationSelections(initialMap);
      }

      const resPricing = await fetch(`${API_URL}/admin/pricing`, {
        credentials: 'include'
      });
      const dataPricing = await resPricing.json();
      if (resPricing.ok) setPricingRules(dataPricing.rules);

      // Load Business Controls: Banners, Holidays, Working Calendar
      const resBanners = await fetch(`${API_URL}/admin/banners`, {
        credentials: 'include'
      });
      const dataBanners = await resBanners.json();
      if (resBanners.ok) setBanners(dataBanners.banners || []);

      const resHolidays = await fetch(`${API_URL}/admin/holidays`, {
        credentials: 'include'
      });
      const dataHolidays = await resHolidays.json();
      if (resHolidays.ok) setHolidays(dataHolidays.holidays || []);

      const resCalendar = await fetch(`${API_URL}/admin/calendar`, {
        credentials: 'include'
      });
      const dataCalendar = await resCalendar.json();
      if (resCalendar.ok && dataCalendar.calendar) setCalendar(dataCalendar.calendar);

      // Load Printer Paper Capacity (Phase 2)
      const resCap = await fetch(`${API_URL}/admin/printer-capacity`, {
        credentials: 'include'
      });
      const dataCap = await resCap.json();
      if (resCap.ok) {
        setPaperCapacity({
          safeCapacity: dataCap.safeCapacity,
          usedSheets: dataCap.usedSheets,
          reservedSheets: dataCap.reservedSheets || 0,
          remainingSheets: dataCap.remainingSheets,
          batchNumber: dataCap.batchNumber,
          batchId: dataCap.batchId,
          status: dataCap.status,
          createdAt: dataCap.createdAt,
          queueWhenCapacityFull: Boolean(dataCap.queueWhenCapacityFull)
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  const handleReloadPaper = async () => {
    if (!window.confirm('Confirm physical paper reload? This will close the current batch and initialize a new 140-sheet safe batch.')) {
      return;
    }
    setReloadingPaper(true);
    setReloadMessage('');
    try {
      const res = await fetch(`${API_URL}/admin/printer-capacity/reload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.batch) {
        setPaperCapacity(prev => ({
          safeCapacity: data.batch.capacity,
          usedSheets: data.batch.usedSheets,
          reservedSheets: 0,
          remainingSheets: data.batch.remainingSheets,
          batchNumber: data.batch.batchNumber,
          batchId: data.batch.id,
          status: data.batch.status,
          createdAt: data.batch.createdAt,
          queueWhenCapacityFull: prev ? prev.queueWhenCapacityFull : false
        }));
        setReloadMessage(`✅ Paper reload recorded. Batch #${data.batch.batchNumber} is now active (140 sheets remaining).`);
        setTimeout(() => setReloadMessage(''), 5000);
      } else {
        alert(data.error || 'Failed to record paper reload');
      }
    } catch (err: any) {
      alert(err.message || 'Error communicating with printer capacity service');
    } finally {
      setReloadingPaper(false);
    }
  };

  const handleToggleQueueMode = async () => {
    if (!paperCapacity) return;
    const nextMode = !paperCapacity.queueWhenCapacityFull;
    setTogglingQueueMode(true);
    try {
      const res = await fetch(`${API_URL}/admin/printer-capacity/queue-mode`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
        credentials: 'include',
        body: JSON.stringify({ enabled: nextMode })
      });
      const data = await res.json();
      if (res.ok) {
        setPaperCapacity(prev => prev ? { ...prev, queueWhenCapacityFull: data.queueWhenCapacityFull } : null);
      } else {
        alert(data.error || 'Failed to update queue mode');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating queue mode');
    } finally {
      setTogglingQueueMode(false);
    }
  };



  // Business Controls: Banner Handlers
  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim() || !newBannerMsg.trim()) return;
    try {
      const res = await fetch(`${API_URL}/admin/banners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
        credentials: 'include',
        body: JSON.stringify({
          title: newBannerTitle,
          message: newBannerMsg,
          offerType: newBannerType,
          offerValue: newBannerValue || null,
          ctaText: newBannerCtaText || null,
          ctaLink: newBannerCtaLink || null,
          startDate: newBannerStart || null,
          endDate: newBannerEnd || null
        })
      });
      if (res.ok) {
        setNewBannerTitle('');
        setNewBannerMsg('');
        setNewBannerValue('');
        setNewBannerCtaText('');
        setNewBannerCtaLink('');
        setNewBannerStart('');
        setNewBannerEnd('');
        loadDashboardData();
      } else {
        const d = await res.json();
        alert(`Failed to create banner: ${d.error}`);
      }
    } catch {
      alert('Error creating banner');
    }
  };

  const handleToggleBanner = async (banner: BannerItem) => {
    try {
      const res = await fetch(`${API_URL}/admin/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
        credentials: 'include',
        body: JSON.stringify({ isActive: !banner.isActive })
      });
      if (res.ok) loadDashboardData();
    } catch {
      alert('Error updating banner status');
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      const res = await fetch(`${API_URL}/admin/banners/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'x-csrf-token': csrfToken }
      });
      if (res.ok) loadDashboardData();
    } catch {
      alert('Error deleting banner');
    }
  };

  // Business Controls: Holiday Handlers
  const handleCreateHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayStart || !newHolidayEnd) return;
    try {
      const res = await fetch(`${API_URL}/admin/holidays`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
        credentials: 'include',
        body: JSON.stringify({
          startDate: newHolidayStart,
          endDate: newHolidayEnd,
          message: newHolidayMsg || null
        })
      });
      if (res.ok) {
        setNewHolidayStart('');
        setNewHolidayEnd('');
        setNewHolidayMsg('');
        loadDashboardData();
      } else {
        const d = await res.json();
        alert(`Failed to add holiday: ${d.error}`);
      }
    } catch {
      alert('Error creating holiday period');
    }
  };

  const handleDeleteHoliday = async (id: string) => {
    if (!window.confirm('Delete this holiday period?')) return;
    try {
      const res = await fetch(`${API_URL}/admin/holidays/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'x-csrf-token': csrfToken }
      });
      if (res.ok) loadDashboardData();
    } catch {
      alert('Error deleting holiday');
    }
  };

  // Business Controls: Calendar Handlers
  const handleToggleCalendarDay = async (dayKey: keyof WorkingCalendarDays) => {
    const nextDays = { ...calendar, [dayKey]: !calendar[dayKey] };
    setCalendar(nextDays);
    try {
      await fetch(`${API_URL}/admin/calendar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
        credentials: 'include',
        body: JSON.stringify({ days: nextDays })
      });
    } catch {
      alert('Failed to save calendar setting');
      loadDashboardData();
    }
  };

  const handleRefund = async (paymentId: string) => {
    if (!window.confirm('Are you sure you want to trigger a refund?')) return;
    try {
      const res = await fetch(`${API_URL}/admin/payments/${paymentId}/refund`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'x-csrf-token': csrfToken }
      });
      if (res.ok) {
        alert('Refund processed successfully!');
        loadDashboardData();
        if (selectedOrder) {
          // reload order details modal
          const updatedRes = await fetch(`${API_URL}/admin/orders/${selectedOrder.id}`, {
            credentials: 'include'
          });
          const updatedData = await updatedRes.json();
          if (updatedRes.ok) setSelectedOrder(updatedData.order);
        }
      } else {
        const data = await res.json();
        alert(`Refund failed: ${data.error}`);
      }
    } catch {
      alert('Error triggering refund');
    }
  };

  const handleUpdateDelivery = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/orders/${orderId}/delivery`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        alert('Delivery status updated!');
        loadDashboardData();
        if (selectedOrder) {
          const updatedRes = await fetch(`${API_URL}/admin/orders/${selectedOrder.id}`, {
            credentials: 'include'
          });
          const updatedData = await updatedRes.json();
          if (updatedRes.ok) setSelectedOrder(updatedData.order);
        }
      }
    } catch {
      alert('Failed to update delivery');
    }
  };

  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrderIds(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === orders.length && orders.length > 0) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(orders.map(o => o.id));
    }
  };

  const handleBulkUpdateDelivery = async (status: 'OUT_FOR_DELIVERY' | 'DELIVERED') => {
    if (selectedOrderIds.length === 0 || bulkUpdating) return;

    const readableStatus = status === 'OUT_FOR_DELIVERY' ? 'Out for Delivery' : 'Delivered';
    const confirmed = window.confirm(`Mark ${selectedOrderIds.length} selected orders as ${readableStatus}?`);
    if (!confirmed) return;

    setBulkUpdating(true);
    setBulkMessage(null);

    try {
      const res = await fetch(`${API_URL}/admin/orders/bulk-delivery-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({
          orderIds: selectedOrderIds,
          deliveryStatus: status
        })
      });

      const data = await res.json();
      if (res.ok) {
        // Update local state immediately for fast feedback
        setOrders(prevOrders =>
          prevOrders.map(o =>
            selectedOrderIds.includes(o.id) ? { ...o, deliveryStatus: status } : o
          )
        );
        const count = data.updatedCount || selectedOrderIds.length;
        setSelectedOrderIds([]);
        setBulkMessage({
          type: 'success',
          text: `Successfully marked ${count} order(s) as ${readableStatus}!`
        });
        loadDashboardData();
      } else {
        setBulkMessage({
          type: 'error',
          text: data.error || 'Failed to update selected orders.'
        });
      }
    } catch {
      setBulkMessage({
        type: 'error',
        text: 'Network error occurred while updating orders.'
      });
    } finally {
      setBulkUpdating(false);
    }
  };

  const handlePricingUpdate = async (ruleId: string, newPrice: string, isActive: boolean) => {
    try {
      const res = await fetch(`${API_URL}/admin/pricing/${ruleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
        credentials: 'include',
        body: JSON.stringify({ price: parseFloat(newPrice), isActive })
      });
      if (res.ok) {
        loadDashboardData();
      }
    } catch {
      alert('Failed to update pricing');
    }
  };

  const handleAddLocation = async () => {
    if (!newLocationName) return;
    try {
      const res = await fetch(`${API_URL}/admin/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
        credentials: 'include',
        body: JSON.stringify({ name: newLocationName })
      });
      if (res.ok) {
        setNewLocationName('');
        loadDashboardData();
      }
    } catch {
      alert('Failed to add location');
    }
  };

  const handleLocationStatus = async (loc: Location, isActive: boolean) => {
    try {
      const res = await fetch(`${API_URL}/admin/locations/${loc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
        credentials: 'include',
        body: JSON.stringify({ name: loc.name, isActive })
      });
      if (res.ok) loadDashboardData();
    } catch {
      alert('Failed to update location');
    }
  };

  const handleAddSlot = async () => {
    if (!newSlotStart || !newSlotEnd) return;
    try {
      const res = await fetch(`${API_URL}/admin/slots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
        credentials: 'include',
        body: JSON.stringify({ startTime: newSlotStart, endTime: newSlotEnd, capacity: parseInt(newSlotCapacity) })
      });
      if (res.ok) {
        setNewSlotStart('');
        setNewSlotEnd('');
        loadDashboardData();
      }
    } catch {
      alert('Failed to add slot');
    }
  };

  const handleSlotStatus = async (slot: Slot, isActive: boolean) => {
    try {
      const res = await fetch(`${API_URL}/admin/slots/${slot.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
        credentials: 'include',
        body: JSON.stringify({ ...slot, isActive })
      });
      if (res.ok) loadDashboardData();
    } catch {
      alert('Failed to update slot');
    }
  };

  const handleToggleSlotLocation = (slotId: string, locationId: string) => {
    setSlotLocationSelections(prev => {
      const current = prev[slotId] || [];
      const updated = current.includes(locationId)
        ? current.filter(id => id !== locationId)
        : [...current, locationId];
      return { ...prev, [slotId]: updated };
    });
  };

  const handleSaveSlotLocations = async (slotId: string) => {
    setSavingSlotLocationId(slotId);
    try {
      const locationIds = slotLocationSelections[slotId] || [];
      const res = await fetch(`${API_URL}/admin/slots/${slotId}/locations`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({ locationIds })
      });
      const data = await res.json();
      if (res.ok) {
        setSlotLocationSavedMessage(prev => ({ ...prev, [slotId]: 'Availability saved!' }));
        setTimeout(() => {
          setSlotLocationSavedMessage(prev => {
            const copy = { ...prev };
            delete copy[slotId];
            return copy;
          });
        }, 3000);
        loadDashboardData();
      } else {
        alert(data.error || 'Failed to save slot locations');
      }
    } catch {
      alert('Error saving slot locations');
    } finally {
      setSavingSlotLocationId(null);
    }
  };

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center" style={{ height: '70vh' }}><p>Verifying admin credentials...</p></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '80vh', padding: 'var(--space-8)' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', padding: 'var(--space-6)', boxShadow: 'var(--shadow-lg)' }}>
          <h2 className="text-2xl font-bold text-center" style={{ marginBottom: 'var(--space-4)' }}>Admin Portal</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Admin Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field" 
                required 
                placeholder="admin@zapprints.com"
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field" 
                required 
                placeholder="••••••••"
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
              />
            </div>
            {loginError && <p className="text-danger text-sm text-center">{loginError}</p>}
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', marginTop: 'var(--space-2)' }}>Log In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 70px)' }}>
      {/* Sidebar Navigation */}
      <aside className={`flex flex-col gap-4 ${isSidebarOpen ? 'flex' : 'hidden md:flex'}`} style={{ width: '260px', borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--color-surface)', padding: 'var(--space-6)' }}>
        <h3 className="text-muted text-xs font-bold" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>Control Panel</h3>
        <button className={`btn text-left ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }} style={{ display: 'block', width: '100%', padding: '0.75rem 1rem' }}>Overview</button>
        <button className={`btn text-left ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }} style={{ display: 'block', width: '100%', padding: '0.75rem 1rem' }}>Orders</button>
        <button className={`btn text-left ${activeTab === 'business' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setActiveTab('business'); setIsSidebarOpen(false); }} style={{ display: 'block', width: '100%', padding: '0.75rem 1rem' }}>Business Controls</button>
        <button className={`btn text-left ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} style={{ display: 'block', width: '100%', padding: '0.75rem 1rem' }}>Settings</button>
        <button className={`btn text-left ${activeTab === 'stations' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setActiveTab('stations'); setIsSidebarOpen(false); }} style={{ display: 'block', width: '100%', padding: '0.75rem 1rem' }}>Print Stations</button>
        
        <button className="btn btn-secondary text-danger" onClick={handleLogout} style={{ marginTop: 'auto', padding: '0.75rem' }}>Logout</button>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: 'var(--space-6)' }}>
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
          <button className="btn btn-secondary" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>Menu</button>
          <span className="font-semibold text-lg">Admin Control</span>
        </div>

        {/* Tab 1: Overview Summary */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold">System Status</h2>

            {/* Persistent Hardware Issue / Paper Out Alert Banner */}
            {stations.some(s => s.printerStatus === 'PAPER_OUT' || s.printerIssue) && (
              <div
                className="card"
                style={{
                  padding: '1.25rem 1.5rem',
                  backgroundColor: '#fffbeb',
                  border: '2px solid #f59e0b',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                {stations.filter(s => s.printerStatus === 'PAPER_OUT' || s.printerIssue).map(station => {
                  const issue = station.printerIssue;
                  const activeJob = station.activePrintJob;
                  const issueJobId = activeJob?.id || issue?.printJobId;
                  const orderRef = activeJob?.humanOrderNumber ? `Order #${activeJob.humanOrderNumber}` : null;
                  const fileRef = activeJob?.filename ? `("${activeJob.filename}")` : null;

                  return (
                    <div key={station.id} className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '1.5rem' }}>{station.printerStatus === 'OFFLINE' ? '🔌' : '⚠️'}</span>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: station.printerStatus === 'OFFLINE' ? '#dc2626' : '#b45309', margin: 0 }}>
                            {station.name} {station.printerStatus === 'OFFLINE' ? 'Printer Offline / Disconnected' : `Needs Attention: ${issue?.message || 'Printer Paper Out'}`}
                          </h3>
                          <p style={{ fontSize: '0.875rem', color: station.printerStatus === 'OFFLINE' ? '#991b1b' : '#92400e', margin: '0.2rem 0 0 0' }}>
                            Status: <strong>{station.printerStatus}</strong> {station.printerStatus === 'OFFLINE' ? '(USB / Device Unavailable)' : `| Current Tray: ${activeJob?.tray || issue?.tray || 'Tray1'}`}
                            {issue?.reasons && issue.reasons.length > 0 && ` | CUPS Reasons: ${issue.reasons.join(', ')}`}
                          </p>
                          {issueJobId && (
                            <p style={{ fontSize: '0.85rem', color: '#78350f', margin: '0.2rem 0 0 0', fontWeight: 600 }}>
                              Affected Job: {orderRef || 'PrintJob'} {fileRef} (ID: {issueJobId}) — Status: {activeJob?.status || 'QUEUED (Recoverable)'}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3 flex-wrap" style={{ marginTop: '0.5rem' }}>
                        {issueJobId && (
                          <button
                            className="btn btn-primary text-sm"
                            style={{ backgroundColor: '#2563eb' }}
                            onClick={async () => {
                              if (!window.confirm(`Switch affected print job (${orderRef || issueJobId}) to ByPass/MP Tray?`)) return;
                              const res = await fetch(`${API_URL}/admin/print-jobs/${issueJobId}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
                                credentials: 'include',
                                body: JSON.stringify({ action: 'switch_tray', tray: 'ByPassTray' })
                              });
                              if (res.ok) {
                                alert('Tray switch command accepted. Old CUPS job will be safely cleared and job re-dispatched to ByPass/MP Tray.');
                                loadDashboardData();
                              } else {
                                const d = await res.json();
                                alert(`Failed to switch tray: ${d.error}`);
                              }
                            }}
                          >
                            Switch to MP/ByPass Tray
                          </button>
                        )}

                        <button
                          className="btn btn-primary text-sm"
                          style={{ backgroundColor: '#16a34a' }}
                          onClick={async () => {
                            if (!window.confirm('Confirm that paper has been loaded into Tray 1? (Note: On Brother printers, please also press the physical Start/Resume button on the printer control panel to unblock the feed engine).')) return;
                            if (issueJobId) {
                              await fetch(`${API_URL}/admin/print-jobs/${issueJobId}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
                                credentials: 'include',
                                body: JSON.stringify({ action: 'resume_after_paper' })
                              });
                            }
                            await fetch(`${API_URL}/admin/print-stations/${station.id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
                              credentials: 'include',
                              body: JSON.stringify({ status: 'ONLINE' })
                            });
                            alert('Paper reload recorded. Please ensure the physical Start/Resume button is pressed on the printer if the LCD indicates paper needed.');
                            loadDashboardData();
                          }}
                        >
                          Resume After Loading Paper
                        </button>

                        <button
                          className="btn btn-secondary text-sm"
                          onClick={async () => {
                            const res = await fetch(`${API_URL}/admin/print-stations/${station.id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
                              credentials: 'include',
                              body: JSON.stringify({ status: 'PAUSED' })
                            });
                            if (res.ok) {
                              alert('Station paused.');
                              loadDashboardData();
                            }
                          }}
                        >
                          Pause Station
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {stats && (
              <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                  <p className="text-muted text-sm">Today's Orders</p>
                  <p className="text-3xl font-bold text-accent">{stats.todayOrders}</p>
                </div>
                <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                  <p className="text-muted text-sm">Processing Queue</p>
                  <p className="text-3xl font-bold" style={{ color: 'orange' }}>{stats.processing}</p>
                </div>
                <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                  <p className="text-muted text-sm">Ready for Delivery</p>
                  <p className="text-3xl font-bold text-success">{stats.ready}</p>
                </div>
                <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                  <p className="text-muted text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-success">₹{stats.revenue}</p>
                </div>
              </div>
            )}

            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h3 className="text-xl font-bold" style={{ marginBottom: 'var(--space-4)' }}>Print Stations Heartbeats</h3>
              <div className="flex flex-col gap-4">
                {stations.length === 0 ? (
                  <p className="text-muted">No print stations configured.</p>
                ) : (
                  stations.map(station => (
                    <div key={station.id} className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>
                      <div>
                        <p className="font-semibold">{station.name}</p>
                        <p className="text-muted text-sm">Last Seen: {station.lastHeartbeat ? new Date(station.lastHeartbeat).toLocaleString() : 'Never'}</p>
                      </div>
                      <span className={`badge ${station.status === 'ONLINE' ? 'text-success' : 'text-danger'}`} style={{ fontWeight: 'bold' }}>
                        {station.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders list */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-3xl font-bold">Orders Management</h2>
              {selectedOrderIds.length > 0 && (
                <span className="text-sm font-semibold" style={{ color: '#22c55e' }}>
                  {selectedOrderIds.length} of {orders.length} order(s) selected
                </span>
              )}
            </div>

            {/* Date + Delivery Slot Filter & Live Delivery Planner */}
            <div
              className="card"
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-md font-bold" style={{ color: '#1e293b' }}>
                    Delivery Slot & Schedule Planner
                  </h3>
                  <p className="text-xs text-muted">
                    Filter orders by delivery date and slot to quickly check batch requirements.
                  </p>
                </div>
                {(filterDate || filterSlotId !== 'ALL' || filterOrderStatus !== 'ALL' || filterDeliveryStatus !== 'ALL') && (
                  <button
                    onClick={() => {
                      setFilterDate('');
                      setFilterSlotId('ALL');
                      setFilterOrderStatus('ALL');
                      setFilterDeliveryStatus('ALL');
                    }}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#ef4444',
                      background: 'rgba(239, 68, 68, 0.08)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      cursor: 'pointer'
                    }}
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                  gap: '0.85rem',
                  alignItems: 'end'
                }}
              >
                {/* 1. Date Selector */}
                <div>
                  <label className="label" style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem', color: '#475569' }}>
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    style={{
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.85rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(0,0,0,0.12)'
                    }}
                  />
                </div>

                {/* 2. Slot Selector */}
                <div>
                  <label className="label" style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem', color: '#475569' }}>
                    Time Slot
                  </label>
                  <select
                    className="input"
                    value={filterSlotId}
                    onChange={(e) => setFilterSlotId(e.target.value)}
                    style={{
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.85rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(0,0,0,0.12)',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="ALL">All Delivery Slots</option>
                    {slots.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.startTime} – {s.endTime}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Delivery Status Filter */}
                <div>
                  <label className="label" style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem', color: '#475569' }}>
                    Delivery Status
                  </label>
                  <select
                    className="input"
                    value={filterDeliveryStatus}
                    onChange={(e) => setFilterDeliveryStatus(e.target.value)}
                    style={{
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.85rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(0,0,0,0.12)',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="ALL">All Delivery Statuses</option>
                    <option value="PENDING">Pending Delivery</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </div>

                {/* 4. Order Lifecycle Status Filter */}
                <div>
                  <label className="label" style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem', color: '#475569' }}>
                    Order Status
                  </label>
                  <select
                    className="input"
                    value={filterOrderStatus}
                    onChange={(e) => setFilterOrderStatus(e.target.value)}
                    style={{
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.85rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(0,0,0,0.12)',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="ALL">All Lifecycle Statuses</option>
                    <option value="QUEUED">Queued</option>
                    <option value="CLAIMED">Claimed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="PRINTING">Printing</option>
                    <option value="READY">Ready</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Prominent Slot Delivery Counter Summary Box */}
              {(() => {
                const selectedSlotObj = slots.find(s => s.id === filterSlotId);
                const filteredOrders = orders.filter(o => {
                  if (filterDate) {
                    const orderDateStr = new Intl.DateTimeFormat('en-CA', {
                      timeZone: 'Asia/Kolkata'
                    }).format(new Date(o.createdAt));
                    if (orderDateStr !== filterDate) return false;
                  }
                  if (filterSlotId !== 'ALL') {
                    if (o.DeliverySlot?.id) {
                      if (o.DeliverySlot.id !== filterSlotId) return false;
                    } else if (selectedSlotObj) {
                      if (o.DeliverySlot?.startTime !== selectedSlotObj.startTime || o.DeliverySlot?.endTime !== selectedSlotObj.endTime) {
                        return false;
                      }
                    }
                  }
                  if (filterDeliveryStatus !== 'ALL' && o.deliveryStatus !== filterDeliveryStatus) return false;
                  if (filterOrderStatus !== 'ALL' && o.orderStatus !== filterOrderStatus) return false;
                  return true;
                });

                const formattedSelectedDate = filterDate
                  ? new Date(filterDate + 'T00:00:00').toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
                  : 'All Dates';

                const slotText = selectedSlotObj
                  ? `${selectedSlotObj.startTime} – ${selectedSlotObj.endTime}`
                  : (filterSlotId === 'ALL' ? 'All Slots' : 'Selected Slot');

                return (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.85rem 1.25rem',
                      backgroundColor: 'rgba(34, 197, 94, 0.06)',
                      border: '1px solid rgba(34, 197, 94, 0.25)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                          Target Date
                        </span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                          {formattedSelectedDate}
                        </span>
                      </div>
                      <div style={{ borderLeft: '1px solid rgba(0,0,0,0.1)', paddingLeft: '1.25rem' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                          Time Slot
                        </span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                          {slotText}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                        Orders to deliver:
                      </span>
                      <span
                        style={{
                          fontSize: '1.4rem',
                          fontWeight: 800,
                          color: '#16a34a',
                          lineHeight: 1
                        }}
                      >
                        {filteredOrders.length}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Bulk Alert Message */}
            {bulkMessage && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  backgroundColor: bulkMessage.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${bulkMessage.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  color: bulkMessage.type === 'success' ? '#16a34a' : '#ef4444',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{bulkMessage.text}</span>
                <button
                  onClick={() => setBulkMessage(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'bold' }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Bulk Action Bar */}
            {selectedOrderIds.length > 0 && (
              <div
                className="card flex items-center justify-between flex-wrap gap-4"
                style={{
                  padding: '1rem 1.5rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px'
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm" style={{ color: '#1e293b' }}>
                    {selectedOrderIds.length} order{selectedOrderIds.length > 1 ? 's' : ''} selected
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    className="btn btn-secondary text-sm"
                    onClick={() => handleBulkUpdateDelivery('OUT_FOR_DELIVERY')}
                    disabled={bulkUpdating}
                    style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}
                  >
                    {bulkUpdating ? 'Updating...' : '🚚 Mark Out for Delivery'}
                  </button>
                  <button
                    className="btn btn-primary text-sm"
                    onClick={() => handleBulkUpdateDelivery('DELIVERED')}
                    disabled={bulkUpdating}
                    style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}
                  >
                    {bulkUpdating ? 'Updating...' : '✓ Mark Delivered'}
                  </button>
                  <button
                    className="btn text-sm"
                    onClick={() => setSelectedOrderIds([])}
                    disabled={bulkUpdating}
                    style={{
                      padding: '0.5rem 0.8rem',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      color: '#64748b',
                      border: '1px solid #cbd5e1'
                    }}
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}

            <div className="card" style={{ padding: 'var(--space-4)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '0.75rem', width: '40px' }}>
                      <input
                        type="checkbox"
                        checked={orders.length > 0 && selectedOrderIds.length === orders.length}
                        onChange={toggleSelectAll}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        title="Select All"
                      />
                    </th>
                    <th style={{ padding: '0.75rem' }}>Order / Job Ref</th>
                    <th style={{ padding: '0.75rem' }}>Customer</th>
                    <th style={{ padding: '0.75rem' }}>Location</th>
                    <th style={{ padding: '0.75rem' }}>Slot</th>
                    <th style={{ padding: '0.75rem' }}>Amount</th>
                    <th style={{ padding: '0.75rem' }}>Order Lifecycle</th>
                    <th style={{ padding: '0.75rem' }}>PrintJob Status</th>
                    <th style={{ padding: '0.75rem' }}>Delivery</th>
                    <th style={{ padding: '0.75rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const selectedSlotObj = slots.find(s => s.id === filterSlotId);
                    const filteredOrders = orders.filter(o => {
                      if (filterDate) {
                        const orderDateStr = new Intl.DateTimeFormat('en-CA', {
                          timeZone: 'Asia/Kolkata'
                        }).format(new Date(o.createdAt));
                        if (orderDateStr !== filterDate) return false;
                      }
                      if (filterSlotId !== 'ALL') {
                        if (o.DeliverySlot?.id) {
                          if (o.DeliverySlot.id !== filterSlotId) return false;
                        } else if (selectedSlotObj) {
                          if (o.DeliverySlot?.startTime !== selectedSlotObj.startTime || o.DeliverySlot?.endTime !== selectedSlotObj.endTime) {
                            return false;
                          }
                        }
                      }
                      if (filterDeliveryStatus !== 'ALL' && o.deliveryStatus !== filterDeliveryStatus) return false;
                      if (filterOrderStatus !== 'ALL' && o.orderStatus !== filterOrderStatus) return false;
                      return true;
                    });

                    if (filteredOrders.length === 0) {
                      return (
                        <tr>
                          <td colSpan={10} style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
                            No orders found matching the selected date, slot, or filters.
                          </td>
                        </tr>
                      );
                    }

                    return filteredOrders.map(order => {
                      const isSelected = selectedOrderIds.includes(order.id);
                      const printJobs = (order.OrderItem || []).flatMap(oi => oi.PrintJob || []);
                      const primaryJob = printJobs[0];
                      const jobStatus = primaryJob ? primaryJob.status : 'NO_JOB';
                      const jobTray = primaryJob?.tray || 'Tray1';

                      return (
                        <tr
                          key={order.id}
                          style={{
                            borderBottom: '1px solid var(--border-color)',
                            backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.04)' : 'transparent'
                          }}
                        >
                          <td style={{ padding: '0.75rem' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectOrder(order.id)}
                              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                            />
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            {order.humanOrderNumber ? (
                              <div>
                                <span
                                  style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '6px',
                                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                    color: '#16a34a',
                                    border: '1px solid rgba(34, 197, 94, 0.25)',
                                    display: 'inline-block',
                                    marginBottom: '2px'
                                  }}
                                >
                                  #{order.humanOrderNumber}
                                </span>
                                <div className="text-muted text-xs" style={{ fontSize: '0.7rem' }}>
                                  ID: {order.id.slice(0, 8).toUpperCase()}
                                </div>
                              </div>
                            ) : (
                              <span className="font-mono text-xs font-bold" style={{ color: '#1e293b' }}>
                                #{order.id.slice(0, 8).toUpperCase()}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <div className="font-semibold">{order.customerName}</div>
                            <div className="text-muted text-xs">{order.customerPhone}</div>
                          </td>
                          <td style={{ padding: '0.75rem' }}>{order.DeliveryLocation?.name}</td>
                          <td style={{ padding: '0.75rem' }}>{order.DeliverySlot?.startTime} - {order.DeliverySlot?.endTime}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <div className="font-semibold">₹{order.totalAmount}</div>
                            {order.deliveryFee && Number(order.deliveryFee) > 0 && (
                              <div className="text-muted text-xs" style={{ fontSize: '0.7rem' }}>+₹{order.deliveryFee} del</div>
                            )}
                            {order.orderFlag === 'TOO_SMALL_ORDER' && (
                              <span
                                className="text-xs font-bold"
                                style={{
                                  padding: '0.15rem 0.4rem',
                                  borderRadius: '4px',
                                  backgroundColor: 'rgba(234, 179, 8, 0.12)',
                                  color: '#b45309',
                                  border: '1px solid rgba(234, 179, 8, 0.3)',
                                  display: 'inline-block',
                                  marginTop: '2px',
                                  fontSize: '0.675rem'
                                }}
                              >
                                Too Small (&lt; ₹6)
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span className="font-medium text-sm">{order.orderStatus}</span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span
                              className="text-xs font-bold"
                              style={{
                                padding: '0.2rem 0.5rem',
                                borderRadius: '6px',
                                backgroundColor:
                                  jobStatus === 'COMPLETED'
                                    ? 'rgba(34, 197, 94, 0.1)'
                                    : jobStatus === 'PRINTING'
                                    ? 'rgba(59, 130, 246, 0.1)'
                                    : jobStatus === 'FAILED' || jobStatus === 'INTERRUPTED'
                                    ? 'rgba(239, 68, 68, 0.1)'
                                    : 'rgba(234, 179, 8, 0.1)',
                                color:
                                  jobStatus === 'COMPLETED'
                                    ? '#16a34a'
                                    : jobStatus === 'PRINTING'
                                    ? '#2563eb'
                                    : jobStatus === 'FAILED' || jobStatus === 'INTERRUPTED'
                                    ? '#dc2626'
                                    : '#ca8a04'
                              }}
                            >
                              🖨️ {jobStatus} ({jobTray})
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span
                              className="text-sm font-semibold"
                              style={{
                                color:
                                  order.deliveryStatus === 'DELIVERED'
                                    ? '#16a34a'
                                    : order.deliveryStatus === 'OUT_FOR_DELIVERY'
                                    ? '#ea580c'
                                    : '#64748b'
                              }}
                            >
                              {order.deliveryStatus === 'DELIVERED'
                                ? '✓ Delivered'
                                : order.deliveryStatus === 'OUT_FOR_DELIVERY'
                                ? '🚚 Out for Delivery'
                                : 'Delivery Pending'}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <button className="btn btn-secondary text-sm" onClick={async () => {
                              const res = await fetch(`${API_URL}/admin/orders/${order.id}`, {
                                credentials: 'include'
                              });
                              const data = await res.json();
                              if (res.ok) setSelectedOrder(data.order);
                            }}>Inspect</button>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>

            {/* Order Details Modal Overlay */}
            {selectedOrder && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--space-4)' }}>
                <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 'var(--space-6)' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-4)' }}>
                    <div>
                      <h3 className="text-2xl font-bold">Order Details</h3>
                      {selectedOrder.humanOrderNumber && (
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            color: '#16a34a',
                            border: '1px solid rgba(34, 197, 94, 0.25)',
                            display: 'inline-block',
                            marginTop: '0.25rem'
                          }}
                        >
                          Daily Job #{selectedOrder.humanOrderNumber}
                        </span>
                      )}
                    </div>
                    <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>Close</button>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-muted text-xs">ORDER ID & CUSTOMER</p>
                      <p className="font-semibold">{selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
                      <p className="text-xs text-muted" style={{ fontFamily: 'monospace', marginTop: '2px' }}>UUID: {selectedOrder.id}</p>
                    </div>

                    <div>
                      <p className="text-muted text-xs">DELIVERY</p>
                      <p className="font-semibold">{selectedOrder.DeliveryLocation?.name} during slot {selectedOrder.DeliverySlot?.startTime} - {selectedOrder.DeliverySlot?.endTime}</p>
                    </div>

                    <div>
                      <p className="text-muted text-xs">ORDER STATUS / ACTIONS</p>
                      <div className="flex gap-2" style={{ marginTop: 'var(--space-1)' }}>
                        <button className="btn btn-secondary text-sm" onClick={() => handleUpdateDelivery(selectedOrder.id, 'OUT_FOR_DELIVERY')}>Out for Delivery</button>
                        <button className="btn btn-primary text-sm" onClick={() => handleUpdateDelivery(selectedOrder.id, 'DELIVERED')}>Deliver</button>
                      </div>
                    </div>

                    <div>
                      <p className="text-muted text-xs">ITEMS, PRICING & PRINT JOBS</p>
                      {selectedOrder.OrderItem?.map(item => {
                        const job = item.PrintJob?.[0];
                        return (
                          <div key={item.id} style={{ borderBottom: '1px solid var(--border-color)', padding: 'var(--space-2) 0' }}>
                            <div className="flex justify-between items-center">
                              <p className="font-semibold text-sm">{item.originalFilename}</p>
                              {job && (
                                <span
                                  className="text-xs font-bold"
                                  style={{
                                    padding: '0.15rem 0.4rem',
                                    borderRadius: '4px',
                                    backgroundColor:
                                      job.status === 'COMPLETED'
                                        ? 'rgba(34, 197, 94, 0.1)'
                                        : job.status === 'PRINTING'
                                        ? 'rgba(59, 130, 246, 0.1)'
                                        : 'rgba(239, 68, 68, 0.1)',
                                    color:
                                      job.status === 'COMPLETED'
                                        ? '#16a34a'
                                        : job.status === 'PRINTING'
                                        ? '#2563eb'
                                        : '#dc2626'
                                  }}
                                >
                                  PrintJob: {job.status} ({job.tray || 'Tray1'})
                                </span>
                              )}
                            </div>
                            <p className="text-muted text-xs">
                              {item.copies} copies • {item.colorMode} • {item.sides} • {item.pageCount} pages • ₹{item.calculatedPrice}
                            </p>
                            {job?.errorMessage && (
                              <p className="text-xs" style={{ color: '#dc2626', marginTop: '0.25rem' }}>
                                Error: {job.errorMessage}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div>
                      <p className="text-muted text-xs">ORDER PRICING &amp; SIZE</p>
                      <div className="flex justify-between items-center" style={{ marginTop: 'var(--space-1)' }}>
                        <span className="text-sm font-semibold">Subtotal: ₹{selectedOrder.subtotal} | Delivery: {Number(selectedOrder.deliveryFee) === 0 ? 'FREE' : `₹${selectedOrder.deliveryFee}`} | Total: ₹{selectedOrder.totalAmount}</span>
                        <span
                          className="text-xs font-bold"
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            backgroundColor: selectedOrder.orderFlag === 'TOO_SMALL_ORDER' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(34, 197, 94, 0.1)',
                            color: selectedOrder.orderFlag === 'TOO_SMALL_ORDER' ? '#b45309' : '#16a34a',
                            border: `1px solid ${selectedOrder.orderFlag === 'TOO_SMALL_ORDER' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(34, 197, 94, 0.25)'}`
                          }}
                        >
                          {selectedOrder.orderFlag === 'TOO_SMALL_ORDER' ? 'TOO_SMALL_ORDER (< ₹6)' : 'NORMAL'}
                        </span>
                      </div>
                    </div>

                    {selectedOrder.Payment && selectedOrder.Payment.length > 0 && (
                      <div>
                        <p className="text-muted text-xs">PAYMENT & REFUNDS</p>
                        {selectedOrder.Payment.map(pay => (
                          <div key={pay.id} className="flex justify-between items-center" style={{ marginTop: 'var(--space-2)' }}>
                            <div>
                              <p className="text-sm">Status: <span className="font-bold">{pay.status}</span> (₹{pay.amount})</p>
                              {pay.razorpayPaymentId && <p className="text-muted text-xs">Ref: {pay.razorpayPaymentId}</p>}
                            </div>
                            {pay.status === 'SUCCESS' && (
                              <button className="btn btn-secondary text-danger text-sm" onClick={() => handleRefund(pay.id)}>Refund</button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Settings CRUD */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold">Management Settings</h2>

            {/* Locations CRUD */}
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h3 className="text-xl font-bold" style={{ marginBottom: 'var(--space-4)' }}>Locations</h3>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newLocationName} 
                    onChange={e => setNewLocationName(e.target.value)} 
                    placeholder="New Location Name" 
                    className="input-field" 
                    style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                  />
                  <button className="btn btn-primary" onClick={handleAddLocation}>Add</button>
                </div>
                {locations.map(loc => (
                  <div key={loc.id} className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>
                    <span>{loc.name}</span>
                    <button className={`btn text-sm ${loc.isActive ? 'btn-secondary text-danger' : 'btn-primary'}`} onClick={() => handleLocationStatus(loc, !loc.isActive)}>
                      {loc.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Slots CRUD */}
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h3 className="text-xl font-bold" style={{ marginBottom: 'var(--space-4)' }}>Delivery Slots &amp; Location Availability</h3>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2 items-center flex-wrap">
                  <input type="text" value={newSlotStart} onChange={e => setNewSlotStart(e.target.value)} placeholder="e.g. 09:00 AM" className="input-field" style={{ padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} />
                  <span>to</span>
                  <input type="text" value={newSlotEnd} onChange={e => setNewSlotEnd(e.target.value)} placeholder="e.g. 12:00 PM" className="input-field" style={{ padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} />
                  <input type="number" value={newSlotCapacity} onChange={e => setNewSlotCapacity(e.target.value)} placeholder="Capacity" className="input-field" style={{ width: '80px', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} />
                  <button className="btn btn-primary" onClick={handleAddSlot}>Add Slot</button>
                </div>
                {slots.map(slot => {
                  const currentLocIds = slotLocationSelections[slot.id] || [];
                  const activeLocationsList = locations.filter(l => l.isActive);
                  return (
                    <div key={slot.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', backgroundColor: 'var(--bg-card, #ffffff)' }}>
                      <div className="flex items-center justify-between flex-wrap gap-2" style={{ marginBottom: 'var(--space-3)' }}>
                        <div>
                          <span className="font-bold text-base">{slot.startTime} - {slot.endTime}</span>
                          <span className="text-muted text-xs" style={{ marginLeft: 'var(--space-2)' }}>(Capacity: {slot.capacity})</span>
                        </div>
                        <button className={`btn text-sm ${slot.isActive ? 'btn-secondary text-danger' : 'btn-primary'}`} onClick={() => handleSlotStatus(slot, !slot.isActive)}>
                          {slot.isActive ? 'Deactivate Slot' : 'Activate Slot'}
                        </button>
                      </div>

                      <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-3)' }}>
                        <p className="text-xs font-bold text-muted" style={{ marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Available Delivery Locations for this Slot
                        </p>
                        {activeLocationsList.length === 0 ? (
                          <p className="text-xs text-muted">No active locations available. Create locations above first.</p>
                        ) : (
                          <div className="flex flex-wrap gap-4" style={{ marginBottom: 'var(--space-3)' }}>
                            {activeLocationsList.map(loc => (
                              <label key={loc.id} className="flex items-center gap-2 text-sm" style={{ cursor: 'pointer', userSelect: 'none' }}>
                                <input
                                  type="checkbox"
                                  checked={currentLocIds.includes(loc.id)}
                                  onChange={() => handleToggleSlotLocation(slot.id, loc.id)}
                                  style={{ width: '16px', height: '16px', accentColor: '#22c55e', cursor: 'pointer' }}
                                />
                                <span>{loc.name}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <button
                            className="btn btn-primary text-xs"
                            disabled={savingSlotLocationId === slot.id}
                            onClick={() => handleSaveSlotLocations(slot.id)}
                            style={{ padding: '0.35rem 0.8rem' }}
                          >
                            {savingSlotLocationId === slot.id ? 'Saving...' : 'Save Availability'}
                          </button>
                          {slotLocationSavedMessage[slot.id] && (
                            <span className="text-xs font-bold" style={{ color: '#16a34a' }}>
                              ✓ {slotLocationSavedMessage[slot.id]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Pricing Management */}
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h3 className="text-xl font-bold" style={{ marginBottom: 'var(--space-4)' }}>Dynamic Pricing Config</h3>
              <div className="flex flex-col gap-4">
                {pricingRules.map(rule => (
                  <div key={rule.id} className="flex items-center justify-between flex-wrap gap-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>
                    <span className="font-semibold">{rule.ruleKey}</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        defaultValue={rule.price} 
                        step="0.01"
                        onBlur={e => handlePricingUpdate(rule.id, e.target.value, rule.isActive)}
                        className="input-field"
                        style={{ width: '100px', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
                      />
                      <button className={`btn text-sm ${rule.isActive ? 'btn-secondary text-danger' : 'btn-primary'}`} onClick={() => handlePricingUpdate(rule.id, rule.price, !rule.isActive)}>
                        {rule.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Business Controls */}
        {activeTab === 'business' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-bold">Business Controls</h2>
              <p className="text-muted text-sm" style={{ marginTop: '0.25rem' }}>
                Manage promotional offers, holiday/leave periods, and customize the weekly working schedule.
              </p>
            </div>

            {/* SECTION 1: Offers & Announcements Banner */}
            <div className="card" style={{ padding: 'var(--space-6)', borderRadius: '18px' }}>
              <div className="flex justify-between items-center flex-wrap gap-2" style={{ marginBottom: 'var(--space-4)' }}>
                <div>
                  <h3 className="text-xl font-bold">🎁 Offers & Announcements Banner</h3>
                  <p className="text-xs text-muted">Banners automatically appear on customer Order Builder when active.</p>
                </div>
              </div>

              {/* Create Banner Form */}
              <form onSubmit={handleCreateBanner} style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                <h4 className="text-sm font-bold" style={{ marginBottom: '0.75rem', color: '#1e293b' }}>Create New Announcement / Offer</h4>
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label className="text-xs font-semibold text-muted">Title *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Weekend Special" 
                      value={newBannerTitle} 
                      onChange={e => setNewBannerTitle(e.target.value)} 
                      required 
                      className="input-field" 
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted">Offer Type</label>
                    <select 
                      value={newBannerType} 
                      onChange={e => setNewBannerType(e.target.value)} 
                      className="input-field" 
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#fff' }}
                    >
                      <option value="ANNOUNCEMENT">General Announcement</option>
                      <option value="PROMO">Special Offer / Promotion</option>
                      <option value="DISCOUNT">Price Change / Discount</option>
                      <option value="FREEBIE">Freebie / Campus Perk</option>
                      <option value="NOTICE">Service Notice</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted">Offer Value / Badge (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 15% OFF, FREE PICKUP" 
                      value={newBannerValue} 
                      onChange={e => setNewBannerValue(e.target.value)} 
                      className="input-field" 
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted">CTA Text (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. View Offer, Order Now" 
                      value={newBannerCtaText} 
                      onChange={e => setNewBannerCtaText(e.target.value)} 
                      className="input-field" 
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label className="text-xs font-semibold text-muted">Message / Description *</label>
                  <textarea 
                    rows={2} 
                    placeholder="e.g. Get your color prints at a special campus price this weekend." 
                    value={newBannerMsg} 
                    onChange={e => setNewBannerMsg(e.target.value)} 
                    required 
                    className="input-field" 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                  />
                </div>

                <div className="flex gap-4 flex-wrap items-center">
                  <div>
                    <label className="text-xs font-semibold text-muted">Start Date (Optional)</label>
                    <input 
                      type="datetime-local" 
                      value={newBannerStart} 
                      onChange={e => setNewBannerStart(e.target.value)} 
                      className="input-field" 
                      style={{ padding: '0.45rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted">End Date (Optional)</label>
                    <input 
                      type="datetime-local" 
                      value={newBannerEnd} 
                      onChange={e => setNewBannerEnd(e.target.value)} 
                      className="input-field" 
                      style={{ padding: '0.45rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ marginTop: 'auto', padding: '0.5rem 1.25rem' }}>
                    Publish Banner
                  </button>
                </div>
              </form>

              {/* Banners List */}
              <div className="flex flex-col gap-3">
                {banners.length === 0 ? (
                  <p className="text-muted text-sm">No announcement banners created yet.</p>
                ) : (
                  banners.map(b => (
                    <div 
                      key={b.id} 
                      className="flex items-center justify-between flex-wrap gap-3" 
                      style={{ 
                        borderBottom: '1px solid var(--border-color)', 
                        paddingBottom: '0.85rem',
                        opacity: b.isActive ? 1 : 0.65
                      }}
                    >
                      <div style={{ minWidth: '240px', flex: 1 }}>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm" style={{ color: '#1e293b' }}>{b.title}</span>
                          <span className={`badge ${b.isActive ? 'text-success' : 'text-muted'}`} style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                            {b.isActive ? 'ACTIVE' : 'DISABLED'}
                          </span>
                          {b.offerValue && (
                            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontWeight: 600 }}>
                              {b.offerValue}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>{b.message}</p>
                        {(b.startDate || b.endDate) && (
                          <p className="text-xs text-muted" style={{ marginTop: '0.15rem', fontSize: '0.72rem' }}>
                            Schedule: {b.startDate ? new Date(b.startDate).toLocaleDateString() : 'Immediate'} → {b.endDate ? new Date(b.endDate).toLocaleDateString() : 'Indefinite'}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button 
                          className={`btn text-xs ${b.isActive ? 'btn-secondary text-danger' : 'btn-primary'}`} 
                          onClick={() => handleToggleBanner(b)}
                          style={{ padding: '0.35rem 0.75rem' }}
                        >
                          {b.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button 
                          className="btn btn-secondary text-danger text-xs" 
                          onClick={() => handleDeleteBanner(b.id)}
                          style={{ padding: '0.35rem 0.75rem' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* SECTION 2: Holidays & Leave Periods */}
            <div className="card" style={{ padding: 'var(--space-6)', borderRadius: '18px' }}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h3 className="text-xl font-bold">🏖️ Holidays & Leave Periods</h3>
                <p className="text-xs text-muted">
                  Leave days automatically adjust customer estimated delivery dates without blocking order placement.
                </p>
              </div>

              {/* Add Holiday Form */}
              <form onSubmit={handleCreateHoliday} style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                <h4 className="text-sm font-bold" style={{ marginBottom: '0.75rem', color: '#1e293b' }}>Add Leave / Non-Working Period</h4>
                <div className="flex gap-4 flex-wrap items-center">
                  <div>
                    <label className="text-xs font-semibold text-muted">Start Date (YYYY-MM-DD) *</label>
                    <input 
                      type="date" 
                      value={newHolidayStart} 
                      onChange={e => setNewHolidayStart(e.target.value)} 
                      required 
                      className="input-field" 
                      style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted">End Date (YYYY-MM-DD) *</label>
                    <input 
                      type="date" 
                      value={newHolidayEnd} 
                      onChange={e => setNewHolidayEnd(e.target.value)} 
                      required 
                      className="input-field" 
                      style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <label className="text-xs font-semibold text-muted">Customer Notice Message (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mid-term break. Orders placed now print from 18 Sep." 
                      value={newHolidayMsg} 
                      onChange={e => setNewHolidayMsg(e.target.value)} 
                      className="input-field" 
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ marginTop: 'auto', padding: '0.5rem 1.25rem' }}>
                    Add Leave Period
                  </button>
                </div>
              </form>

              {/* Holidays List */}
              <div className="flex flex-col gap-3">
                {holidays.length === 0 ? (
                  <p className="text-muted text-sm">No holiday or leave periods currently scheduled.</p>
                ) : (
                  holidays.map(h => (
                    <div key={h.id} className="flex items-center justify-between flex-wrap gap-2" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                      <div>
                        <span className="font-semibold text-sm" style={{ color: '#1e293b' }}>
                          📅 {h.startDate} → {h.endDate}
                        </span>
                        {h.message && <p className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>{h.message}</p>}
                      </div>
                      <button 
                        className="btn btn-secondary text-danger text-xs" 
                        onClick={() => handleDeleteHoliday(h.id)}
                        style={{ padding: '0.35rem 0.75rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* SECTION 3: Weekly Working Calendar */}
            <div className="card" style={{ padding: 'var(--space-6)', borderRadius: '18px' }}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h3 className="text-xl font-bold">📅 Weekly Working Calendar</h3>
                <p className="text-xs text-muted">
                  Default schedule: Mon-Fri working, Sat-Sun leave. Click any day to toggle between Working and Leave. Changes save immediately.
                </p>
              </div>

              <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as Array<keyof WorkingCalendarDays>).map(day => {
                  const isWorking = calendar[day];
                  return (
                    <div 
                      key={day} 
                      onClick={() => handleToggleCalendarDay(day)}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        border: isWorking ? '2px solid #16a34a' : '2px solid #e2e8f0',
                        backgroundColor: isWorking ? 'rgba(22, 163, 74, 0.05)' : '#f8fafc',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'capitalize', display: 'block', color: '#1e293b' }}>
                        {day}
                      </span>
                      <span 
                        style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          marginTop: '0.35rem', 
                          display: 'inline-block',
                          color: isWorking ? '#16a34a' : '#94a3b8' 
                        }}
                      >
                        {isWorking ? '✅ Working' : '❌ Leave'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Tab 4: Print Stations & Queue controls */}
        {activeTab === 'stations' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold">Print Station & Capacity Management</h2>

            {/* Phase 2: Printer Paper Capacity & Reload Card */}
            <div className="card" style={{ padding: 'var(--space-6)', borderRadius: '18px' }}>
              <div className="flex justify-between items-center flex-wrap gap-3" style={{ marginBottom: 'var(--space-4)' }}>
                <div>
                  <h3 className="text-xl font-bold">🖨️ Printer Paper Safe Capacity</h3>
                  <p className="text-xs text-muted">Authoritative physical sheets tracked per paper loading cycle (140-sheet safe threshold).</p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleReloadPaper}
                  disabled={reloadingPaper}
                  style={{
                    backgroundColor: '#16a34a',
                    padding: '0.6rem 1.25rem',
                    fontWeight: 700,
                    borderRadius: '10px'
                  }}
                >
                  {reloadingPaper ? 'Reloading...' : '📄 Paper Reloaded'}
                </button>
              </div>

              {reloadMessage && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    marginBottom: '1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(34, 197, 94, 0.12)',
                    color: '#16a34a',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  {reloadMessage}
                </div>
              )}

              {paperCapacity ? (
                <>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}
                  >
                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <span className="text-xs text-muted block font-semibold">Active Batch</span>
                      <span className="text-2xl font-bold" style={{ color: '#1e293b' }}>#{paperCapacity.batchNumber}</span>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <span className="text-xs text-muted block font-semibold">Safe Limit</span>
                      <span className="text-2xl font-bold" style={{ color: '#0284c7' }}>{paperCapacity.safeCapacity} <span style={{ fontSize: '0.85rem' }}>sheets</span></span>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <span className="text-xs text-muted block font-semibold">Used</span>
                      <span className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{paperCapacity.usedSheets} <span style={{ fontSize: '0.85rem' }}>sheets</span></span>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <span className="text-xs text-muted block font-semibold">Reserved</span>
                      <span className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>{paperCapacity.reservedSheets} <span style={{ fontSize: '0.85rem' }}>sheets</span></span>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <span className="text-xs text-muted block font-semibold">Available</span>
                      <span className="text-2xl font-bold" style={{ color: paperCapacity.remainingSheets <= 10 ? '#dc2626' : '#16a34a' }}>
                        {paperCapacity.remainingSheets} <span style={{ fontSize: '0.85rem' }}>sheets</span>
                      </span>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <span className="text-xs text-muted block font-semibold">Status</span>
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: '0.25rem',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor:
                            paperCapacity.status === 'ACTIVE'
                              ? (paperCapacity.remainingSheets <= 10 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)')
                              : 'rgba(148, 163, 184, 0.15)',
                          color:
                            paperCapacity.status === 'ACTIVE'
                              ? (paperCapacity.remainingSheets <= 10 ? '#dc2626' : '#16a34a')
                              : '#64748b'
                        }}
                      >
                        {paperCapacity.status === 'ACTIVE'
                          ? (paperCapacity.remainingSheets <= 10 ? 'NEAR CAPACITY' : 'ACTIVE')
                          : paperCapacity.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <span className="font-bold text-sm block" style={{ color: '#1e293b' }}>Queue when capacity is full</span>
                      <span className="text-xs text-muted block">
                        {paperCapacity.queueWhenCapacityFull
                          ? 'ON — Orders exceeding paper capacity will be accepted into the queue.'
                          : 'OFF — Orders exceeding paper capacity will be blocked from full slots and offered the next slot.'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: paperCapacity.queueWhenCapacityFull ? '#16a34a' : '#64748b'
                        }}
                      >
                        {paperCapacity.queueWhenCapacityFull ? '[ ON ]' : '[ OFF ]'}
                      </span>
                      <button
                        className="btn"
                        onClick={handleToggleQueueMode}
                        disabled={togglingQueueMode || !paperCapacity}
                        style={{
                          backgroundColor: paperCapacity.queueWhenCapacityFull ? '#0284c7' : '#e2e8f0',
                          color: paperCapacity.queueWhenCapacityFull ? '#ffffff' : '#1e293b',
                          padding: '0.45rem 1rem',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          borderRadius: '8px'
                        }}
                      >
                        {togglingQueueMode ? 'Updating...' : (paperCapacity.queueWhenCapacityFull ? 'Turn OFF' : 'Turn ON')}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted text-sm">Loading paper capacity details...</p>
              )}
            </div>

            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h3 className="text-xl font-bold" style={{ marginBottom: 'var(--space-4)' }}>Print Stations Queue Control</h3>
              {stations.map(station => (
                <div key={station.id} className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <div>
                    <span className="font-semibold">{station.name}</span>
                    <span className="text-muted text-xs" style={{ marginLeft: 'var(--space-2)' }}>({station.status})</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary text-sm" onClick={async () => {
                      const res = await fetch(`${API_URL}/admin/print-stations/${station.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
                        credentials: 'include',
                        body: JSON.stringify({ status: 'PAUSED' })
                      });
                      if (res.ok) loadDashboardData();
                    }}>Pause</button>
                    <button className="btn btn-primary text-sm" onClick={async () => {
                      const res = await fetch(`${API_URL}/admin/print-stations/${station.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
                        credentials: 'include',
                        body: JSON.stringify({ status: 'ONLINE' })
                      });
                      if (res.ok) loadDashboardData();
                    }}>Resume</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
