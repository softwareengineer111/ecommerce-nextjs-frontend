import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../utils/api';

function ProductDetail() {
  const router = useRouter();
  const { id } = router.query; // Get the product ID from the URL

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

  if (isLoading) {
    return <div className='loading-spinner'></div>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Алдаа: {error}</p>;
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
          <p>{product.description || 'Тайлбар байхгүй.'}</p>
          <p>Үлдэгдэл: {product.stock}</p>
          <button className='form-button'>Сагсанд нэмэх</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
