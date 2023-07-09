import express from 'express';
import session from 'express-session';
import config from 'config';
import passport from 'passport';
import { sessionStore } from './utils/sessionStore';
import userRouter from './routes/user.routes';

const app = express();
const sessionSecret = config.get<string>('sessionSecret');

// initialize passport-local
app.use(express.json());

/**
 * Session Setup
 */
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 60000,
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
app.use('/api/v1/user', userRouter);

export default app;
