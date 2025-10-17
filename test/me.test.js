const request = require('supertest');
const app = require('../index');


describe('GET /me', () => {
it('returns the required JSON structure', async () => {
const res = await request(app).get('/me').expect(200).expect('Content-Type', /application\/json/);


expect(res.body).toHaveProperty('status', 'success');
expect(res.body).toHaveProperty('user');
expect(res.body.user).toHaveProperty('email');
expect(res.body.user).toHaveProperty('name');
expect(res.body.user).toHaveProperty('stack');
expect(typeof res.body.user.email).toBe('string');
expect(typeof res.body.user.name).toBe('string');
expect(typeof res.body.user.stack).toBe('string');
expect(res.body).toHaveProperty('timestamp');
// timestamp should be ISO 8601-ish
expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
expect(res.body).toHaveProperty('fact');
expect(typeof res.body.fact).toBe('string');
}, 10000);
});