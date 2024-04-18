const express = require('express');
const request = require('supertest');
const requireSignIn = require('./requireSignIn.js');
const jwt = require('jsonwebtoken');
jest.mock('jsonwebtoken');

function setupTestApp() {
    const app = express();
    app.use(express.json());
    app.post('/test-route', requireSignIn, (req, res) => {
        res.status(200).json({ message: 'Success', userEmail: req.userEmail });
    });
    return app;
}

describe('requireSignIn Middleware', () => {
    let app;

    beforeEach(() => {
        app = setupTestApp();
        jwt.verify.mockClear();
    });

    it('should allow access with a valid token', async () => {

        jwt.verify.mockImplementation((token, getKey, options, callback) => {
            // Simulate a successful callback with decoded token information
            callback(null, { email: 'user@example.com' });
        });


        const response = await request(app)
            .post('/test-route')
            .set('Authorization', 'Bearer valid.token');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Success');
    });

    it('should reject access with an invalid token', async () => {

        jwt.verify.mockImplementation((token, getKey, options, callback) => {
            // Simulate a failed verification
            callback(new Error('Invalid token'), null);
        });

        const response = await request(app)
            .post('/test-route')
            .set('Authorization', 'Bearer invalid.token');

        expect(response.statusCode).toBe(401);
    });

    it('should reject access when no auth token is provided', async () => {
        // Mock jwt.verify to simulate a failed verification
        jwt.verify.mockImplementation((token, getKey, options, callback) => {
            // Simulate a failed verification due to no token
            callback(new Error('No token provided'), null);
        });

        const response = await request(app)
            .post('/test-route')
            // Not setting the 'Authorization' header to simulate missing token
            .send();

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ error: 'Unauthorized' });
    });
});
