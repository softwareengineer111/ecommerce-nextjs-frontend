import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../utils/api';
import AdminGuard from '../../components/AdminGuard';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/orders/all'); // Use the admin endpoint
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <div className='page-header'>
        <h1>Manage Orders</h1>
      </div>

      {isLoading && <div className='loading-spinner'></div>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!isLoading && !error && (
        <ul className='order-list-admin'>
          {orders.length === 0 && <p>No orders found.</p>}
          {orders.map((order) => (
            <li key={order._id} className='order-item-admin'>
              <div className='order-info-main'>
                <strong>Order ID:</strong> {order._id} <br />
                <strong>User:</strong> {order.user ? order.user.name : 'N/A'} (
                {order.user ? order.user.email : 'N/A'}) <br />
                <strong>Date:</strong>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className='order-info-secondary'>
                <span
                  className={`order-status-badge status-${order.status
                    .toLowerCase()
                    .replace(' ', '-')}`}
                >
                  {order.status}
                </span>
                <span className='order-total'>${order.total.toFixed(2)}</span>
              </div>
              <div className='order-actions-admin'>
                <Link
                  href={`/admin/orders/${order._id}`}
                  className='action-button edit'
                >
                  View Details
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function GuardedOrdersPage() {
  return (
    <AdminGuard>
      <OrdersPage />
    </AdminGuard>
  );
}
