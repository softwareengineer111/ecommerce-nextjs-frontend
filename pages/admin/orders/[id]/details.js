import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '../../../../utils/api';
import AdminGuard from '../../../../components/AdminGuard';

const OrderDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const validStatuses = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await apiFetch(`/orders/${id}`);
          setOrder(data);
          setStatus(data.status);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updatedOrder = await apiFetch(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setOrder(updatedOrder);
      alert('Order status updated successfully!');
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div className='loading-spinner'></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className='order-detail-admin-container'>
      <h1>Order Details</h1>
      <div className='order-summary-box'>
        <h2>Summary</h2>
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>User:</strong> {order.user.name} ({order.user.email})
        </p>
        <p>
          <strong>Order Date:</strong>{' '}
          {new Date(order.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Total:</strong> ${order.total.toFixed(2)}
        </p>
        <p>
          <strong>Current Status:</strong>{' '}
          <span
            className={`order-status-badge status-${order.status
              .toLowerCase()
              .replace(' ', '-')}`}
          >
            {order.status}
          </span>
        </p>
      </div>

      <div className='order-status-update-box'>
        <h2>Update Status</h2>
        <form onSubmit={handleStatusUpdate}>
          <div className='form-group'>
            <label htmlFor='status'>New Status</label>
            <select
              id='status'
              className='form-input'
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {validStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button type='submit' className='form-button' disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Status'}
          </button>
        </form>
      </div>

      <div className='order-items-box'>
        <h2>Items in Order</h2>
        <ul className='order-items-list'>
          {order.items.map((item) => (
            <li key={item.product._id} className='order-item-detail'>
              <img
                src={
                  item.product.images && item.product.images.length > 0
                    ? item.product.images[0].url
                    : 'https://via.placeholder.com/100'
                }
                alt={item.product.name}
                className='order-item-image'
              />
              <div className='order-item-info'>
                <h3>{item.product.name}</h3>
                <p>Quantity: {item.qty}</p>
                <p>Price per item: ${item.price.toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className='order-address-box'>
        <h2>Shipping Address</h2>
        <p>{order.address}</p>
      </div>
    </div>
  );
};

export default function GuardedOrderDetailPage() {
  return (
    <AdminGuard>
      <OrderDetailPage />
    </AdminGuard>
  );
}
