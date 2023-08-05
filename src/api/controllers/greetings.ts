import * as express from 'express';

const hello = (req: express.Request, res: express.Response): void => {
  const name = req.query.name || 'stranger';
  const message = `Hello, ${name}!`;
  res.json({
    message,
  });
};

const goodbye = (req: express.Request, res: express.Response): void => {
  const name = req.query.name || 'stranger';
  const message = `Hello, ${name}!`;
  res.json({
    message,
  });
};

export { goodbye, hello };
