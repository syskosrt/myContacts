const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/User');
const Contact = require('../models/Contact');

let token;
let contactId;

describe('Contacts API', () => {
  beforeAll(async () => {
    await User.deleteMany({});
    await Contact.deleteMany({});
    await request(app)
      .post('/auth/register')
      .send({ email: 'contact@test.com', password: 'contactpass123' });
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'contact@test.com', password: 'contactpass123' });
    token = res.body.token;
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a contact', async () => {
    const res = await request(app)
      .post('/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Jean', lastName: 'Dupont', phone: '0612345678' });
    expect(res.statusCode).toBe(201);
    expect(res.body.firstName).toBe('Jean');
    contactId = res.body._id;
  });

  it('should get contacts list', async () => {
    const res = await request(app)
      .get('/contacts')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update a contact', async () => {
    const res = await request(app)
      .patch(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Pierre' });
    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe('Pierre');
  });

  it('should delete a contact', async () => {
    const res = await request(app)
      .delete(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Contact supprimé.');
  });
});
