import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUserFromToken } from '../utils/api';

/**
 * A component to wrap routes that require authentication.
 * It checks for a user token and redirects to the login page if not found.
 * @param {object} props
 * @param {React.ReactNode} props.children The component to render if authorized.
 */
const AuthGuard = ({ children }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      setIsAuthorized(true);
    } else {
      router.push('/login');
    }
  }, [router]);

  // Show a loading spinner while checking authorization
  return isAuthorized ? (
    <>{children}</>
  ) : (
    <div className='loading-spinner'></div>
  );
};

export default AuthGuard;
