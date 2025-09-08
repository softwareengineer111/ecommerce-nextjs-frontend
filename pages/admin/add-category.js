import { useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '../../utils/api';
import AdminGuard from '../../components/AdminGuard';

const AddCategoryPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await apiFetch('/categories', {
        method: 'POST',
        body: JSON.stringify({ name, description }),
      });
      alert('Category added successfully!');
      router.push('/admin/categories'); // Redirect to the list of categories
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='form-container'>
      <h1>Add New Category</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='category-name'>Name</label>
          <input
            id='category-name'
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='form-input'
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='category-desc'>Description (Optional)</label>
          <textarea
            id='category-desc'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows='3'
            className='form-input'
          ></textarea>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type='submit' className='form-button' disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Category'}
        </button>
      </form>
    </div>
  );
};

export default function GuardedAddCategoryPage() {
  return (
    <AdminGuard>
      <AddCategoryPage />
    </AdminGuard>
  );
}
