import { OutgoingHttpHeaders } from 'http';
import * as express from 'express';

export default function writeJsonResponse(
  res: express.Response,
  code: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  headers?: OutgoingHttpHeaders | undefined,
): void {
  const data =
    typeof payload === 'object' ? JSON.stringify(payload, null, 2) : payload;
  res.writeHead(code, { ...headers, 'Content-Type': 'application/json' });
  res.end(data);
}
