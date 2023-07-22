import config from 'config';
const supportEmail = config.get<string>('userEmail');

export const getPasswordResetMail = ({ name, token }: { name: string; token: string }) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <title>Password Reset Instructions</title>
  </head>
  <body>
    <h2>Password Reset Instructions</h2>
    <p>Dear ${name},</p>
    <p>We have received a request to reset your password for your account at Audiophile. To proceed with the password reset, please use the following token:</p>
    <p><strong>Password: ${token}</strong></p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Please note that this token is valid for a 10 minutes and can only be used once. If the token has expired, you can initiate a new password reset request on our website.</p>
    <p>If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>
    <p>Best regards,</p>
    <p>Audiophile</p>
    <p>Email: ${supportEmail}</p>
  </body>
  </html>
    `;
};

export const getVerficationEmail = ({ name, verificationURL }: { name: string; verificationURL: string }) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <title>Account Verification</title>
  </head>
  <body>
    <h2>Account Verification</h2>
    <p>Dear ${name},</p>
    <p>Thank you for creating an account at Audiophile. To activate your account, please click on the link below:</p>
    <p><a href=${verificationURL}>Verify Account</a></p>
    <p>If you did not create an account, please ignore this email.</p>
    <p>By verifying your account, you will gain access to all the features and benefits of our platform.</p>
    <p>If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>
    <p>Best regards,</p>
    <p>Audiophile</p>
    <p>Email: ${supportEmail}</p>
  </body>
  </html>
  `;
};
