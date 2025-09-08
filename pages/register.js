import { useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '../utils/api';
import GuestGuard from '../components/GuestGuard';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // Use the centralized apiFetch utility for consistent error handling
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
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
      <h1>Register</h1>
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
