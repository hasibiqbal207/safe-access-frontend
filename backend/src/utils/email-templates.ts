/**
 * Email Templates
 * 
 * This file contains all email templates used in the application.
 * Each template has both HTML and plain text versions for maximum compatibility.
 */

/**
 * Generate an email verification template
 * @param firstName User's first name
 * @param verificationUrl The URL to verify the email address
 * @returns Object containing HTML and text content
 */
export const getEmailVerificationTemplate = (
  firstName: string,
  verificationUrl: string
) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify Your Email Address</h2>
      <p>Hello ${firstName},</p>
      <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; font-weight: bold;">Verify Email</a>
      </div>
      <p>Or copy and paste this link in your browser:</p>
      <p>${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not create an account, you can safely ignore this email.</p>
      <p>Best regards,<br>The Authentication Team</p>
    </div>
  `;

  const textContent = `
Hello ${firstName},

Thank you for registering! Please verify your email address by clicking the link below:

${verificationUrl}

This link will expire in 24 hours.

If you did not create an account, you can safely ignore this email.

Best regards,
The Authentication Team
  `;

  return { html: htmlContent, text: textContent };
};

/**
 * Generate a password reset request template
 * @param resetUrl The URL to reset the password
 * @param ipAddress IP address from which the request originated
 * @returns Object containing HTML and text content
 */
export const getPasswordResetTemplate = (
  resetUrl: string,
  ipAddress: string
) => {
  const htmlContent = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h2>Password Reset Request</h2>
      <p>A password reset was requested for your account.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4285F4; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; font-weight: bold;">Reset Password</a>
      </div>
      <p>Or copy and paste this link in your browser:</p>
      <p>${resetUrl}</p>
      <p>This link expires in 30 minutes.</p>
      <p>If you didn't request this, please ignore this email and make sure you can still login to your account.</p>
      <p style="color: #666; font-size: 12px;">
        IP Address of request: ${ipAddress}<br>
        Time of request: ${new Date().toUTCString()}
      </p>
    </div>
  `;

  const textContent = `
Password Reset Request

A password reset was requested for your account.

To reset your password, click: ${resetUrl}

This link expires in 30 minutes.

If you didn't request this, please ignore this email and make sure you can still login to your account.

IP Address of request: ${ipAddress}
Time of request: ${new Date().toUTCString()}
  `;

  return { html: htmlContent, text: textContent };
};

/**
 * Generate a password changed notification template
 * @returns Object containing HTML and text content
 */
export const getPasswordChangedTemplate = () => {
  const htmlContent = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h2>Password Changed Successfully</h2>
      <p>Your password was recently changed.</p>
      <p>If you didn't make this change, please contact support immediately.</p>
      <p>Time of change: ${new Date().toUTCString()}</p>
      <p>Best regards,<br>The Authentication Team</p>
    </div>
  `;

  const textContent = `
Password Changed Successfully

Your password was recently changed.

If you didn't make this change, please contact support immediately.

Time of change: ${new Date().toUTCString()}

Best regards,
The Authentication Team
  `;

  return { html: htmlContent, text: textContent };
};

/**
 * Generate a welcome email template
 * @param firstName User's first name
 * @returns Object containing HTML and text content
 */
export const getWelcomeTemplate = (firstName: string) => {
  const htmlContent = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h2>Welcome to our service!</h2>
      <p>Hello ${firstName},</p>
      <p>Thank you for joining our service. We're excited to have you on board!</p>
      <p>If you have any questions or need assistance, feel free to contact our support team.</p>
      <p>Best regards,<br>The Authentication Team</p>
    </div>
  `;

  const textContent = `
Welcome to our service!

Hello ${firstName},

Thank you for joining our service. We're excited to have you on board!

If you have any questions or need assistance, feel free to contact our support team.

Best regards,
The Authentication Team
  `;

  return { html: htmlContent, text: textContent };
};

/**
 * Generate a temporary password email template
 * @param firstName User's first name
 * @param temporaryPassword The temporary password
 * @param loginUrl The URL to login page
 * @returns Object containing HTML and text content
 */
export const getTemporaryPasswordTemplate = (
  firstName: string,
  temporaryPassword: string,
  loginUrl: string
) => {
  const htmlContent = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h2>Your Temporary Password</h2>
      <p>Hello ${firstName},</p>
      <p>As requested, here is your temporary password:</p>
      <div style="text-align: center; margin: 20px 0; padding: 15px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 18px;">
        ${temporaryPassword}
      </div>
      <p>Please login using this temporary password and change it immediately.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${loginUrl}" style="background-color: #4285F4; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; font-weight: bold;">Login Now</a>
      </div>
      <p>For security reasons, this temporary password will expire in 24 hours.</p>
      <p>Best regards,<br>The Authentication Team</p>
    </div>
  `;

  const textContent = `
Your Temporary Password

Hello ${firstName},

As requested, here is your temporary password:

${temporaryPassword}

Please login using this temporary password and change it immediately.

Login URL: ${loginUrl}

For security reasons, this temporary password will expire in 24 hours.

Best regards,
The Authentication Team
  `;

  return { html: htmlContent, text: textContent };
};

/**
 * Generate an account locked notification template
 * @param firstName User's first name
 * @param supportEmail Support email address
 * @returns Object containing HTML and text content
 */
export const getAccountLockedTemplate = (
  firstName: string, 
  supportEmail: string = 'support@example.com'
) => {
  const htmlContent = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h2>Account Security Alert</h2>
      <p>Hello ${firstName},</p>
      <p>We're contacting you to inform you that your account has been temporarily locked due to multiple failed login attempts.</p>
      <p>This is a security measure to protect your account.</p>
      <p>If this was you, you can unlock your account by:</p>
      <ol>
        <li>Waiting for 30 minutes before trying again, or</li>
        <li>Using the "Forgot Password" feature to reset your password</li>
      </ol>
      <p>If you didn't attempt to login, your password may have been compromised. Please contact us immediately at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
      <p>Best regards,<br>The Authentication Team</p>
    </div>
  `;

  const textContent = `
Account Security Alert

Hello ${firstName},

We're contacting you to inform you that your account has been temporarily locked due to multiple failed login attempts.

This is a security measure to protect your account.

If this was you, you can unlock your account by:
1. Waiting for 30 minutes before trying again, or
2. Using the "Forgot Password" feature to reset your password

If you didn't attempt to login, your password may have been compromised. Please contact us immediately at ${supportEmail}.

Best regards,
The Authentication Team
  `;

  return { html: htmlContent, text: textContent };
};
