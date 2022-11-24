import { getPagination } from '../../services/query.js';
import { getLaunches, scheduleLaunch, existingLaunch, abortLaunchById } from '../../models/launches.model.js';

// Business logic layer
export async function getAllLaunches(req, res) {
    const offset = getPagination(req.query);
    return res.status(200).json(await getLaunches(offset));
}

export async function addLaunch(req, res) {
    
    const launch = req.body;
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({ error: 'Missing required launch property!' });
    }

    launch.launchDate = new Date(launch.launchDate);

    // launch.launchDate.toString() === 'Invalid Date'
    if (isNaN(launch.launchDate)) return res.status(400).json({ error: 'Invalid launch date!' });

    await scheduleLaunch(launch);
    return res.status(201).json(launch);
}

export async function abortLaunch(req, res) {
    
    const launchId = req.params.id;
    const existsLaunch = await existingLaunch(launchId);

    if (!existsLaunch) return res.status(404).json({ error: 'Mission launch does not exist!' });

    const abortedLaunch = await abortLaunchById(launchId);

    if (!abortLaunch) return res.status(400).json({ error: 'Launch not aborted!' });
    
    return res.status(200).json({ message: 'Launch aborted successfully!' });    
}
