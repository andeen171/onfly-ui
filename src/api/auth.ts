import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';

export type AuthRequest = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type AuthResponse = {
  token: string;
};

export async function login({
  email,
  password,
}: Partial<AuthRequest>): Promise<void> {
  try {
    const response: AxiosResponse<AuthResponse> = await api.post('/login', {
      email,
      password,
    });

    // Save the token in localStorage
    localStorage.setItem('userToken', response.data.token);
  } catch (error) {
    throw error;
  }
}

export async function register(userObj: AuthRequest) {
  try {
    const response = await api.post('/register', userObj);
    // Save the token in localStorage
    localStorage.setItem('userToken', response.data.token);
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    await api.post('/logout');
    // Remove the token from localStorage
    localStorage.removeItem('userToken');
  } catch (error) {
    throw error;
  }
}
