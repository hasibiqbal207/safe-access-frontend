export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: string;
  };
}

export interface AuthResponse extends ApiResponse {
  data?: {
    accessToken?: string;
    refreshToken?: string;
    user?: {
      id: string;
      firstName: string,
      lastName: string,
      email: string;
      emailVerified: boolean;
      is2FAEnabled: boolean;
      role: string;
    };
    requires2FA?: boolean;
  };
}

export interface ProfileResponse extends ApiResponse {
  data?: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    is2FAEnabled: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
} 