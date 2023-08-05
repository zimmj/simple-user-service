import express from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import { Express } from 'express-serve-static-core';
import { connector, summarise } from 'swagger-routes-express';
import YAML from 'yamljs';
import morganBody from 'morgan-body';
import morgan from 'morgan';

import * as api from '../api/controllers';
import config from '../config';
import logger from './logger';

export default async function createServer(): Promise<Express> {
  const yamlSpecFile = './config/openapi.yml';
  const apiDefinition = YAML.load(yamlSpecFile);
  const apiSummary = summarise(apiDefinition);
  logger.info(apiSummary);

  const server = express();

  server.use('/swagger', swaggerUi.serve);
  server.get('/swagger', swaggerUi.setup(apiDefinition));
  server.use(bodyParser.json());

  if (config.morganLogger) {
    server.use(
      morgan(':method :url :status :response-time ms - :res[content-length]'),
    );
  }

  morganBody(server);

  const validatorOptions = {
    apiSpec: yamlSpecFile,
    validateRequests: true,
    validateResponses: true,
  };
  server.use(OpenApiValidator.middleware(validatorOptions));

  server.use(
    (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      err: any,
      req: express.Request,
      res: express.Response,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      next: express.NextFunction,
    ) => {
      res.status(err.status).json({
        error: {
          type: 'request_validation',
          message: err.message,
          errors: err.errors,
        },
      });
    },
  );

  const connect = connector(api, apiDefinition, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onCreateRoute: (method: string, descriptor: any[]) => {
      logger.verbose(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        `${method}: ${descriptor[0]} : ${(descriptor[1] as any).name}`,
      );
    },
  });

  connect(server);

  return server;
}
