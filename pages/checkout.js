import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '../utils/api';
import AuthGuard from '../components/AuthGuard';
import styles from './checkout.module.css';

function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch the cart to display a summary
    apiFetch('/cart')
      .then((data) => {
        if (!data || data.items.length === 0) {
          // If cart is empty, redirect back to the cart page, which shows an "empty" message
          router.push('/cart');
        } else {
          setCart(data);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [router]);

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Shipping address is required.');
      return;
    }

    setIsPlacingOrder(true);
    setError('');

    try {
      const newOrder = await apiFetch('/checkout', {
        method: 'POST',
        body: JSON.stringify({ address }),
      });
      // Redirect to a success page with the new order ID
      router.push(`/orders/${newOrder._id}/success`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoading) {
    return <div className='loading-spinner'></div>;
  }

  if (error && !cart) {
    // Show critical error if cart fails to load
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div className={styles.container}>
      <h1>Checkout</h1>
      <div className={styles.layout}>
        <div className={styles.formSection}>
          <h2>Shipping Information</h2>
          <form onSubmit={handlePlaceOrder}>
            <div className={styles.formGroup}>
              <label htmlFor='address'>Shipping Address</label>
              <textarea
                id='address'
                className={styles.formInput}
                rows='4'
                placeholder='Enter your full shipping address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button
              type='submit'
              className={styles.placeOrderButton}
              disabled={isPlacingOrder || !cart}
            >
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className={styles.summarySection}>
          <h2>Order Summary</h2>
          {cart && (
            <>
              <ul className={styles.itemList}>
                {cart.items.map((item) => (
                  <li key={item.product._id} className={styles.item}>
                    <span className={styles.itemName}>
                      {item.product.name} (x{item.quantity})
                    </span>
                    <span className={styles.itemPrice}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className={styles.total}>
                <strong>Total:</strong>
                <strong>${calculateTotal().toFixed(2)}</strong>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const GuardedCheckoutPage = () => (
  <AuthGuard>
    <CheckoutPage />
  </AuthGuard>
);

export default GuardedCheckoutPage;
