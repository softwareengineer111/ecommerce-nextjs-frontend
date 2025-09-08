import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import AdminGuard from '../../components/AdminGuard';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Assuming an endpoint /api/users exists for admins
      const data = await apiFetch('/users');
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this user? This action cannot be undone.'
      )
    ) {
      try {
        await apiFetch(`/users/${userId}`, { method: 'DELETE' });
        fetchUsers(); // Refresh the list
      } catch (err) {
        alert(`Error deleting user: ${err.message}`);
      }
    }
  };

  return (
    <div>
      <div className='page-header'>
        <h1>Manage Users</h1>
      </div>

      {isLoading && <div className='loading-spinner'></div>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!isLoading && !error && (
        <ul className='user-list'>
          {users.length === 0 && <p>No users found.</p>}
          {users.map((user) => (
            <li key={user._id} className='user-item'>
              <div className='user-info'>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <span className='user-role'>{user.role}</span>
              </div>
              <div className='user-actions'>
                <button
                  onClick={() => handleDeleteUser(user._id)}
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

export default function GuardedUsersPage() {
  return (
    <AdminGuard>
      <UsersPage />
    </AdminGuard>
  );
}
