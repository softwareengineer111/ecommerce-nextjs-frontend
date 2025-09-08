import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch products for all users
    apiFetch('/products')
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1>Welcome to our Store</h1>
      {isLoading ? (
        <div className='loading-spinner'></div>
      ) : (
        <>
          <h2>Our Products</h2>
          <ul className='product-grid'>
            {products.map((p) => (
              <li key={p._id} className='product-card'>
                <h3>{p.name}</h3>
                <p>{p.description || 'No description available.'}</p>
                <p className='product-price'>${p.price}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
