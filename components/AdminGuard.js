import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUserFromToken } from '../utils/api';

/**
 * A component to wrap admin-only routes.
 * It checks for a user token and an admin role, redirecting if unauthorized.
 * @param {object} props
 * @param {React.ReactNode} props.children The component to render if authorized.
 */
const AdminGuard = ({ children }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = getUserFromToken();
    // Check if user exists and has a role of 'superadmin'
    if (user && user.role === 'superadmin') {
      setIsAuthorized(true);
    } else {
      // If not authorized, redirect to the login page
      router.push('/login');
    }
  }, [router]);

  if (!isAuthorized) {
    // Show a loading spinner while checking authorization
    return <div className='loading-spinner'></div>;
  }

  return <>{children}</>;
};

export default AdminGuard;
