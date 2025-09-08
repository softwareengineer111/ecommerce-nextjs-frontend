// export const API_URL = 'https://ecommerce-backend-hazel-alpha.vercel.app/api';
export const API_URL = 'http://localhost:5000/api';

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) {
    return null;
  }
  try {
    // Decode the token payload. The payload is the middle part of the token.
    // It's Base64-encoded JSON.
    const payload = JSON.parse(atob(token.split('.')[1])); // e.g., { user: { id, role, name }, iat, exp }

    // Check if the token has expired. `exp` is in seconds, Date.now() is in ms.
    if (payload.exp * 1000 < Date.now()) {
      console.error('Token has expired.');
      localStorage.removeItem('token'); // Clean up the expired token
      return null;
    }

    // If the payload has a nested 'user' object, return that.
    // This makes the rest of the app simpler, allowing `user.role`, `user.id`, etc.
    if (payload.user) {
      return payload.user;
    }
    return payload; // Fallback for tokens with a flat structure
  } catch (e) {
    console.error('Invalid token:', e);
    return null;
  }
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // If body is FormData, let the browser set the Content-Type header
  // which will include the necessary boundary.
  if (options.body instanceof FormData) {
    delete defaultHeaders['Content-Type'];
  }

  const headers = { ...defaultHeaders, ...options.headers };

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // If the response is not OK (e.g., 404, 500), we want to throw an error.
    if (!res.ok) {
      // Try to get a meaningful error message from the response body
      const errorData = await res.json().catch(() => ({})); // Gracefully handle non-JSON error responses
      throw new Error(
        errorData.message ||
          errorData.msg ||
          `Request failed with status ${res.status}`
      );
    }

    // If the response is OK, parse and return the JSON body.
    return res.json();
  } catch (error) {
    // This will catch network errors or errors thrown from the !res.ok check.
    console.error('API Fetch Error:', error);
    throw error; // Re-throw the error so the calling component can handle it
  }
};
