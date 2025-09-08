import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '../utils/api';
import AuthGuard from '../components/AuthGuard';

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
      const newOrder = await apiFetch('/orders/from-cart', {
        method: 'POST',
        body: JSON.stringify({ address }),
      });
      // Redirect to a success page with the new order ID
      router.push(`/orders/${newOrder._id}/success`);
    } catch (err) {
      setError(err.message);
      alert(`Failed to place order: ${err.message}`);
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
    <div className='checkout-container'>
      <h1>Checkout</h1>
      <div className='checkout-layout'>
        <div className='checkout-form-section'>
          <h2>Shipping Information</h2>
          <form onSubmit={handlePlaceOrder}>
            <div className='form-group'>
              <label htmlFor='address'>Shipping Address</label>
              <textarea
                id='address'
                className='form-input'
                rows='4'
                placeholder='Enter your full shipping address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button
              type='submit'
              className='form-button'
              disabled={isPlacingOrder || !cart}
            >
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className='checkout-summary-section'>
          <h2>Order Summary</h2>
          {cart && (
            <>
              <ul className='checkout-items-list'>
                {cart.items.map((item) => (
                  <li key={item.product._id} className='checkout-item'>
                    <span className='item-name'>
                      {item.product.name} (x{item.quantity})
                    </span>
                    <span className='item-price'>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className='checkout-total'>
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
