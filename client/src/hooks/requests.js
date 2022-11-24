const API_URL = 'http://localhost:3300';

// Load planets and return as JSON.
async function httpGetPlanets() {  
  const response = await fetch(`${API_URL}/v1/planets`);
  return await response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/v1/launches`);
  const fetchedLaunches = await response.json();

  return fetchedLaunches.sort((a, b) => {
    return b.flightNumber - a.flightNumber; //descending order
  });
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {

  try {

    return await fetch(`${API_URL}/v1/launches`, {
      method: 'post',
      body: JSON.stringify(launch),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch(err) {
    console.error(err);
    return { ok: false };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {  

  try {

    return await fetch(`${API_URL}/v1/launches/${id}`, {
      method: 'delete'
    });
  } catch(err) {
    console.error(err);
    return { ok: false };
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};