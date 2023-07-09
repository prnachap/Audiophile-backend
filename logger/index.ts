import prodLogger from './prod-logger';
import devLogger from './dev-logger';
import isEqual from 'lodash/isEqual';
let logger: any;
if (isEqual(process.env.NODE_ENV, 'development')) {
  logger = devLogger();
} else {
  logger = prodLogger();
}

export default logger;
