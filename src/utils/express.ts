import { OutgoingHttpHeaders } from 'http';
import * as express from 'express';
import { TypedError } from './TypedError';

const writeJsonResponse = (
  res: express.Response,
  code: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  headers?: OutgoingHttpHeaders | undefined,
): void => {
  const data =
    typeof payload === 'object' ? JSON.stringify(payload, null, 2) : payload;
  res.writeHead(code, { ...headers, 'Content-Type': 'application/json' });
  res.end(data);
};

const writeErrorJsonResponse = (
  res: express.Response,
  code: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: TypedError,
): void => {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      error: {
        type: err.type ?? 'internal_server_error',
        message: err.message,
      },
    }),
  );
};

const errorResponseHandler = (err: TypedError, res: express.Response) => {
  if (err.type === null) {
    writeErrorJsonResponse(res, 500, err);
  }
  switch (err.type) {
    case 'not_found':
      writeErrorJsonResponse(res, 404, err);
      break;
    case 'user_already_exists':
      writeErrorJsonResponse(res, 409, err);
      break;
    default:
      writeErrorJsonResponse(res, 500, err);
  }
};

export { writeJsonResponse, errorResponseHandler };
