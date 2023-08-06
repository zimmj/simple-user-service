import request from 'supertest';
import { Express } from 'express-serve-static-core';

import createServer from '../../../utils/server';
import * as userRepository from '../../../db/userRepository';
import * as userService from '../../services/userService';

jest.mock('../../../db/userRepository');

async function getBearerToken(userId?: string) {
  const user = {
    email: 'user@example.com',
    password: 'password',
  };

  const mockUser = {
    id: userId ?? '8a769cc8-dc46-4090-91c1-1496aadaef31',
    ...user,
    name: 'User',
  };
  (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
  const token = await userService.signIn(user.email, user.password);

  return token;
}

let server: Express;
let token: string;
beforeAll(async () => {
  server = await createServer();
  token = await getBearerToken();
});

describe('POST /api/v1/users', () => {
  it('should return 201 & valid response if request body is valid', (done) => {
    const user = {
      name: 'Test User',
      email: 'email@test.com',
      password: 'password',
    };

    const mockId = 'test-id';
    const mockUser = { id: mockId, ...user };
    (userRepository.createUser as jest.Mock).mockResolvedValue(mockUser);

    request(server)
      .post(`/api/v1/users`)
      .send(user)
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({ id: mockId });
        return done();
      });
  });

  it('should return 400 & valid error response if request body has empty name', (done) => {
    request(server)
      .post(`/api/v1/users`)
      .send({
        email: 'mail@test.com',
        password: 'password',
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'request_validation',
            message: expect.stringMatching(
              "request/body must have required property 'name'",
            ),
            errors: expect.anything(),
          },
        });
        return done();
      });
  });

  it('should return 400 & valid error response if request body has empty email', (done) => {
    request(server)
      .post(`/api/v1/users`)
      .send({
        name: 'name',
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'request_validation',
            message: expect.stringMatching(
              "request/body must have required property 'email'",
            ),
            errors: expect.anything(),
          },
        });
        expect(res.body).toMatchObject({
          error: {
            type: 'request_validation',
            message: expect.stringMatching(
              "request/body must have required property 'password'",
            ),
            errors: expect.anything(),
          },
        });
        return done();
      });
  });

  it('should return 400 & valid error response if request body has wrong email format', (done) => {
    request(server)
      .post(`/api/v1/users`)
      .send({
        name: 'name',
        email: 'wrong-email-format',
        password: 'password',
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'request_validation',
            message: expect.stringMatching(
              'request/body/email must match format "email"',
            ),
            errors: expect.anything(),
          },
        });
        return done();
      });
  });

  it('should return 500 & valid error response if repository throws error', (done) => {
    const user = {
      name: 'Test User',
      email: 'mail@test.com',
      password: 'password',
    };

    (userRepository.createUser as jest.Mock).mockRejectedValue(
      new Error('Test error'),
    );

    request(server)
      .post(`/api/v1/users`)
      .send(user)
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'internal_server_error',
            message: expect.anything(),
          },
        });
        return done();
      });
  });

  it('should return 409 & valid error response if user already exists', (done) => {
    const user = {
      name: 'Test User',
      email: 'mail@test.com',
      password: 'password',
    };

    (userRepository.createUser as jest.Mock).mockRejectedValue({
      code: '23505',
    });

    request(server)
      .post(`/api/v1/users`)
      .send(user)
      .expect('Content-Type', /json/)
      .expect(409)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'user_already_exists',
            message: expect.anything(),
          },
        });
        return done();
      });
  });
});

