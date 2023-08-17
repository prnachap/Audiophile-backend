import { Strategy } from 'passport-google-oauth20';
import passport from 'passport';
import config from 'config';
import { findAndUpdate, findUser } from '../services/user.service';

const GOOGLE_CLIENT_ID = config.get<string>('googleClientId');
const GOOGLE_CLIENT_SECRET = config.get<string>('googleClientSecret');
const callbackURL = config.get<string>('googleOauthRedirectUrl');

passport.use(
  new Strategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const email = profile?.emails?.[0]?.value;
        const verified = profile?.emails?.[0]?.verified;
        const fullName = `${(profile.name?.familyName as string) ?? ''} ${(profile?.name?.givenName as string) ?? ''}`;
        const user = await findAndUpdate(
          { email },
          { email, name: fullName, verified },
          {
            upsert: true,
            new: true,
          }
        );
        cb(null, user?.id);
      } catch (error: any) {
        cb(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  try {
    const userData = await findUser({ _id: user }, { email: 1, _id: 1 });
    done(null, userData);
  } catch (error: any) {
    done(error, null);
  }
});
