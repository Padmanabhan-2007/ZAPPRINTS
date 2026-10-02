import { auth } from './firebase';

let memorySessionId: string | null = null;

export const getSessionId = (): string => {
  try {
    let sessionId = localStorage.getItem('zap_session_id');
    if (!sessionId) {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        sessionId = crypto.randomUUID();
      } else if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);
        sessionId = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
      } else {
        sessionId = memorySessionId || (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
      }
      memorySessionId = sessionId;
      localStorage.setItem('zap_session_id', sessionId);
    }
    return sessionId;
  } catch (e) {
    if (!memorySessionId) {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        memorySessionId = crypto.randomUUID();
      } else {
        memorySessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      }
    }
    return memorySessionId;
  }
};

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    'x-session-id': getSessionId()
  };

  // Wait for auth initialization if currentUser is temporarily undefined on boot
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    } catch (e) {
      console.error('Failed to retrieve Firebase ID Token:', e);
    }
  }

  return headers;
};
