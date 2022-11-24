import app from '../../app.js';
import request from 'supertest';
import Jasmine from 'jasmine';
import { mongoConnect, mongoDisconnect } from '../../services/mongo.js';

const jasmine = new Jasmine();

describe('Launches API', () => {

    // jest.setTimeOut(30000);
    
    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
        await mongoConnect();
    });

    afterAll(async () => await mongoDisconnect());

    describe('Test GET /v1/launches', () => {

        test('It should respond with 200 success code', async () => {
            const res = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
    
            // expect(res.statusCode).toBe(200);
        });
    
    });
    
    describe('Test POST /v1/launches', () => {
    
        const completeLaunch = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-442 b',
            launchDate: 'October 23, 2085'
        };
    
        const incompleteLaunch = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-442 b'
        };
    
        const invalidLaunch = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-442 b',
            launchDate: 'zangetsu'
        };
    
        test('It should respond with 201 success code', async () => {
    
            const res = await request(app)
                .post('/v1/launches')
                .send(completeLaunch)
                .expect('Content-Type', /json/)
                .expect(201);
    
    
            const requestDate = new Date(completeLaunch.launchDate).valueOf();
            const responseDate = new Date(res.body.launchDate).valueOf();
    
            expect(requestDate).toBe(responseDate);
            expect(res.body).toMatchObject(incompleteLaunch);
        });
    
        test('It should catch missing required properties', async () => {
    
            const res = await request(app)
                .post('/v1/launches')
                .send(incompleteLaunch)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(res.body).toStrictEqual({
                error: 'Missing required launch property!'
            });
        });
    
    
        test('It should catch invalid launch dates', async () => {
    
            const res = await request(app)
                .post('/v1/launches')
                .send(invalidLaunch)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(res.body).toStrictEqual({
                error: 'Invalid launch date!'
            });
        });
    
    });
    
});
