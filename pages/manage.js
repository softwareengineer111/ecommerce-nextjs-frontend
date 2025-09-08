import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import ShopManagerGuard from '../../components/ShopManagerGuard';

const ManageShopPage = () => {
  const [form, setForm] = useState({ shopName: '', shopLocation: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShopDetails = async () => {
      setIsLoading(true);
      try {
        const data = await apiFetch('/shop/me');
        if (data && data.shop) {
          setForm({
            shopName: data.shop.name || '',
            shopLocation: data.shop.location || '',
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShopDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError('');
    try {
      await apiFetch('/shop/me', {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      alert('Shop details updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className='loading-spinner'></div>;
  }

  return (
    <div className='form-container'>
      <h1>Manage Your Shop</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='shopName'>Shop Name</label>
          <input
            id='shopName'
            className='form-input'
            value={form.shopName}
            onChange={(e) => setForm({ ...form, shopName: e.target.value })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='shopLocation'>Shop Location</label>
          <input
            id='shopLocation'
            className='form-input'
            value={form.shopLocation}
            onChange={(e) => setForm({ ...form, shopLocation: e.target.value })}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type='submit' className='form-button' disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Shop Details'}
        </button>
      </form>
    </div>
  );
};

export default function GuardedManageShopPage() {
  return (
    <ShopManagerGuard>
      <ManageShopPage />
    </ShopManagerGuard>
  );
}
