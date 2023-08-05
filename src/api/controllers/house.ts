import * as express from 'express';
import { v4 as uuidv4 } from 'uuid';

import * as houseRepository from '../../db/houseRepository';
import writeJsonResponse from '../../utils/express';
import logger from '../../utils/logger';

const createHouse = async (req: express.Request, res: express.Response) => {
  const house = req.body;
  const newUuiD = uuidv4();
  house.id = newUuiD;
  houseRepository
    .createHouse(house)
    .then((id) => {
      logger.verbose(`Created house with id: ${id}`);
      res.status(201).json({
        id,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
};

const allHouses = async (req: express.Request, res: express.Response) => {
  houseRepository
    .allHouses()
    .then((houses) => {
      writeJsonResponse(res, 200, houses);
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
};

export { createHouse, allHouses };
