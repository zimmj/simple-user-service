import { eq } from 'drizzle-orm';

import * as schema from './schema';
import db from './db';
import logger from '../utils/logger';

interface User {
  id: string;
  name: string | null;
  email: string;
  password: string;
}

const createUser = async (user: schema.NewUser): Promise<User> => {
  logger.verbose(`Creating user: ${JSON.stringify(user)}`);
  const users = await db.insert(schema.user).values(user).returning();
  return users[0];
};

const getUsers = async (): Promise<User[]> => {
  const users: schema.User[] = await db.select().from(schema.user);
  return users;
};

const getUser = async (id: string): Promise<User> => {
  const user: schema.User[] = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.id, id));
  return user[0];
};

const updateUser = async (user: schema.NewUser): Promise<User> => {
  logger.verbose(`Updating user: ${JSON.stringify(user)}`);
  const users = await db
    .update(schema.user)
    .set(user)
    .where(eq(schema.user.id, user.id))
    .returning();
  return users[0];
};

const deleteUser = async (id: string) => {
  logger.verbose(`Deleting user: ${id}`);
  await db.delete(schema.user).where(eq(schema.user.id, id));
};

export { createUser, getUsers, getUser, updateUser, deleteUser };
