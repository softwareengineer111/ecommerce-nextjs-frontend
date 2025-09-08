import { useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch, getUserFromToken } from '../utils/api';
import GuestGuard from '../components/GuestGuard';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // Use the centralized apiFetch utility for consistent error handling
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      if (!data.token) {
        throw new Error('Login failed: No token received.');
      }

      // Save the token
      localStorage.setItem('token', data.token);

      // Get user data from the new token to check the role
      const user = getUserFromToken();

      // You can check the user object in the browser console
      console.log('Logged in user data:', user);

      if (user && user.role === 'superadmin') {
        // If superadmin, redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        // For other roles, or if user data is not available, redirect to home
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='form-container'>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            className='form-input'
            placeholder='Email'
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
            placeholder='Password'
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type='submit' className='form-button' disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default function GuardedLogin() {
  return (
    <GuestGuard>
      <Login />
    </GuestGuard>
  );
}
