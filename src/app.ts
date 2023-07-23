import config from 'config';
import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import { errorHandler } from './middleware/error';
import morganMiddleware from './middleware/morganMiddleware';

const sessionSecret = config.get<string>('sessionSecret');
const dbUri = config.get<string>('dbUri');

// Express initialization
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Session Setup
 */
const sessionStore = MongoStore.create({
  mongoUrl: dbUri,
  dbName: 'Session',
});
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 600000,
    },
  })
);

/**
 * Passport Auth Setup
 */
import('./utils/authPassportLocal');
app.use(passport.initialize());
app.use(passport.session());

/**
 * Routes
 */
app.use(morganMiddleware);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use(errorHandler);

export default app;
