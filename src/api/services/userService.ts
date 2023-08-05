import { v4 as uuidv4 } from 'uuid';

import { NewUser, User } from '../../db/schema';
import * as userRepository from '../../db/userRepository';
import { TypedError } from '../../utils/TypedError';

interface CreateUser {
  name: string;
  email: string;
  password: string;
}

interface VisibleUser {
  id: string;
  name: string;
  email: string;
}

const createUser = (user: CreateUser): Promise<User> => {
  const newUuiD = uuidv4();
  return userRepository
    .createUser({ id: newUuiD, ...user } as NewUser)
    .catch((err) => {
      console.log(err);
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

const getUser = (id: string): Promise<User> => {
  return userRepository.getUser(id).then((user) => {
    if (!user) {
      throw new TypedError(`User with id ${id} not found`, 'not_found');
    }
    return user;
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

export { createUser, getUser, getUsers, updateUser, deleteUser, CreateUser };
