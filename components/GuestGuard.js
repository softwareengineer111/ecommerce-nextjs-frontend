import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getToken } from '../utils/api';

/**
 * A component to wrap guest-only routes (like login/register).
 * It checks for a user token and redirects to the home page if found.
 * @param {object} props
 * @param {React.ReactNode} props.children The component to render if not authenticated.
 */
const GuestGuard = ({ children }) => {
  const router = useRouter();
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      // If user is logged in, redirect them away to the home page.
      router.push('/');
    } else {
      // User is not logged in, allow rendering the children.
      setIsGuest(true);
    }
  }, [router]);

  if (!isGuest) {
    // Use the consistent loading spinner while checking auth status
    return <div className='loading-spinner'></div>;
  }

  return <>{children}</>;
};

export default GuestGuard;
