import API from "./axios-client";

type forgotPasswordType = { email: string };
type resetPasswordType = { token: string; newPassword: string };
type changePasswordType = { currentPassword: string; newPassword: string; confirmPassword: string };

type LoginType = {
  email: string;
  password: string;
};

type registerType = {
  firstName: string;
  lastName: string;
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

type deleteUserType = {
  userId: string;
  password: string;
};

type verifyEmailType = { code: string };
type enableMFAType = { token: string };
type disableMFAType = { password: string };
type mfaLoginType = { token: string };

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
  qrCodeUrl: string;
};

const getAccessToken = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return token;
};

const getRefreshToken = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
  return token;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

{/* Authentication API's */ }
export const registerMutationFn = async (data: registerType) =>
  await API.post(`/auth/register`, data);

export const verifyEmailMutationFn = async (data: verifyEmailType) =>
  await API.post(`/auth/verify-email`, data);

export const resendVerificationEmailMutationFn = async () =>
  await API.post(`/auth/resend-verification`);

export const loginMutationFn = async (data: LoginType) =>
  await API.post("/auth/login", data);

export const logoutMutationFn = async () =>
  await API.post(`/auth/logout`, { refreshToken: getRefreshToken() }, { headers: getAuthHeaders() });

export const logoutAllMutationFn = async () =>
  await API.post(`/auth/logout-all`, {}, { headers: getAuthHeaders() });

export const refreshTokenMutationFn = async () => await API.post(`/auth/refresh`);

{/* Password  Management API's */ }
export const forgotPasswordMutationFn = async (data: forgotPasswordType) =>
  await API.post(`/auth/password/forgot`, data);

export const resetPasswordMutationFn = async (data: resetPasswordType) =>
  await API.post(`/auth/password/reset`, data);

export const changePasswordMutationFn = async (data: changePasswordType) =>
  await API.put(`/auth/password/change`, data, { headers: getAuthHeaders() });

{/* MFA API's */ }
export const mfaSetupQueryFn = async () => {
  try {
    const response = await API.get<mfaType>(`/auth/mfa/setup`, { headers: getAuthHeaders() });
    console.log('MFA setup response:', response.data);
    // If the response is nested, extract the data field
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      console.log('API response contains nested data, extracting...');
      return response.data.data as mfaType;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching MFA setup:', error);
    throw error;
  }
};

export const enableMFAMutationFn = async (data: enableMFAType) => {
  return await API.post(`/auth/mfa/enable`, data, { headers: getAuthHeaders() });
};

export const disableMFAMutationFn = async (data: disableMFAType) =>
  await API.post(`/auth/mfa/disable`, data, { headers: getAuthHeaders() });

export const revokeMFAMutationFn = async () =>
  await API.post(`/auth/mfa/disable`, { password: '' }, { headers: getAuthHeaders() });

export const verifyMFALoginMutationFn = async (
  data: mfaLoginType,
  intermediateToken?: string
) => {
  const headers = intermediateToken
    ? { Authorization: `Bearer ${intermediateToken}` }
    : {};

  return await API.post(`/auth/mfa/verify`, data, { headers });
};

export const generateBackupCodesMutationFn = async () =>
  await API.post(`/auth/mfa/generate-backup-codes`, {}, { headers: getAuthHeaders() });

{/* Session API's */ }
export const getUserSessionQueryFn = async () => {
  const response = await API.get(`/auth/sessions/`, { headers: getAuthHeaders() });
  return response.data;
};

export const sessionsQueryFn = async () => {
  const response = await API.get<SessionResponseType>(`/auth/sessions/all`, { headers: getAuthHeaders() });
  return response.data.data;
};

export const sessionDelMutationFn = async (id: string) =>
  await API.delete(`/auth/sessions/${id}`, { headers: getAuthHeaders() });

export const sessionDelAllMutationFn = async () =>
  await API.delete(`/auth/sessions/all`, { headers: getAuthHeaders() });

{/* User API's */ }
export const getUserQueryFn = async () =>
  await API.get(`/users/profile`, { headers: getAuthHeaders() });

export const updateUserMutationFn = async (data: updateUserType) =>
  await API.put(`/users/profile`, data, { headers: getAuthHeaders() });

export const changeUserEmailMutationFn = async (data: changeUserEmailType) =>
  await API.put(`/users/change-email`, data, { headers: getAuthHeaders() });

export const deleteUserMutationFn = async (data: deleteUserType) =>
  await API.delete(`/users/delete/${data.userId}`, {
    headers: getAuthHeaders(),
    data: { password: data.password }
  });

