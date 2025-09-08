import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getToken } from '../utils/api';

/**
 * A component to wrap protected routes.
 * It checks for a user token and redirects to the login page if not found.
 * @param {object} props
 * @param {React.ReactNode} props.children The component to render if authenticated.
 */
const AuthGuard = ({ children }) => {
  const router = useRouter();
  // Using state to prevent content flashing before redirect.
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      // Redirect to login page if no token is found.
      router.push('/login');
    } else {
      // If token exists, allow rendering the children.
      // For better security, you could verify the token with your backend here.
      setIsAuth(true);
    }
  }, [router]);

  // While checking for auth, you can show a loader to prevent flashing content.
  if (!isAuth) {
    return <div>Loading...</div>; // Or a custom spinner component
  }

  // If authenticated, render the protected component.
  return <>{children}</>;
};

export default AuthGuard;
