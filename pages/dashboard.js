import Link from 'next/link';
import AuthGuard from '../../components/AuthGuard';
import { getUserFromToken } from '../../utils/api';

function AdminDashboard() {
  const user = getUserFromToken();

  return (
    <div>
      <h1>Админы Удирдлагын Самбар</h1>
      <p>
        Сайн байна уу, <strong>{user?.name || 'Admin'}</strong>!
      </p>

      <div className='dashboard-grid'>
        <Link href='/add-product' className='dashboard-card'>
          <h3>Бүтээгдэхүүн Нэмэх</h3>
          <p>Шинэ бараа бүтээгдэхүүнийг системд бүртгэх.</p>
        </Link>
        <div className='dashboard-card disabled'>
          <h3>Хэрэглэгч Удирдах</h3>
          <p>Бүх хэрэглэгчийн мэдээллийг харах, удирдах (Тун удахгүй).</p>
        </div>
        <div className='dashboard-card disabled'>
          <h3>Захиалга Харах</h3>
          <p>Сайтын захиалгуудыг хянах (Тун удахгүй).</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Энэ хуудсыг AuthGuard-аар хамгаалж, зөвхөн 'super admin'
 * эрхтэй хэрэглэгч хандах боломжтой болгоно.
 */
export default function GuardedAdminDashboard() {
  return (
    <AuthGuard allowedRoles={['super admin']}>
      <AdminDashboard />
    </AuthGuard>
  );
}
