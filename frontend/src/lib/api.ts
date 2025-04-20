import API from "./axios-client";

type forgotPasswordType = { email: string };
type resetPasswordType = { token: string; newPassword: string };
type changePasswordType = { currentPassword: string; newPassword: string; confirmPassword: string };

type LoginType = {
  email: string;
  password: string;
};

type registerType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type updateUserType = {
  firstName: string;
  lastName: string;
};

type changeUserEmailType = {
  new_email: string;
};

type verifyEmailType = { code: string };
type enableMFAType = { secretKey: string };
type disableMFAType = { secretKey: string };
type mfaLoginType = { code: string; email: string };

type SessionType = {
  _id: string;
  userId: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
};

type SessionResponseType = {
  message: string;
  data: {
    sessions: SessionType[];
  };
};

export type mfaType = {
  message: string;
  secret: string;
  qrImageUrl: string;
};

const getAccessToken = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return token ? `Bearer ${token}` : '';
}; 

const getRefreshToken = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
  return token;
};

// Helper function for authenticated API calls
const withAuth = async <T>(apiCall: () => Promise<T>): Promise<T> => {
  const token = getAccessToken();
  if (token) {
    API.defaults.headers.common['Authorization'] = token;
  }
  try {
    return await apiCall();
  } finally {
    // Clean up to prevent token leaking to non-auth requests
    if (API.defaults.headers.common['Authorization']) {
      delete API.defaults.headers.common['Authorization'];
    }
  }
};

{/* Authentication API's */}
export const registerMutationFn = async (data: registerType) =>
  await API.post(`/auth/register`, data);

export const verifyEmailMutationFn = async (data: verifyEmailType) =>
  await API.post(`/auth/verify-email`, data);

export const resendVerificationEmailMutationFn = async () =>
  await API.post(`/auth/resend-verification`);

export const loginMutationFn = async (data: LoginType) =>
  await API.post("/auth/login", data);

export const logoutMutationFn = async () => 
  await withAuth(() => API.post(`/auth/logout`, { refreshToken: getRefreshToken() }));

export const logoutAllMutationFn = async () => 
  await withAuth(() => API.post(`/auth/logout-all`));

export const refreshTokenMutationFn = async () => await API.post(`/auth/refresh`);

{/* Password  Management API's */}
export const forgotPasswordMutationFn = async (data: forgotPasswordType) =>
  await API.post(`/auth/password/forgot`, data);

export const resetPasswordMutationFn = async (data: resetPasswordType) =>
  await API.post(`/auth/password/reset`, data);

export const changePasswordMutationFn = async (data: changePasswordType) =>
  await withAuth(() => API.put(`/auth/password/change`, data));

{/* MFA API's */}
export const mfaSetupQueryFn = async () => {
  const response = await withAuth(() => API.get<mfaType>(`auth/mfa/setup`));
  return response.data;
};

export const enableMFAMutationFn = async (data: enableMFAType) => 
  await withAuth(() => API.put(`/auth/mfa/enable`, data));

export const disableMFAMutationFn = async (data: disableMFAType) => 
  await withAuth(() => API.put(`/auth/mfa/disable`, data));

export const verifyMFALoginMutationFn = async (data: mfaLoginType) =>
  await API.post(`/auth/mfa/verify`, data);

export const generateBackupCodesMutationFn = async () =>
  await withAuth(() => API.post(`/auth/mfa/generate-backup-codes`));

{/* Session API's */}
export const getUserSessionQueryFn = async () => {
  const response = await withAuth(() => API.get(`/auth/sessions/`));
  return response.data;
};

export const sessionsQueryFn = async () => {
  const response = await withAuth(() => API.get<SessionResponseType>(`/auth/sessions/all`));
  return response.data.data;
};

export const sessionDelMutationFn = async (id: string) =>
  await withAuth(() => API.delete(`/auth/sessions/${id}`));

export const sessionDelAllMutationFn = async () =>
  await withAuth(() => API.delete(`/auth/sessions/all`));

{/* User API's */}
export const getUserQueryFn = async () => 
  await withAuth(() => API.get(`/users/profile`));

export const updateUserMutationFn = async (data: updateUserType) =>
  await withAuth(() => API.put(`/users/profile`, data));

export const changeUserEmailMutationFn = async (data: changeUserEmailType) =>
  await withAuth(() => API.put(`/users/change-email`, data));

export const deleteUserMutationFn = async (id: string) =>
  await withAuth(() => API.delete(`/users/delete/${id}`));

