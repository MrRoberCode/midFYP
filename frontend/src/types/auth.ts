export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface AuthError {
  message: string[];
  error: string;
  statusCode: number;
}
