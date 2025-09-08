import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch, getUserFromToken } from '../utils/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const fetchProducts = () => {
    apiFetch('/products')
      .then(setProducts)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setUser(getUserFromToken());
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await apiFetch(`/products/${productId}`, { method: 'DELETE' });
      alert('Product deleted.');
      fetchProducts(); // Refresh list
    }
  };

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
                <Link
                  href={`products/${p._id}/detail`}
                  className='product-card-link'
                >
                  {p.images && p.images.length > 0 && (
                    <img
                      src={p.images[0].url}
                      alt={p.name}
                      className='product-image'
                    />
                  )}
                  <h3>{p.name}</h3>
                  <p>{p.description || 'No description available.'}</p>
                  <p className='product-price'>${p.price}</p>
                </Link>
                {user && ['superadmin', 'shop manager'].includes(user.role) && (
                  <div className='admin-actions'>
                    <Link
                      href={`/products/${p._id}/edit`}
                      className='action-button edit'
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className='action-button delete'
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
