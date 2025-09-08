import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '../../../utils/api';
import AuthGuard from '../../../utils/AuthGuard';

function EditProduct() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });
  const [currentImages, setCurrentImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch product data on component mount
  useEffect(() => {
    if (!router.isReady || !id) return;

    setIsLoading(true);
    apiFetch(`/products/${id}`)
      .then((product) => {
        setForm({
          name: product.name,
          description: product.description || '',
          price: product.price,
          stock: product.stock,
        });
        setCurrentImages(product.images || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router.isReady, id]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewFiles(e.target.files);
  };

  const markImageForDeletion = (imageId) => {
    // Add image ID to the deletion list
    setImagesToDelete([...imagesToDelete, imageId]);
    // Remove the image from the current view for better UX
    setCurrentImages(currentImages.filter((img) => img._id !== imageId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new FormData();

      // Append text form fields
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      // Append new image files
      for (let i = 0; i < newFiles.length; i++) {
        formData.append('images', newFiles[i]);
      }

      // Append the array of image IDs to delete
      if (imagesToDelete.length > 0) {
        // Your backend expects this field in the request body
        formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }

      const res = await apiFetch(`/products/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (res._id) {
        alert('Product updated successfully!');
        router.push(`/products/${res._id}`); // Navigate to the updated product page
      } else {
        throw new Error(res.message || 'Failed to update product.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !form.name) {
    return <div className='loading-spinner'></div>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div className='form-container'>
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='name'>Product Name</label>
          <input
            id='name'
            name='name'
            className='form-input'
            value={form.name}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='description'>Description</label>
          <input
            id='description'
            name='description'
            className='form-input'
            value={form.description}
            onChange={handleFormChange}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='price'>Price</label>
          <input
            id='price'
            name='price'
            type='number'
            className='form-input'
            value={form.price}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='stock'>Stock</label>
          <input
            id='stock'
            name='stock'
            type='number'
            className='form-input'
            value={form.stock}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className='form-group'>
          <label>Current Images</label>
          <div className='current-images-grid'>
            {currentImages.map((img) => (
              <div key={img._id} className='current-image-item'>
                <img src={img.url} alt='product' />
                <button
                  type='button'
                  onClick={() => markImageForDeletion(img._id)}
                  className='delete-image-btn'
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className='form-group'>
          <label htmlFor='images'>Add New Images</label>
          <input
            id='images'
            type='file'
            className='form-input'
            multiple
            accept='image/*'
            onChange={handleFileChange}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type='submit' className='form-button' disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
}

export default function GuardedEditProduct() {
  return (
    <AuthGuard allowedRoles={['superadmin', 'shop manager']}>
      <EditProduct />
    </AuthGuard>
  );
}
