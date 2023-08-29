import config from 'config';
import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { errorHandler } from './middleware/error';
import morganMiddleware from './middleware/morganMiddleware';
import authRouter from './routes/auth.routes';
import productRouter from './routes/product.route';
import userRouter from './routes/user.routes';

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
import('./utils/authPassportGoogle');
app.use(passport.initialize());
app.use(passport.session());

/**
 * Routes
 */
app.use(morganMiddleware);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/product', productRouter);

app.use(errorHandler);

export default app;
