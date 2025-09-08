import { useState } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '../utils/api';
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
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setIsLoading(false);

    if (res.ok) {
      alert('Registration successful! Please log in.');
      router.push('/login');
    } else {
      setError(data.message || 'Registration failed. Please try again.');
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
            placeholder='Name'
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
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
