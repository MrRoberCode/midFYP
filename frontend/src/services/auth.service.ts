import api from './api';
import { AuthResponse } from '../types/auth';

export const authService = {
  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', {
      name,
      email,
      password,
    });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
};
