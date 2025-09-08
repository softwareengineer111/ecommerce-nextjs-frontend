import { useState } from 'react';
import { useRouter } from 'next/router';
import { API_URL, getUserFromToken } from '../../utils/api';
import GuestGuard from '../../components/GuestGuard';

/**
 * Super Admin нэвтрэх хуудасны үндсэн компонент.
 * Энэ хуудас нь ердийн нэвтрэх хуудастай адилхан харагдах боловч
 * нэвтэрсэн хэрэглэгчийн эрхийг шалгаж, зөвхөн 'super admin' бол амжилттай нэвтрүүлнэ.
 */
function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.token) {
        throw new Error(data.message || 'Нэвтрэх үед алдаа гарлаа.');
      }

      // Токеныг түр хадгалаад хэрэглэгчийн мэдээллийг шалгана
      localStorage.setItem('token', data.token);
      const user = getUserFromToken();

      // Хэрэглэгчийн role нь 'super admin' мөн эсэхийг шалгана
      if (user && user.role === 'super admin') {
        // Амжилттай нэвтэрсэн бол админы удирдлагын самбар луу шилжүүлнэ.
        window.location.href = '/admin/dashboard';
      } else {
        // Хэрэв 'super admin' биш бол токеныг устгаад алдааны мэдээлэл харуулна
        localStorage.removeItem('token');
        throw new Error('Зөвхөн Super Admin нэвтрэх эрхтэй!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='form-container'>
      <h1>Super Admin Нэвтрэх</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>И-мэйл</label>
          <input
            id='email'
            type='email'
            className='form-input'
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Нууц үг</label>
          <input
            id='password'
            type='password'
            className='form-input'
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type='submit' className='form-button' disabled={isLoading}>
          {isLoading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
        </button>
      </form>
    </div>
  );
}

// Энэ хуудсыг GuestGuard-аар хамгаалж, нэвтэрсэн хэрэглэгч хандах боломжгүй болгоно
export default function GuardedAdminLogin() {
  return (
    <GuestGuard>
      <AdminLogin />
    </GuestGuard>
  );
}
