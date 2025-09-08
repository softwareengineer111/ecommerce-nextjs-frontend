import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../utils/api';
import AdminGuard from '../../components/AdminGuard';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/products');
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await apiFetch(`/products/${productId}`, { method: 'DELETE' });
        fetchProducts(); // Refresh the list
      } catch (err) {
        alert(`Error deleting product: ${err.message}`);
      }
    }
  };

  return (
    <div>
      <div className='page-header'>
        <h1>Manage Products</h1>
        <Link href='/admin/add-product' className='form-button'>
          + Add New Product
        </Link>
      </div>

      {/* Products List */}
      {isLoading && <div className='loading-spinner'></div>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!isLoading && !error && (
        <ul className='product-list-admin'>
          {products.length === 0 && (
            <p>No products found. Add one to get started!</p>
          )}
          {products.map((product) => (
            <li key={product._id} className='product-item-admin'>
              <img
                src={
                  (product.images && product.images[0]?.url) ||
                  'https://via.placeholder.com/150'
                }
                alt={product.name}
                className='product-image-admin'
              />
              <div className='product-info-admin'>
                <h3>{product.name}</h3>
                <p className='product-price'>${product.price}</p>
              </div>
              <div className='product-actions-admin'>
                <Link
                  href={`/products/${product._id}/edit`}
                  className='action-button edit'
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className='action-button delete'
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function GuardedProductsPage() {
  return (
    <AdminGuard>
      <ProductsPage />
    </AdminGuard>
  );
}
