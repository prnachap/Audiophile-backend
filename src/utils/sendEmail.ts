// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import config from 'config';
import logger from '../../logger';
import { type MailOptions } from 'nodemailer/lib/ses-transport';

const clientSecret = config.get<string>('googleClientSecret');
const clientId = config.get<string>('googleClientId');
const refreshToken = config.get<string>('googleTokenRefresh');
const redirectUri = config.get<string>('emailRedirectUri');
const user = config.get<string>('userEmail');

const oAuth2Client = new google.auth.OAuth2({
  clientId,
  clientSecret,
  redirectUri,
});
oAuth2Client.setCredentials({ refresh_token: refreshToken });

export async function sendEmail(mailOptions: MailOptions) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user,
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
      },
    });
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error: any) {
    logger.error(error?.message);
  }
}
