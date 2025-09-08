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
  const canAddProducts = user && ['super admin', 'manager'].includes(user.role);

  return (
    <nav className='navbar'>
      <div className='container'>
        <Link href='/' className='nav-brand'>
          eCommerce
        </Link>
        <div className='nav-links'>
          {user ? (
            <>
              {canAddProducts && (
                <Link href='/add-product' className='nav-link'>
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
