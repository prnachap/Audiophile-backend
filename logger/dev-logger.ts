import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;

function devLogger(): any {
  const logFormat = printf((info) => `${info?.timestamp as string} ${info.level}: ${info.message as string}`);

  return createLogger({
    level: 'http',
    format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), logFormat),
    transports: [new transports.Console()],
  });
}
export default devLogger;
