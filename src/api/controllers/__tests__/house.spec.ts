import request from 'supertest';
import { Express } from 'express-serve-static-core';

import createServer from '../../../utils/server';
import * as houseRepository from '../../../db/houseRepository';

jest.mock('../../../db/houseRepository');

let server: Express;
beforeAll(async () => {
  server = await createServer();
});

describe('POST /api/v1/house', () => {
  it('should return 201 & valid response if request body is valid', (done) => {
    const mockId = 'test-id';
    (houseRepository.createHouse as jest.Mock).mockResolvedValue(mockId);

    const house = {
      name: 'Test House',
      color: 'red',
    };

    request(server)
      .post(`/api/v1/house`)
      .send(house)
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({ id: mockId });
        return done();
      });
  });

  it('should return 400 & valid error response if request body has empty color', (done) => {
    request(server)
      .post(`/api/v1/house`)
      .send({
        name: 'Test House',
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'request_validation',
            message: expect.stringMatching(
              "request/body must have required property 'color'",
            ),
            errors: expect.anything(),
          },
        });
        return done();
      });
  });

  it('should return 400 & valid error response if request body has wrong color enum', (done) => {
    request(server)
      .post(`/api/v1/house`)
      .send({
        name: 'Test House',
        color: 'pink',
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'request_validation',
            message: expect.stringMatching(
              'request/body/color must be equal to one of the allowed values: red, green, blue',
            ),
            errors: expect.anything(),
          },
        });
        return done();
      });
  });

  it('should return 500 & valid error response if repository throws error', (done) => {
    (houseRepository.createHouse as jest.Mock).mockRejectedValue(
      new Error('Test Error'),
    );

    request(server)
      .post(`/api/v1/house`)
      .send({
        name: 'Test House',
        color: 'blue',
      })
      .expect(500)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: 'Test Error',
        });
        return done();
      });
  });
});

describe('GET /api/v1/house', () => {
  it('should return 200 & valid response if request query is valid', (done) => {
    const mockHouses = [
      {
        id: 'test-id-1',
        name: 'Test House 1',
        color: 'red',
      },
      {
        id: 'test-id-2',
        name: 'Test House 2',
        color: 'blue',
      },
    ];
    (houseRepository.allHouses as jest.Mock).mockResolvedValue(mockHouses);

    request(server)
      .get(`/api/v1/house`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject(mockHouses);
        return done();
      });
  });

  it('should return 500 & valid error response if repository throws error', (done) => {
    (houseRepository.allHouses as jest.Mock).mockRejectedValue(
      new Error('Test Error'),
    );

    request(server)
      .get(`/api/v1/house`)
      .expect(500)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: 'Test Error',
        });
        return done();
      });
  });
});
