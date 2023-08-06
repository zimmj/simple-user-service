import dotenvExtended from 'dotenv-extended';
import dotenvParseVariables from 'dotenv-parse-variables';

type LogLevel =
  | 'silent'
  | 'error'
  | 'warn'
  | 'info'
  | 'http'
  | 'verbose'
  | 'debug'
  | 'silly';

const getRandomBytes = (size: number): string => {
  const array = new Uint32Array(size);
  crypto.getRandomValues(array);
  return array.join('');
};

const env = dotenvExtended.load({
  path: process.env.ENV_FILE,
  defaults: './config/.env.defaults',
  schema: './config/.env.schema',
  includeProcessEnv: true,
  silent: false,
  errorOnMissing: true,
  errorOnExtra: true,
});

const parsedEnv = dotenvParseVariables(env);

interface Config {
  port: number;
  tokenSecret: string;
  morganLogger: boolean;
  morganBodyLogger: boolean;
  loggerLevel: LogLevel;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DATABASE_NAME: string;
}

const config: Config = {
  port: parsedEnv.PORT as number,
  tokenSecret:
    parsedEnv.TOKEN_SECRET === 'secret'
      ? getRandomBytes(128)
      : (parsedEnv.TOKEN_SECRET as string),
  morganLogger: parsedEnv.MORGAN_LOGGER as boolean,
  morganBodyLogger: parsedEnv.MORGAN_BODY_LOGGER as boolean,
  loggerLevel: parsedEnv.LOGGER_LEVEL as LogLevel,
  DB_HOST: parsedEnv.DB_HOST as string,
  DB_PORT: parsedEnv.DB_PORT as number,
  DB_USER: parsedEnv.DB_USER as string,
  DB_PASSWORD: parsedEnv.DB_PASSWORD as string,
  DATABASE_NAME: parsedEnv.DATABASE_NAME as string,
};

export default config;
