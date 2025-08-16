import { useCookie } from '#app'

export const logInData = async (email: string, password: string) => {
  try {
    const response = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data?.access_token) {
      const token = useCookie('token', {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
      token.value = data.access_token;

      return {
        token: data.access_token,
        error: null,
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      token: null,
    };
  }
};
