import { Router } from 'express';
import { getAllLaunches, addLaunch, abortLaunch } from './launches.controller.js';

export const launchesRouter = Router();

launchesRouter.get('/', getAllLaunches);
launchesRouter.post('/', addLaunch);
launchesRouter.delete('/:id', abortLaunch);
