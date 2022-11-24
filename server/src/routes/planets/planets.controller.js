import { getPlanets } from '../../models/planets.model.js';

// Business logic layer
export async function getAllPlanets(_req, res) {
    return res.status(200).json(await getPlanets());
}
