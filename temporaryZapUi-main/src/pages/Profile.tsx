import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, User, LogOut, Save, Package, ArrowRight } from 'lucide-react';
import { getAuthHeaders } from '../utils/session';
import { auth } from '../utils/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { API_URL } from '../utils/api';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${API_URL}/customer/profile`, {
          headers: authHeaders
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
          setName(data.profile.name || '');
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_URL}/customer/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({ name })
      });

      if (!res.ok) throw new Error('Failed to update profile');
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--color-accent-light)' }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fcfbf9', minHeight: '80vh', padding: 'var(--space-8) var(--space-4)' }}>
      <div className="container" style={{ maxWidth: '550px', margin: '0 auto' }}>
        <h1 className="text-2xl font-bold" style={{ marginBottom: 'var(--space-6)', color: '#1e293b', letterSpacing: '-0.5px' }}>
          Profile Settings
        </h1>

        {message && (
          <div style={{ padding: '0.8rem', backgroundColor: 'color-mix(in srgb, var(--color-accent-light) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--color-accent-light) 20%, transparent)', color: 'var(--color-accent-light)', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {message}
          </div>
        )}
        {error && (
          <div style={{ padding: '0.8rem', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <div className="card" style={{ marginBottom: 'var(--space-6)', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)', padding: '2rem', backgroundColor: '#ffffff' }}>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex items-center gap-4" style={{ marginBottom: 'var(--space-2)' }}>
              <div className="flex items-center justify-center" style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                {auth.currentUser?.photoURL ? (
                  <img src={auth.currentUser.photoURL} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={30} style={{ color: '#64748b' }} />
                )}
              </div>
              <div>
                <div className="text-md font-semibold" style={{ color: '#1e293b' }}>{profile?.name}</div>
                <div className="text-sm text-muted">{profile?.email}</div>
              </div>
            </div>

            <div>
              <label className="label" style={{ color: '#475569', fontSize: '0.85rem', fontWeight: 600 }}>Full Name</label>
              <input 
                type="text" 
                className="input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                style={{ borderRadius: '10px', border: '1px solid rgba(0,0,0,0.12)', padding: '0.6rem 0.8rem', width: '100%', outline: 'none' }}
              />
            </div>

            <button type="submit" className="btn btn-primary flex items-center gap-2 justify-center" disabled={saving} style={{ borderRadius: '10px', padding: '0.7rem' }}>
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Changes
            </button>
          </form>
        </div>

        {/* Orders & Print History Access */}
        <div className="card" style={{ marginBottom: 'var(--space-6)', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)', padding: '1.75rem', backgroundColor: '#ffffff' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '0.75rem' }}>
            <div className="flex items-center gap-3">
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'color-mix(in srgb, var(--color-accent-light) 10%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={20} style={{ color: 'var(--orange)' }} />
              </div>
              <div>
                <h2 className="text-md font-bold" style={{ color: '#1e293b', letterSpacing: '-0.3px' }}>My Orders & Print Jobs</h2>
                <p className="text-xs text-muted">Track live statuses, re-order documents, and view receipts</p>
              </div>
            </div>
          </div>
          <p className="text-sm" style={{ color: '#64748b', marginBottom: '1.25rem', lineHeight: 1.45 }}>
            Access all your past prints, live canteen delivery statuses, and daily job tracking directly from your account.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link 
              to="/orders" 
              className="btn btn-primary flex items-center gap-2" 
              style={{ flex: 1, minWidth: '160px', padding: '0.65rem 1.25rem', borderRadius: '10px', fontSize: '0.875rem' }}
            >
              <Package size={15} /> View My Orders
            </Link>
            <Link 
              to="/order" 
              className="btn btn-secondary flex items-center gap-2" 
              style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', fontSize: '0.875rem' }}
            >
              New Print Job <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="card" style={{ border: '1px solid rgba(239,68,68,0.2)', borderRadius: '20px', padding: '2rem', backgroundColor: '#ffffff' }}>
          <h2 className="text-md font-bold" style={{ color: '#ef4444', marginBottom: 'var(--space-1)', letterSpacing: '-0.3px' }}>Danger Zone</h2>
          <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-4)' }}>Sign out from your ZapPrints account on this device.</p>
          <button onClick={handleSignOut} className="btn flex items-center gap-2 justify-center" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)', backgroundColor: 'transparent', width: '100%', padding: '0.7rem', borderRadius: '10px' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
