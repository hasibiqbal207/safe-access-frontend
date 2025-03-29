interface IUser {
  // ... existing fields ...
  passwordHistory: {
    hash: string;
    createdAt: Date;
  }[];
  requirePasswordChange: boolean;
  lastPasswordChange: Date;
  lastPasswordReset: Date;
} 