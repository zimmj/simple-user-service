import { eq } from 'drizzle-orm';

import * as schema from './schema';
import db from './db';
import logger from '../utils/logger';

const createHouse = async (house: schema.NewHouse) => {
  logger.verbose(`Creating house: ${JSON.stringify(house)}`);
  const response = await db.insert(schema.house).values(house).returning();
  return response[0].id;
};

const allHouses = async () => {
  const houses: schema.House[] = await db.select().from(schema.house);
  return houses;
};

const deleteHouse = async (id: string) => {
  const response = await db.delete(schema.house).where(eq(schema.house.id, id));
  return response;
};

export { createHouse, allHouses, deleteHouse };
