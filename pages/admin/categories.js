import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../utils/api';
import AdminGuard from '../../components/AdminGuard';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for inline editing
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingCategoryDesc, setEditingCategoryDesc] = useState('');

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch('/categories');
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await apiFetch(`/categories/${categoryId}`, { method: 'DELETE' });
        fetchCategories(); // Refresh the list
      } catch (err) {
        alert(`Error deleting category: ${err.message}`);
      }
    }
  };

  const startEditing = (category) => {
    setEditingCategoryId(category._id);
    setEditingCategoryName(category.name);
    setEditingCategoryDesc(category.description || '');
  };

  const cancelEditing = () => {
    setEditingCategoryId(null);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/categories/${editingCategoryId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editingCategoryName,
          description: editingCategoryDesc,
        }),
      });
      cancelEditing();
      fetchCategories();
    } catch (err) {
      alert(`Error updating category: ${err.message}`);
    }
  };

  return (
    <div>
      <div className='page-header'>
        <h1>Manage Categories</h1>
        <Link href='/admin/add-category' className='form-button'>
          + Add New
        </Link>
      </div>

      {/* Categories List */}
      {isLoading && <div className='loading-spinner'></div>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!isLoading && !error && (
        <ul className='category-list'>
          {categories.length === 0 && (
            <p>No categories found. Add one above!</p>
          )}
          {categories.map((category) => (
            <li key={category._id} className='category-item'>
              {editingCategoryId === category._id ? (
                <form onSubmit={handleUpdateCategory} className='edit-form'>
                  <div className='form-group'>
                    <input
                      type='text'
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      className='form-input'
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <textarea
                      value={editingCategoryDesc}
                      onChange={(e) => setEditingCategoryDesc(e.target.value)}
                      rows='2'
                      className='form-input'
                    ></textarea>
                  </div>
                  <div className='category-actions'>
                    <button type='submit' className='action-button edit'>
                      Save
                    </button>
                    <button
                      type='button'
                      onClick={cancelEditing}
                      className='action-button delete'
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className='category-info'>
                    <h3>{category.name}</h3>
                    <p>{category.description || 'No description'}</p>
                  </div>
                  <div className='category-actions'>
                    <button
                      onClick={() => startEditing(category)}
                      className='action-button edit'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className='action-button delete'
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function GuardedCategoriesPage() {
  return (
    <AdminGuard>
      <CategoriesPage />
    </AdminGuard>
  );
}
