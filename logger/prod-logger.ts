import { createLogger, format, transports } from 'winston';

function prodLogger(): any {
  return createLogger({
    format: format.json(),
    defaultMeta: { service: 'user-serive' },
    transports: [new transports.Console()],
  });
}
export default prodLogger;
