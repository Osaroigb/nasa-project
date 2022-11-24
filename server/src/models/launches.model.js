import axios from 'axios';
import planets from './planets.mongo.js';
import launchesDB from './launches.mongo.js';

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v5/launches/query';

// const launches = new Map();
// let latestFlightNumber = 100;

const launch = {
    flightNumber: DEFAULT_FLIGHT_NUMBER,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 15, 2030'),
    target: 'Kepler-1652 b',
    customers: ['NASA', 'ZTM'],
    upcoming: true,
    success: true
};

// saveLaunch(launch);
// launches.set(launch.flightNumber, launch);

async function saveLaunch(launch) {

    try { // updateOne
        await launchesDB.findOneAndUpdate({
            flightNumber: launch.flightNumber
        }, launch, // update the 'launches' collection with the launch document
        { upsert: true }); // insert a document into the collection if one doesn't exist
    } catch(err) {
        console.error(`Could not save the launch mission ${err}!`);
    }
}

async function getFlightNumber() {

    const latestLaunch = await launchesDB
        .findOne()
        .sort('-flightNumber'); // sort in descending order

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

// Data access function in layered architecture
export async function getLaunches(query) {

    // return Array.from(launches.values());
    return await launchesDB
        .find({}, { '_id': 0, '__v': 0 })
        .sort({ flightNumber: 1 })
        .skip(query.skip)
        .limit(query.limit);
}

export async function scheduleLaunch(launch) {
    const planet = await planets.findOne({ 
        keplerName: launch.target
    });

    if (!planet) throw new Error('No matching planet was found!!');

    const newFlightNumber = await getFlightNumber() + 10;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero to Mastery', 'NASA', 'PornHub'],
        flightNumber: newFlightNumber 
    });

    await saveLaunch(newLaunch);
}

// export function addNewLaunch(launch) {
    
//     latestFlightNumber = latestFlightNumber + 10;

//     launches.set(latestFlightNumber, Object.assign(launch, {
        // success: true,
        // upcoming: true,
        // customers: ['Zero to Mastery', 'NASA', 'PornHub'],
        // flightNumber: latestFlightNumber
//     }));
// }

async function findLaunch(filter) {
    return await launchesDB.findOne(filter);
}

export async function existingLaunch(launchId) {

    // return launches.has(Number(launchId));

    return await findLaunch({ 
        flightNumber: launchId
    });
}

export async function abortLaunchById(launchId) {
    
    // launches.delete(launchId);

    // const aborted = launches.get(Number(launchId));
    // aborted.success = false;
    // aborted.upcoming = false;
    // return aborted;

    const aborted = await launchesDB.updateOne({ 
        flightNumber: launchId
    }, {
        success: false,
        upcoming: false
    });

    // return aborted.ok === 1 && aborted.nModified === 1;
    return aborted.modifiedCount === 1;
}

async function populateLaunchesDB() {
    console.info('Downloading launch data...');

    const res = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: { name: 1 }
                }, {
                    path: 'payloads',
                    select: { customers: 1 }
                }
            ]
        }
    });

    if (res.status !== 200) throw new Error('Launch data download failed!');
    const launchDocs = res.data.docs;

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc.payloads;
        const allCustomers = payloads.flatMap(payload => { return payload.customers });

        const launch = {
            flightNumber: launchDoc.flight_number,
            mission: launchDoc.name,
            rocket: launchDoc.rocket.name,
            launchDate: launchDoc.date_local,
            customers: allCustomers,
            upcoming: launchDoc.upcoming,
            success: launchDoc.success
        };

        // console.info(`${launch.flightNumber} ${launch.mission}`);
        await saveLaunch(launch);
    }
}

export async function loadLaunchData() {

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });

    if (firstLaunch) return console.info('Launch data is already loaded!');
    await populateLaunchesDB();
}
