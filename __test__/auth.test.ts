import supertest from 'supertest';
import { server } from '../src/server';

const app = supertest(server);

describe('POST /api/v1/auth/login - User Login', () => {
  test('Should handle invalid Authentication data', async () => {
    const response = await app.post('/api/v1/auth/login');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      data: [],
      error: 'Email is mandatory,Password is mandatory',
    });
  });
});
