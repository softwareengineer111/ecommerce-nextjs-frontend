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
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const res = await apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    setIsLoading(false);

    if (res._id) {
      alert('Product added successfully!');
      router.push('/');
    } else {
      setError(res.message || 'Failed to add product.');
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
