import { Router } from 'express';
import { getAllPlanets } from './planets.controller.js';

export const planetsRouter = Router();

planetsRouter.get('/', getAllPlanets);
