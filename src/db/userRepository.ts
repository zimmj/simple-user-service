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

const createUser = async (user: schema.NewUser) => {
  logger.verbose(`Creating user: ${JSON.stringify(user)}`);
  const response = await db.insert(schema.user).values(user).returning();
  return response[0];
};

const getUsers = async () => {
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

export { createUser, getUsers, getUser };
