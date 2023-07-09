/* eslint-disable import/first */
import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import config from 'config';
import app from './app';
import logger from '../logger';
import connect from './utils/connect';

const PORT = config.get<number>('port');

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`server started on port ${PORT}`);
  connect()
    .then(() => {
      logger.info('db connected successfully');
    })
    .catch((error) => {
      logger.error(error);
    });
});
