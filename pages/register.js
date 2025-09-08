import { useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '../utils/api';
import GuestGuard from '../components/GuestGuard';

function Register() {
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' or 'shopmanager'
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
    shopLocation: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      let endpoint = '';
      let payload = {};

      if (activeTab === 'customer') {
        endpoint = '/auth/register/customer';
        payload = {
          name: form.name,
          email: form.email,
          password: form.password,
        };
      } else {
        // shopmanager
        endpoint = '/auth/register/shop-manager';
        payload = form;
      }

      await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      alert('Registration successful! Please log in.');
      router.push('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='form-container'>
      <div className='tab-container'>
        <button
          className={`tab-button ${activeTab === 'customer' ? 'active' : ''}`}
          onClick={() => setActiveTab('customer')}
        >
          Register as Customer
        </button>
        <button
          className={`tab-button ${
            activeTab === 'shopmanager' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('shopmanager')}
        >
          Register as Shop Manager
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            id='name'
            className='form-input'
            placeholder='Your Name'
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            className='form-input'
            placeholder='your.email@example.com'
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            type='password'
            className='form-input'
            placeholder='Create a password'
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        {activeTab === 'shopmanager' && (
          <>
            <div className='form-group'>
              <label htmlFor='shopName'>Shop Name</label>
              <input
                id='shopName'
                className='form-input'
                placeholder='Your Shop Name'
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='shopLocation'>Shop Location</label>
              <input
                id='shopLocation'
                className='form-input'
                placeholder='e.g., City, Country'
                onChange={(e) =>
                  setForm({ ...form, shopLocation: e.target.value })
                }
              />
            </div>
          </>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type='submit' className='form-button' disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default function GuardedRegister() {
  return (
    <GuestGuard>
      <Register />
    </GuestGuard>
  );
}
