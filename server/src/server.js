import * as dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import cluster from 'cluster';
import { createServer } from 'http';
import { mongoConnect } from './services/mongo.js';
import { loadLaunchData } from './models/launches.model.js';
import { loadPlanetsData } from './models/planets.model.js';

// Set scheduling policy to Round Robin for Windows
cluster.schedulingPolicy = cluster.SCHED_RR;

const PORT = process.env.PORT || 5000;
const server = createServer(app);

await mongoConnect();
await loadPlanetsData();
await loadLaunchData();

server.listen(PORT, () => {
    console.info(`Server is listening on port ${PORT}`);
});
