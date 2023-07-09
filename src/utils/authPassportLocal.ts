import passport from 'passport';
import { type IVerifyOptions, Strategy } from 'passport-local';
import UserModel, { User } from '../model/user.model';

const customFields = {
  usernameField: 'email',
  passwordField: 'password',
};
const verifyCallback = (
  username: string,
  password: string,
  cb: (error: any, user?: Express.User | false, options?: IVerifyOptions) => void
): any => {
  UserModel.findOne({ email: username })
    .then((user) => {
      if (!user) {
        cb(null, false);
        return;
      }

      user
        .validatePassword(password)
        .then((isValid) => {
          if (isValid) {
            cb(null, user);
            return;
          }
          cb(null, false);
        })
        .catch(() => {
          cb(null, false);
        });
    })
    .catch((error) => {
      cb(error, false);
    });
};

passport.use(new Strategy(customFields, verifyCallback));
passport.serializeUser((user, done) => {
  done(null, (user as { id: string })?.id);
});
passport.deserializeUser((user, done) => {
  UserModel.findById({ id: user })
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});
