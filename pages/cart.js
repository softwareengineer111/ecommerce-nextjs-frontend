import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../utils/api';
import AuthGuard from '../components/AuthGuard';

function CartPage() {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    apiFetch('/cart')
      .then((data) => {
        setCart(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  if (isLoading) {
    return <div className='loading-spinner'></div>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error fetching cart: {error}</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className='empty-cart'>
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link href='/' className='form-button'>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className='cart-container'>
      <h1>Your Shopping Cart</h1>
      <div className='cart-layout'>
        <div className='cart-items-list'>
          {cart.items.map((item) => (
            <div key={item.product._id} className='cart-item'>
              <img
                src={item.product.images[0]?.url || '/placeholder.png'}
                alt={item.product.name}
                className='cart-item-image'
              />
              <div className='cart-item-details'>
                <h3>{item.product.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.product.price.toFixed(2)}</p>
              </div>
              <div className='cart-item-subtotal'>
                <p>
                  Subtotal: ${(item.quantity * item.product.price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className='cart-summary'>
          <h2>Cart Summary</h2>
          <div className='cart-total'>
            <p>Total:</p>
            <p>${calculateTotal().toFixed(2)}</p>
          </div>
          <button className='form-button checkout-button'>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

// Wrap the page with the AuthGuard to protect it
const GuardedCartPage = () => (
  <AuthGuard>
    <CartPage />
  </AuthGuard>
);

export default GuardedCartPage;
