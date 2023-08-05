import config from './config';
import logger from './utils/logger';
import createServer from './utils/server';

createServer()
  .then((server) => {
    server.listen(config.port, () => {
      logger.info(`Listening on http://localhost:${config.port}`);
    });
  })
  .catch((err) => {
    logger.error(`Error: ${err}`);
  });
