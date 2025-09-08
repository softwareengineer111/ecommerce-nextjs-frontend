import { useState } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '../utils/api';
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
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setIsLoading(false);

    if (data.token) {
      localStorage.setItem('token', data.token);
      // Use window.location to trigger a full refresh and update Navbar state
      window.location.href = '/';
    } else {
      setError(data.message || 'Login failed. Please check your credentials.');
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
            className='form-input'
            placeholder='Email'
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
