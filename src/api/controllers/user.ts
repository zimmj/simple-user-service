import * as express from 'express';

import * as userService from '../services/userService';
import { errorResponseHandler, writeJsonResponse } from '../../utils/express';
import { User } from '../../db/schema';
import { TypedError } from '../../utils/TypedError';

const getUsers = async (req: express.Request, res: express.Response) => {
  userService
    .getUsers()
    .then((users) => {
      writeJsonResponse(res, 200, users);
    })
    .catch((err) => {
      errorResponseHandler(err, res);
    });
};

const createUser = async (req: express.Request, res: express.Response) => {
  const user = req.body;
  userService
    .createUser(user)
    .then((userResponse: User) => {
      writeJsonResponse(res, 201, { id: userResponse.id });
    })
    .catch((err) => {
      errorResponseHandler(err, res);
    });
};

const getUserById = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  userService
    .getUser(id)
    .then((user) => {
      writeJsonResponse(res, 200, user);
    })
    .catch((err: TypedError) => {
      errorResponseHandler(err, res);
    });
};

const updateUserById = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;

  console.log(id);
  const authenticatedUser: User = req.body.user;
  if (authenticatedUser.id !== id) {
    errorResponseHandler(
      new TypedError(
        'Authenticated user has not the same user id',
        'unauthorized',
      ),
      res,
    );
    return;
  }

  const user = req.body;
  userService
    .updateUser(user, id)
    .then((userResponse) => {
      writeJsonResponse(res, 200, { id: userResponse.id });
    })
    .catch((err) => {
      errorResponseHandler(err, res);
    });
};

const deleteOwnUserByID = async (
  req: express.Request,
  res: express.Response,
) => {
  const { id } = req.params;
  const authenticatedUser: User = req.body.user;
  if (authenticatedUser.id !== id) {
    errorResponseHandler(
      new TypedError(
        'Authenticated user has not the same user id',
        'unauthorized',
      ),
      res,
    );
    return;
  }
  userService
    .deleteUser(id)
    .then(() => {
      res.status(202).send();
    })
    .catch((err) => {
      errorResponseHandler(err, res);
    });
};

const signIn = async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  userService
    .signIn(email, password)
    .then((token) => {
      writeJsonResponse(res, 200, { token });
    })
    .catch((err) => {
      errorResponseHandler(err, res);
    });
};

const auth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const bearerAuth: string | undefined = req.headers.authorization;
  if (!bearerAuth) {
    throw new TypedError('Missing token', 'unauthorized');
  }

  const token = bearerAuth.split(' ')[1];
  const user = userService.authenticate(token);

  if (!user) {
    errorResponseHandler(new TypedError('Invalid Token', 'unauthorized'), res);
    return;
  }

  req.body.user = user;
  next();
};

export {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteOwnUserByID,
  signIn,
  auth,
};
