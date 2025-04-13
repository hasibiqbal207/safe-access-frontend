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
  sessions: SessionType[];
};

export type mfaType = {
  message: string;
  secret: string;
  qrImageUrl: string;
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

export const logoutMutationFn = async () => await API.post(`/auth/logout`);

export const logoutAllMutationFn = async () => await API.post(`/auth/logout-all`);

export const refreshTokenMutationFn = async () => await API.post(`/auth/refresh`);

{/* Password  Management API's */}
export const forgotPasswordMutationFn = async (data: forgotPasswordType) =>
  await API.post(`/auth/password/forgot`, data);

export const resetPasswordMutationFn = async (data: resetPasswordType) =>
  await API.post(`/auth/password/reset`, data);

export const changePasswordMutationFn = async (data: changePasswordType) =>
  await API.put(`/auth/password/change`, data);

{/* MFA API's */}
export const mfaSetupQueryFn = async () => {
  const response = await API.get<mfaType>(`auth/mfa/setup`);
  return response.data;
};

export const enableMFAMutationFn = async (data: enableMFAType) => await API.put(`/auth/mfa/enable`, data);

export const disableMFAMutationFn = async (data: disableMFAType) => await API.put(`/auth/mfa/disable`, data);

export const verifyMFALoginMutationFn = async (data: mfaLoginType) =>
  await API.post(`/auth/mfa/verify`, data);

export const generateBackupCodesMutationFn = async () =>
  await API.post(`/auth/mfa/generate-backup-codes`);

{/* Session API's */}
export const getUserSessionQueryFn = async () => await API.get(`/auth/session/`);

export const sessionsQueryFn = async () => {
  const response = await API.get<SessionResponseType>(`/auth/sessions/`);
  return response.data;
};

export const sessionDelMutationFn = async (id: string) =>
  await API.delete(`/auth/sessions/${id}`);

export const sessionDelAllMutationFn = async () =>
  await API.delete(`/auth/sessions/all`);

{/* User API's */}
export const getUserQueryFn = async () => await API.get(`/users/profile`);

export const updateUserMutationFn = async (data: updateUserType) =>
  await API.put(`/users/profile`, data);

export const changeUserEmailMutationFn = async (data: changeUserEmailType) =>
  await API.put(`/users/change-email`, data);

export const deleteUserMutationFn = async (id: string) =>
  await API.delete(`/users/delete/${id}`);

