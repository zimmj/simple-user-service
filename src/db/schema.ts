import { InferModel } from 'drizzle-orm';
import { pgTable, text, varchar } from 'drizzle-orm/pg-core';

const user = pgTable('user', {
  id: varchar('id', { length: 191 }).primaryKey().notNull(),
  name: text('name'),
  email: text('email').primaryKey().notNull(),
  password: text('password').notNull(),
});

type User = InferModel<typeof user, 'select'>;
type NewUser = InferModel<typeof user, 'insert'>;

export { user, User, NewUser };
