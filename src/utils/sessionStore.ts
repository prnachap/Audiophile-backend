import config from 'config';
import MongoStore from 'connect-mongo';

const dbUri = config.get<string>('dbUri');

// Session store configuration
export const sessionStore = new MongoStore({
  mongoUrl: dbUri,
  collectionName: 'session',
});
