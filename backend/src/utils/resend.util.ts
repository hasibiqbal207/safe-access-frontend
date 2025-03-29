import { Resend } from 'resend';
import logger from '../../config/logger.config.js';
import {
  getEmailVerificationTemplate,
  getPasswordResetTemplate,
  getPasswordChangedTemplate,
  getWelcomeTemplate,
  getTemporaryPasswordTemplate,
  getAccountLockedTemplate
} from './email-templates.js';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
}

/**
 * Send an email using Resend
 * @param options Email options including recipient, subject, text content, and HTML content
 * @returns A promise that resolves to a boolean indicating success
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // IMPORTANT: Must use a verified domain (hasibiqbal.dev) for FROM address
    const fromEmail = options.from || process.env.EMAIL_FROM_ADDRESS || 'noreply@hasibiqbal.dev';
    const fromName = process.env.EMAIL_FROM_NAME || 'Authentication Service';
    
    // Log the from email being used
    logger.info(`Sending email with from address: ${fromName} <${fromEmail}>`);
    
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [options.to],
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    if (error) {
      logger.error('Error sending email with Resend:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    logger.info(`Email sent successfully to ${options.to} with Resend. Email ID: ${data?.id}`);
    return true;
  } catch (error) {
    logger.error('Error sending email with Resend:', error);
    throw new Error('Failed to send email with Resend');
  }
};

/**
 * Send an email verification email
 * @param email Recipient email address
 * @param firstName User's first name
 * @param token Verification token
 * @returns A promise that resolves to a boolean indicating success
 */
export const sendVerificationEmail = async (
  email: string, 
  firstName: string, 
  token: string
): Promise<boolean> => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const { html, text } = getEmailVerificationTemplate(firstName, verificationUrl);

  return sendEmail({
    to: email,
    subject: 'Verify Your Email Address',
    html,
    text
  });
};

/**
 * Send a password reset email
 * @param email Recipient email address
 * @param resetToken Reset token
 * @param ipAddress IP address of the request
 * @returns A promise that resolves to a boolean indicating success
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  ipAddress: string
): Promise<boolean> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const { html, text } = getPasswordResetTemplate(resetUrl, ipAddress);

  return sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html,
    text
  });
};

/**
 * Send a password changed notification
 * @param email Recipient email address
 * @returns A promise that resolves to a boolean indicating success
 */
export const sendPasswordChangedEmail = async (
  email: string
): Promise<boolean> => {
  const { html, text } = getPasswordChangedTemplate();

  return sendEmail({
    to: email,
    subject: 'Password Changed Successfully',
    html,
    text
  });
};

/**
 * Send a welcome email
 * @param email Recipient email address
 * @param firstName User's first name
 * @returns A promise that resolves to a boolean indicating success
 */
export const sendWelcomeEmail = async (
  email: string,
  firstName: string
): Promise<boolean> => {
  const { html, text } = getWelcomeTemplate(firstName);

  return sendEmail({
    to: email,
    subject: 'Welcome to our service!',
    html,
    text
  });
};

/**
 * Send a temporary password email
 * @param email Recipient email address
 * @param firstName User's first name
 * @param temporaryPassword The temporary password
 * @returns A promise that resolves to a boolean indicating success
 */
export const sendTemporaryPasswordEmail = async (
  email: string,
  firstName: string,
  temporaryPassword: string
): Promise<boolean> => {
  const loginUrl = `${process.env.FRONTEND_URL}/login`;
  
  const { html, text } = getTemporaryPasswordTemplate(firstName, temporaryPassword, loginUrl);

  return sendEmail({
    to: email,
    subject: 'Your Temporary Password',
    html,
    text
  });
};

/**
 * Send an account locked notification
 * @param email Recipient email address
 * @param firstName User's first name
 * @returns A promise that resolves to a boolean indicating success
 */
export const sendAccountLockedEmail = async (
  email: string,
  firstName: string
): Promise<boolean> => {
  const supportEmail = process.env.SUPPORT_EMAIL || 'support@example.com';
  
  const { html, text } = getAccountLockedTemplate(firstName, supportEmail);

  return sendEmail({
    to: email,
    subject: 'Account Security Alert',
    html,
    text
  });
}; 