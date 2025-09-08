import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { apiFetch, getUserFromToken } from '../../../utils/api';

function ProductDetail() {
  const router = useRouter();
  const { id } = router.query; // Get the product ID from the URL

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setUser(getUserFromToken());
    // Ensure the router is ready and the id is available
    if (!router.isReady || !id) {
      return;
    }

    setIsLoading(true);
    setError('');

    apiFetch(`/products/${id}`)
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router.isReady, id]); // Rerun effect when router is ready or id changes

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      router.push('/login');
      return;
    }

    setIsAddingToCart(true);
    try {
      // Assuming the backend endpoint is `/cart` and it handles adding items
      await apiFetch('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId: product._id, quantity }),
      });
      alert(`${quantity} x ${product.name} has been added to your cart.`);
    } catch (err) {
      setError(err.message);
      alert(`Failed to add to cart: ${err.message}`);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return <div className='loading-spinner'></div>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className='product-detail-container'>
      <h1>{product.name}</h1>
      <div className='product-detail-layout'>
        <div className='product-images'>
          {product.images?.map((img) => (
            <img
              key={img._id || img.url}
              src={img.url}
              alt={product.name}
              className='product-detail-image'
            />
          ))}
        </div>
        <div className='product-info'>
          <p className='product-price'>${product.price}</p>
          <p>{product.description || 'No description available.'}</p>
          <p>Stock: {product.stock}</p>
          <div className='quantity-selector'>
            <label htmlFor='quantity'>Quantity:</label>
            <input
              id='quantity'
              type='number'
              className='form-input'
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min='1'
              max={product.stock}
              disabled={product.stock === 0}
            />
          </div>
          <button
            onClick={handleAddToCart}
            className='form-button'
            disabled={isAddingToCart || product.stock === 0}
          >
            {isAddingToCart
              ? 'Adding...'
              : product.stock === 0
              ? 'Out of Stock'
              : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
