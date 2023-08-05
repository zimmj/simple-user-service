import express from 'express';
import { Express } from 'express-serve-static-core';

export default async function createServer(): Promise<Express> {
  const server = express();
  server.get('/', (_req, res) => {
    res.send('Hello world!!!');
  });
  return server;
}
