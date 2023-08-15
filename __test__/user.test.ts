import supertest from 'supertest';
import { server } from '../src/server';
import { findOneByEmail, createUser } from '../src/services/user.service';
import { MESSAGES } from '../src/constants/messages';

jest.mock('../src/services/user.service', () => ({
  findOneByEmail: jest.fn(),
  createUser: jest.fn(),
}));

const app = supertest(server);
const createUserPayload = {
  name: 'test user',
  email: 'testuser@gmail.com',
  password: 'test123',
  confirmPassword: 'test123',
};

const userRegisteredResponse = {
  name: 'test user',
  email: 'testuser@gmail.com',
  password: 'test',
  verified: false,
  _id: '1',
  verificationCode: '1',
  createdAt: '2023-08-15T07:32:35.555Z',
  updatedAt: '2023-08-15T07:32:35.555Z',
  __v: 0,
};

describe('User Registration', () => {
  test('Should handle invalid registration data', async () => {
    const response = await app.post('/api/v1/users/register');
    expect(response.status).toBe(400);
  });
  test('Should handle existing user registration', async () => {
    // mock findOne response
    (findOneByEmail as jest.Mock).mockReturnValue({
      user: createUserPayload,
    });

    const response = await app.post('/api/v1/users/register').send(createUserPayload);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      data: [],
      error: MESSAGES.USER_ALREADY_EXISTS,
    });
  });
  test('should register new user', async () => {
    (findOneByEmail as jest.Mock).mockReturnValue({});
    (createUser as jest.Mock).mockReturnValue({
      ...userRegisteredResponse,
    });
    const response = await app.post('/api/v1/users/register').send(createUserPayload);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        ...userRegisteredResponse,
      },
    });
  });
});
