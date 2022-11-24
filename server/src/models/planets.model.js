import path from 'path';
import { parse } from 'csv-parse';
import { fileURLToPath } from 'url';
import { createReadStream } from 'fs';
import planets from './planets.mongo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const habitablePlanets = [];

const isHabitable = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36 
    && planet['koi_insol'] < 1.11 && planet['koi_prad'] < 1.6;
};

export function loadPlanetsData() {

    return new Promise((resolve, reject) => {

        createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true
        }))
        .on('data', async (data) => {
            if (isHabitable(data)) {                
                // habitablePlanets.push(data);
                savePlanets(data);
            }
        })
        .on('error', (err) => {
            console.error(err.message);
            reject(err);
        })
        .on('end', async () => {
            // console.log(`${habitablePlanets.length} habitable planets were found!`, 'Done processing your file!');
            console.info(`${(await getPlanets()).length} habitable planets were found!`, 'Done processing your file!');
            resolve();
        }); 
        
    });  
}

// Data access function in layered architecture
export async function getPlanets() {

    // return habitablePlanets;
    return await planets.find({}, {
        '_id': 0,
        '__v': 0
    });
}

async function savePlanets(habitablePlanet) {

    try {
        // replace create with insert + update = upsert
        await planets.updateOne({
            keplerName: habitablePlanet['kepler_name']
        }, {
            keplerName: habitablePlanet['kepler_name']
        }, {
            upsert: true
        });
    } catch(err) {
        console.error(`Could not save the planets ${err}!`);
    }
}
