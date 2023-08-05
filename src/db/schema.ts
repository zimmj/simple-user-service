import { InferModel } from 'drizzle-orm';
import { pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core';

const houseColors = pgEnum('house_colors', ['red', 'blue', 'green']);

const house = pgTable('house', {
  id: varchar('id', { length: 191 }).primaryKey().notNull(),
  name: text('name'),
  color: houseColors('color'),
});

type House = InferModel<typeof house, 'select'>;
type NewHouse = InferModel<typeof house, 'insert'>;

export { house, houseColors, House, NewHouse };
