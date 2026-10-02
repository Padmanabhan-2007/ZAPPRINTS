export interface SavedCustomer {
  name: string;
  phone: string;
}

const STORAGE_KEY = 'zapprints_customer';

/**
 * Safely loads remembered customer name and phone from localStorage.
 * Returns empty strings if no data exists or if parsing fails.
 */
export const getSavedCustomer = (): SavedCustomer => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { name: '', phone: '' };
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { name: '', phone: '' };
    }
    const parsed = JSON.parse(raw);
    return {
      name: typeof parsed?.name === 'string' ? parsed.name : '',
      phone: typeof parsed?.phone === 'string' ? parsed.phone : ''
    };
  } catch (err) {
    console.warn('[customerStorage] Failed to read saved customer from localStorage:', err);
    return { name: '', phone: '' };
  }
};

/**
 * Safely saves customer name and phone to localStorage upon successful order/payment completion.
 * Stores ONLY name and phone.
 */
export const saveCustomer = (name: string, phone: string): void => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    const cleanName = (name || '').trim();
    const cleanPhone = (phone || '').trim();

    // Only save if at least one field has content
    if (!cleanName && !cleanPhone) {
      return;
    }

    const payload: SavedCustomer = {
      name: cleanName,
      phone: cleanPhone
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[customerStorage] Failed to save customer to localStorage:', err);
  }
};