describe('GET /api/v1/users/:id', () => {
  it('should return 200 & valid response if request params is valid', (done) => {
    const mockId = '8a769cc8-dc46-4090-91c1-1496aadaef31';
    const user = {
      name: 'Test User',
      email: 'mail@test.com',
      password: 'password',
    };

    const mockUser = { id: mockId, ...user };
    (userRepository.getUser as jest.Mock).mockResolvedValue(mockUser);

    request(server)
      .get(`/api/v1/users/${mockId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject(mockUser);
        return done();
      });
  });

  it('should return 404 & valid error response if user not found', (done) => {
    const mockId = '8a769cc8-dc46-4090-91c1-1496aadaef31';
    (userRepository.getUser as jest.Mock).mockResolvedValue(null);

    request(server)
      .get(`/api/v1/users/${mockId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'not_found',
            message: expect.anything(),
          },
        });
        return done();
      });
  });

  it('should return 500 & valid error response if repository throws error', (done) => {
    const mockId = '8a769cc8-dc46-4090-91c1-1496aadaef31';
    (userRepository.getUser as jest.Mock).mockRejectedValue(
      new Error('Test error'),
    );

    request(server)
      .get(`/api/v1/users/${mockId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'internal_server_error',
            message: expect.anything(),
          },
        });
        return done();
      });
  });

  it('should return 400 & valid error response if request params is invalid', (done) => {
    const mockId = 'invalid-id';

    request(server)
      .get(`/api/v1/users/${mockId}`)
      .expect('Content-Type', /json/)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'request_validation',
            message: expect.stringMatching(
              'request/params/id must match format "uuid"',
            ),
            errors: expect.anything(),
          },
        });
        return done();
      });
  });
});

describe('PUT /api/v1/users/:id', () => {
  it('should return 200 & valid response if request params is valid', (done) => {
    const mockId = '8a769cc8-dc46-4090-91c1-1496aadaef31';
    const user = {
      name: 'Test User',
      email: 'mail@test.com',
      password: 'password',
    };

    const mockUser = { id: mockId, ...user };
    (userRepository.updateUser as jest.Mock).mockResolvedValue(mockUser);

    request(server)
      .put(`/api/v1/users/${mockId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(user)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({ id: mockId });
        return done();
      });
  });

  it('should return 403 & valid error response if user id is different from token', (done) => {
    const mockId = '8a769cc8-dc46-4090-91c1-1496aadaef91';
    const user = {
      name: 'Test User',
      email: 'mail@test.com',
      password: 'password',
    };

    request(server)
      .put(`/api/v1/users/${mockId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(user)
      .expect(403)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'unauthorized',
            message: expect.anything(),
          },
        });
        return done();
      });
  });

  it('should return 500 & valid error response if repository throws error', (done) => {
    const mockId = '8a769cc8-dc46-4090-91c1-1496aadaef31';
    const user = {
      name: 'Test User',
      email: 'mail@test.com',
      password: 'password',
    };

    (userRepository.updateUser as jest.Mock).mockRejectedValue(
      new Error('Test error'),
    );

    request(server)
      .put(`/api/v1/users/${mockId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(user)
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'internal_server_error',
            message: expect.anything(),
          },
        });
        return done();
      });
  });
});

describe('DELETE /api/v1/users/:id', () => {
  it('should return 200 & valid response if request params is valid', (done) => {
    const mockId = '8a769cc8-dc46-4090-91c1-1496aadaef31';
    (userRepository.deleteUser as jest.Mock).mockResolvedValue(null);

    request(server)
      .delete(`/api/v1/users/${mockId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(202)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should return 403 & valid error response if user id is different from token', (done) => {
    const mockId = '8a769cc8-dc46-4090-91c1-1496aadaef91';

    request(server)
      .delete(`/api/v1/users/${mockId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'unauthorized',
            message: expect.anything(),
          },
        });
        return done();
      });
  });

  it('should return 500 & valid error response if repository throws error', (done) => {
    const mockId = '8a769cc8-dc46-4090-91c1-1496aadaef31';
    (userRepository.deleteUser as jest.Mock).mockRejectedValue(
      new Error('Test error'),
    );

    request(server)
      .delete(`/api/v1/users/${mockId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'internal_server_error',
            message: expect.anything(),
          },
        });
        return done();
      });
  });
});

describe('GET /api/v1/users', () => {
  it('should return 200 & valid response if request body is valid', (done) => {
    const mockId = '8a769cc8-dc46-4090-91c1-1496aadaef31';
    const user = {
      id: mockId,
      name: 'Test User',
      email: 'mail@test.com',
    };

    const mockUser = { password: 'password', ...user };
    (userRepository.getUsers as jest.Mock).mockResolvedValue([mockUser]);

    request(server)
      .get(`/api/v1/users`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject([user]);
        return done();
      });
  });

  it('should return 500 & valid error response if repository throws error', (done) => {
    (userRepository.getUsers as jest.Mock).mockRejectedValue(
      new Error('Test error'),
    );

    request(server)
      .get(`/api/v1/users`)
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'internal_server_error',
            message: expect.anything(),
          },
        });
        return done();
      });
  });
});

describe('POST /api/v1/signIn', () => {
  it('should return 200 & valid response if request body is valid', (done) => {
    const user = {
      email: 'user@example.com',
      password: 'password',
    };

    const mockUser = { id: '8a769cc8-dc46-4090-91c1-1496aadaef31', ...user };
    (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    request(server)
      .post(`/api/v1/signIn`)
      .send(user)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          token: expect.stringMatching(
            /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
          ),
        });
        return done();
      });
  });

  it('should return 401 & valid error response if user not found', (done) => {
    const user = {
      email: 'example@mail.com',
      password: 'password',
    };

    (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

    request(server)
      .post(`/api/v1/signIn`)
      .send(user)
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'invalid_credentials',
            message: expect.anything(),
          },
        });
        return done();
      });
  });

  it('should return 401 & valid error response if password is invalid', (done) => {
    const user = {
      email: 'example@mail.com',
      password: 'password',
    };

    const mockUser = {
      id: '8a769cc8-dc46-4090-91c1-1496aadaef31',
      ...user,
      password: 'invalid',
    };
    (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    request(server)
      .post(`/api/v1/signIn`)
      .send(user)
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'invalid_credentials',
            message: expect.anything(),
          },
        });
        return done();
      });
  });
});

describe('Calling auth middleware', () => {
  it('should return 401 & valid error response if no token is set', (done) => {
    request(server)
      .get(`/api/v1/users`)
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'request_validation',
            message: expect.anything(),
          },
        });
        return done();
      });
  });
});
