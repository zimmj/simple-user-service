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
  userService
    .deleteUser(id)
    .then(() => {
      res.status(202).send();
    })
    .catch((err) => {
      errorResponseHandler(err, res);
    });
};

export { getUsers, getUserById, createUser, updateUserById, deleteOwnUserByID };
