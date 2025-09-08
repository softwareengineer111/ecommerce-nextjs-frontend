import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getToken } from '../utils/api';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, [router.asPath]); // Re-check login status on route change

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Use window.location to force a full page reload, clearing all state
    window.location.href = '/login';
  };

  return (
    <nav className='navbar'>
      <div className='container'>
        <Link href='/' className='nav-brand'>
          eCommerce
        </Link>
        <div className='nav-links'>
          {isLoggedIn ? (
            <>
              <Link href='/add-product' className='nav-link'>
                Add Product
              </Link>
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
