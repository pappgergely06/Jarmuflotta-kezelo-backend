jest.mock('../db');
jest.mock('bcrypt');

const request = require('supertest');
const app = require('../app');
const db = require('../db');
const bcrypt = require('bcrypt');

describe('Auth API endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/auth/register - should create user', async () => {
    bcrypt.hash.mockResolvedValue('hashed_pw');
    db.query.mockResolvedValue([{}]);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'password123', role: 'driver' });
      
    expect(res.statusCode).toEqual(201);
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        ['testuser', 'hashed_pw', 'driver']
    );
  });

  it('POST /api/auth/register - should handle duplication', async () => {
    bcrypt.hash.mockResolvedValue('hashed_pw');
    const duplicateError = new Error('Duplicate');
    duplicateError.code = 'ER_DUP_ENTRY';
    db.query.mockRejectedValue(duplicateError);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'existing', password: 'password123', role: 'driver' });
      
    expect(res.statusCode).toEqual(409);
  });

  it('POST /api/auth/login - should return token if successful', async () => {
    const mockUser = { user_id: 1, username: 'testuser', password: 'hashed_pw', role: 'driver' };
    db.query.mockResolvedValue([[mockUser]]);
    bcrypt.compare.mockResolvedValue(true);
   
    process.env.JWT_SECRET = 'testsecret';

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /api/auth/login - should fail with bad password', async () => {
    const mockUser = { user_id: 1, username: 'testuser', password: 'hashed_pw', role: 'driver' };
    db.query.mockResolvedValue([[mockUser]]);
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'wrongpassword' });
      
    expect(res.statusCode).toEqual(401);
  });
});
