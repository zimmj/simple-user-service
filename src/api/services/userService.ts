import * as jwt from 'jsonwebtoken';

import { NewUser, User } from '../../db/schema';
import * as userRepository from '../../db/userRepository';
import { TypedError } from '../../utils/TypedError';
import config from '../../config';

interface CreateUser {
  name: string;
  email: string;
  password: string;
}

interface VisibleUser {
  id: string;
  name: string | null;
  email: string;
}

const createUser = (user: CreateUser): Promise<User> => {
  const newUuiD = crypto.randomUUID();
  return userRepository
    .createUser({ id: newUuiD, ...user } as NewUser)
    .catch((err) => {
      if (err.code === '23505') {
        throw new TypedError('User already exists', 'user_already_exists');
      }
      throw err;
    });
};

const updateUser = (user: CreateUser, id: string): Promise<VisibleUser> => {
  return userRepository
    .updateUser({ id, ...user } as NewUser)
    .then((userResponse) => {
      return {
        id: userResponse.id,
        name: userResponse.name,
        email: userResponse.email,
      } as VisibleUser;
    });
};

const deleteUser = (id: string): Promise<void> => {
  return userRepository.deleteUser(id);
};

const getUser = (id: string): Promise<VisibleUser> => {
  return userRepository.getUser(id).then((user) => {
    if (!user) {
      throw new TypedError(`User with id ${id} not found`, 'not_found');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  });
};

const getUsers = (): Promise<VisibleUser[]> => {
  return userRepository.getUsers().then((users) => {
    return users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      } as VisibleUser;
    });
  });
};

const createAuthToken = (user: VisibleUser): string => {
  return jwt.sign(user, config.tokenSecret, { expiresIn: '1h' });
};

const signIn = async (email: string, password: string): Promise<string> => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new TypedError('Invalid Login/Password', 'invalid_credentials');
  }
  if (user.password !== password) {
    throw new TypedError('Invalid Login/Password', 'invalid_credentials');
  }
  return createAuthToken({
    id: user.id,
    name: user.name,
    email: user.email,
  });
};

const authenticate = (token: string): VisibleUser | undefined => {
  try {
    return jwt.verify(token, config.tokenSecret) as VisibleUser;
  } catch (err) {
    return undefined;
  }
};

export {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  signIn,
  CreateUser,
  authenticate,
};
