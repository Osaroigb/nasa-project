import { Router } from 'express';
import { planetsRouter } from './planets/planets.router.js';
import { launchesRouter } from './launches/launches.router.js';

const api = Router();

api.use('/planets', planetsRouter);
api.use('/launches', launchesRouter);

export default api;
