import { useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '../utils/api';
import AuthGuard from '../utils/AuthGuard';

function AddProduct() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      // Append form fields
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      // Append files (your backend expects the field name 'images')
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const res = await apiFetch('/products', {
        method: 'POST',
        body: formData, // Pass FormData directly
      });

      if (res._id) {
        alert('Product added successfully!');
        router.push('/');
      } else {
        throw new Error(res.message || 'Failed to add product.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='form-container'>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='name'>Product Name</label>
          <input
            id='name'
            className='form-input'
            placeholder='Name'
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='description'>Description</label>
          <input
            id='description'
            className='form-input'
            placeholder='Description'
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='price'>Price</label>
          <input
            id='price'
            type='number'
            className='form-input'
            placeholder='Price'
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='stock'>Stock</label>
          <input
            id='stock'
            type='number'
            className='form-input'
            placeholder='Stock'
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='images'>Product Images (up to 5)</label>
          <input
            id='images'
            type='file'
            className='form-input'
            multiple
            accept='image/*'
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type='submit' className='form-button' disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

export default function GuardedAddProduct() {
  return (
    <AuthGuard allowedRoles={['superadmin', 'shop manager']}>
      <AddProduct />
    </AuthGuard>
  );
}
