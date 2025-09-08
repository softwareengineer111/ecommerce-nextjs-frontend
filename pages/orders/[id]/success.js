import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { apiFetch } from '../../../utils/api';
import AuthGuard from '../../../components/AuthGuard';

function OrderSuccessPage() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    // Fetch the order details to display a confirmation summary.
    // Note: This requires a backend endpoint for users to fetch their own orders.
    // Assuming an endpoint like `GET /orders/mine/:id` exists.
    // For now, we'll use the admin endpoint `/orders/:id` for demonstration.
    apiFetch(`/orders/${id}`)
      .then((data) => setOrder(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <div className='loading-spinner'></div>;
  }

  if (error) {
    return (
      <p style={{ color: 'red' }}>Error loading order confirmation: {error}</p>
    );
  }

  return (
    <div className='order-success-container'>
      <div className='success-icon'>&#10004;</div>
      <h1>Thank You For Your Order!</h1>
      <p>Your order has been placed successfully.</p>
      <p>
        <strong>Order ID:</strong> {order?._id}
      </p>

      {order && (
        <div className='order-summary-box'>
          <h2>Order Summary</h2>
          <p>
            <strong>Total:</strong> ${order.total.toFixed(2)}
          </p>
          <p>
            <strong>Shipping to:</strong> {order.address}
          </p>
          <ul className='order-items-list'>
            {order.items.map((item) => (
              <li key={item.product._id} className='order-item-detail'>
                <img
                  src={item.product.images?.[0]?.url || '/placeholder.png'}
                  alt={item.product.name}
                  className='order-item-image'
                />
                <div className='order-item-info'>
                  <h3>{item.product.name}</h3>
                  <p>Quantity: {item.qty}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link href='/' className='form-button'>
        Continue Shopping
      </Link>
    </div>
  );
}

const GuardedOrderSuccessPage = () => (
  <AuthGuard>
    <OrderSuccessPage />
  </AuthGuard>
);

export default GuardedOrderSuccessPage;
