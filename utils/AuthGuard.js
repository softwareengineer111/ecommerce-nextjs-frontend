import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUserFromToken } from '../utils/api';

/**
 * A component to wrap protected routes.
 * It checks for a user token and redirects to the login page if not found.
 * If allowedRoles are provided, it also checks if the user has the required role.
 * @param {object} props
 * @param {React.ReactNode} props.children The component to render if authenticated.
 * @param {string[]} [props.allowedRoles] - Optional array of roles that are allowed to access the route.
 */
const AuthGuard = ({ children, allowedRoles }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = getUserFromToken();

    if (!user) {
      // Not logged in, redirect to login page.
      router.push('/login');
      return;
    }

    // If roles are required, check if the user has one of the allowed roles.
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // User is logged in but not authorized for this page.
      alert('You are not authorized to view this page.'); // Simple feedback
      router.push('/'); // Redirect to a safe page like home.
      return;
    }

    // If we reach here, the user is authenticated and authorized.
    setIsAuthorized(true);
  }, [router, allowedRoles]);

  if (!isAuthorized) {
    // Show a loader from globals.css while checking authorization.
    return <div className='loading-spinner'></div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
