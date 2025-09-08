import { useEffect, useState } from 'react';
import { apiFetch, getToken } from '../utils/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token to determine login status
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      // Only fetch products if the user is logged in
      apiFetch('/products')
        .then(setProducts)
        .finally(() => setIsLoading(false));
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  }, []);

  return (
    <div>
      <h1>Welcome to our Store</h1>
      {isLoading ? (
        <div className='loading-spinner'></div>
      ) : isLoggedIn ? (
        <>
          <h2>Our Products</h2>
          <ul className='product-grid'>
            {products.map((p) => (
              <li key={p._id} className='product-card'>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <p className='product-price'>${p.price}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className='text-center'>Please log in to view our products.</p>
      )}
    </div>
  );
}
