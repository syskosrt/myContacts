const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/User');

jest.setTimeout(20000); // Timeout augmenté pour Jest

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test-jest');
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'jest@test.com', password: 'jestpass123' });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Utilisateur créé avec succès.');
  });

  it('should not register with existing email', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'jest@test.com', password: 'jestpass123' });
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'jest@test.com', password: 'jestpass123' });
    expect(res.statusCode).toBe(409);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'jest@test.com', password: 'jestpass123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'jest@test.com', password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
  });
});
