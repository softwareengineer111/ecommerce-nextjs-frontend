import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getUserFromToken } from '../utils/api';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // On route change, get user data from token
    const userData = getUserFromToken();
    setUser(userData);
  }, [router.asPath]); // Re-check on every navigation

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Use window.location to force a full page reload, clearing all state
    window.location.href = '/login';
  };

  // Determine if the user has a role that can add products
  const canAddProducts =
    user && ['superadmin', 'shop manager'].includes(user.role);
  const isSuperAdmin = user && user.role === 'superadmin';

  return (
    <nav className='navbar'>
      <div className='container'>
        <Link href='/' className='nav-brand'>
          eCommerce
        </Link>
        <div className='nav-links'>
          {user ? (
            <>
              {isSuperAdmin && (
                <>
                  <Link href='/admin/dashboard' className='nav-link'>
                    Dashboard
                  </Link>
                  <Link href='/admin/categories' className='nav-link'>
                    Categories Manage Categories
                  </Link>
                </>
              )}
              {canAddProducts && (
                <Link href='/admin/add-product' className='nav-link'>
                  Add Product
                </Link>
              )}
              <button onClick={handleLogout} className='nav-button'>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href='/login' className='nav-link'>
                Login
              </Link>
              <Link href='/register' className='nav-link'>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
