// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// The store will hold all information needed globally
const store = {
	track_id: undefined,
	track_name: undefined,
	player_id: undefined,
	player_name: undefined,
	race_id: undefined,
}

// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
	onPageLoad()
	setupClickHandlers()
})

async function onPageLoad() {
	console.log("Getting form info for dropdowns!")
	try {
		getTracks()
			.then(tracks => {
				const html = renderTrackCards(tracks)
				renderAt('#tracks', html)
			})

		getRacers()
			.then((racers) => {
				const html = renderRacerCars(racers)
				renderAt('#racers', html)
			})
	} catch(error) {
		console.log("Problem getting tracks and racers ::", error.message)
		console.error(error)
	}
}
 
function setupClickHandlers() {
document.addEventListener(
"click",
						function (event) {
							const { target } = event;
				
							// Race track form field
							if (target.matches(".card.track")) {
								handleSelectTrack(target);
								store.track_id = target.id;
								store.track_name = target.innerHTML;
							}
				
							// Racer form field
							if (target.matches(".card.racer")) {
								handleSelectRacer(target);
								store.player_id = target.id;
								store.player_name = target.innerHTML;
							}
				
							// Submit create race form
							if (target.matches("#submit-create-race")) {
								event.preventDefault();
				
								// start race
								handleCreateRace();
							}
				
							// Handle acceleration click
							if (target.matches("#gas-peddle")) {
								handleAccelerate();
							}
				
							console.log("Store updated :: ", store);
						},
						false
					);
				}

async function delay(ms) {
	try {
		return await new Promise(resolve => setTimeout(resolve, ms));
	} catch(error) {
		console.log("an error shouldn't be possible here")
		console.log(error)
	}
}

// ^ PROVIDED CODE ^ DO NOT REMOVE

// BELOW THIS LINE IS CODE WHERE STUDENT EDITS ARE NEEDED ----------------------------
// TIP: Do a full file search for TODO to find everything that needs to be done for the game to work

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {
	console.log("in create race")

	// render starting UI
	renderAt('#race', renderRaceStartView(store.track_name))

	// TODO - Get player_id and track_id from the store

	const player_id = store.player_id;
	const track_id = store.track_id;

// const { player_id, track_id } = getPlayerAndTrack(store);
console.log("Player ID:", player_id);
console.log("Track ID:", track_id);

	// const race = TODO - call the asynchronous method createRace, passing the correct parameters
	const race = await createRace(player_id, track_id);

	// TODO - update the store with the race id in the response
	// TIP - console logging API responses can be really helpful to know what data shape you received
	console.log("RACE: ", race)
	store.race_id = race.ID; 

	// The race has been created, now start the countdown
	// TODO - call the async function runCountdown
	await runCountdown();

	// TODO - call the async function startRace
	// TIP - remember to always check if a function takes parameters before calling it!
	await startRace(store.race_id);



	// TODO - call the async function runRace
	await runRace(store.race_id);
}
function runRace(raceID) {
    return new Promise((resolve, reject) => {
        const raceInterval = setInterval(async () => {
            try {
                const raceInfo = await getRace(raceID);

                if (raceInfo.status === "in-progress") {
                    renderAt("#leaderBoard", raceProgress(raceInfo.positions));
                } else if (raceInfo.status === "finished") {
                    clearInterval(raceInterval); // Stop the interval
                    renderAt("#race", resultsView(raceInfo.positions)); // Render results view
                    resolve(raceInfo); // Resolve the promise
                }
            } catch (error) {
                console.error("Error getting race info:", error);
                clearInterval(raceInterval); // Stop polling on error
                reject(error); // Reject the promise
            }
        }, 500);
    });
}

async function runCountdown() {
	try {
		// wait for the DOM to load
		await delay(1000)
		let timer = 3

		return new Promise(resolve => {
			// TODO - use Javascript's built in setInterval method to count down once per second
			// run this DOM manipulation inside the set interval to decrement the countdown for the user
			document.getElementById('big-numbers').innerHTML = --timer
			const timerInterval = setInterval(() => {
				if (timer > 0) {
					document.getElementById('big-numbers').innerHTML = --timer;
				} else {
					clearInterval(timerInterval); // Stop the countdown when it reaches 0
					 resolve(); 
				}
			}, 1000);
			
			

			// TODO - when the setInterval timer hits 0, clear the interval, resolve the promise, and return

		})
	} catch(error) {
		console.log(error);
	}
}

function handleSelectRacer(target) {
	console.log("selected a racer", target.id)

	// remove class selected from all racer options
	const selected = document.querySelector('#racers .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')
}

function handleSelectTrack(target) {
	console.log("selected track", target.id)

	// remove class selected from all track options
	const selected = document.querySelector('#tracks .selected')
	if (selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')	
}

function handleAccelerate() {
	console.log("accelerate button clicked")
	// TODO - Invoke the API call to accelerate
	accelerate(store.race_id);
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
	if (!racers.length) {
		return `
			<h4>Loading Racers...</4>
		`
	}

	const results = racers.map(renderRacerCard).join('')

	return `
		<ul id="racers">
			${results}
		</ul>
	`
}

function renderRacerCard(racer) {
	const { id, driver_name, top_speed, acceleration, handling } = racer
	// OPTIONAL: There is more data given about the race cars than we use in the game, if you want to factor in top speed, acceleration, 
	// and handling to the various vehicles, it is already provided by the API!
	return `<h4 class="card racer" id="${id}">${driver_name}</h3>`
}

function renderTrackCards(tracks) {
	if (!tracks.length) {
		return `
			<h4>Loading Tracks...</4>
		`
	}

	const results = tracks.map(renderTrackCard).join('')

	return `
		<ul id="tracks">
			${results}
		</ul>
	`
}

function renderTrackCard(track) {
	const { id, name } = track

	return `<h4 id="${id}" class="card track">${name}</h4>`
}

function renderCountdown(count) {
	return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`
}

function renderRaceStartView(track) {
	return `
		<header>
			<h1>Race: ${track.name}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`
}

// function resultsView(positions) {
// 	userPlayer.driver_name += " (you)"
// 	let count = 1
  
// 	const results = positions.map(p => {
// 		return `
// 			<tr>
// 				<td>
// 					<h3>${count++} - ${p.driver_name}</h3>
// 				</td>
// 			</tr>
// 		`
// 	})

// 	return `
// 		<header>
// 			<h1>Race Results</h1>
// 		</header>
// 		<main>
// 			<h3>Race Results</h3>
// 			<p>The race is done! Here are the final results:</p>
// 			${results.join('')}
// 			<a href="/race">Start a new race</a>
// 		</main>
// 	`
// }


function resultsView(positions) {
    let userPlayer = positions.find(e => e.id === parseInt(store.player_id));
    if (userPlayer) {
        userPlayer.driver_name += " (you)";
    }
    let count = 1;

    const results = positions.map(p => {
        return `
            <tr>
                <td>
                    <h3>${count++} - ${p.driver_name}</h3>
                </td>
            </tr>
        `;
    });

    return `
        <header>
            <h1>Race Results</h1>
        </header>
        <main>
            <h3>Race Results</h3>
            <p>The race is done! Here are the final results:</p>
            ${results.join('')}
            <a href="/race">Start a new race</a>
        </main>
    `;
}

// function raceProgress(positions) {
// 	let userPlayer = positions.find(e => e.id === parseInt(store.player_id))
// 	userPlayer.driver_name += " (you)"

// 	positions = positions.sort((a, b) => (a.segment > b.segment) ? -1 : 1)
// 	let count = 1

// 	const results = positions.map(p => {
// 		return `
// 			<tr>
// 				<td>
// 					<h3>${count++} - ${p.driver_name}</h3>
// 				</td>
// 			</tr>
// 		`
// 	})

// 	return `
// 		<table>
// 			${results.join('')}
// 		</table>
// 	`
// }

function raceProgress(positions) {
    let userPlayer = positions.find(e => e.id === parseInt(store.player_id));
    if (userPlayer) {
        userPlayer.driver_name += " (you)";
    }

    positions = positions.sort((a, b) => (a.segment > b.segment) ? -1 : 1);
    let count = 1;

    const results = positions.map(p => {
        return `
            <tr>
                <td>
                    <h3>${count++} - ${p.driver_name}</h3>
                </td>
            </tr>
        `;
    });

    return `
        <table>
            ${results.join('')}
        </table>
    `;
}

function renderAt(element, html) {
	const node = document.querySelector(element)

	node.innerHTML = html
}

// ^ Provided code ^ do not remove


// API CALLS ------------------------------------------------

const SERVER = 'http://localhost:3001'

function defaultFetchOpts() {
	return {
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin' : SERVER,
		},
	}
}

// TODO - Make a fetch call (with error handling!) to each of the following API endpoints 

function getTracks() {
    console.log(`calling server :: ${SERVER}/api/tracks`);

    return fetch(`${SERVER}/api/tracks`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                console.error("Unexpected response format:", data);
                return []; // Return an empty array as a fallback
            }
            return data;
        })
        .catch(error => {
            console.error("Error fetching tracks:", error);
            return []; // Return an empty array in case of any error
        });
}

function getRacers() {
    console.log(`calling server :: ${SERVER}/api/cars`);

    return fetch(`${SERVER}/api/cars`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                console.error("Unexpected response format:", data);
                return []; // Return an empty array as a fallback
            }
            return data;
        })
        .catch(error => {
            console.error("Error fetching racers:", error);
            return []; // Return an empty array in case of any error
        });
}


function createRace(player_id, track_id) {
    player_id = parseInt(player_id);
    track_id = parseInt(track_id);
    const body = { player_id, track_id };

    return fetch(`${SERVER}/api/races`, {
        method: 'POST',
        ...defaultFetchOpts(),
        body: JSON.stringify(body),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Race created successfully:", data);
        return data;
    })
    .catch(error => {
        console.error("Problem with createRace request:", error);
        throw error; // Re-throw the error to propagate it
    });
}

function getRace(id) {
    return fetch(`${SERVER}/api/races/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || typeof data !== 'object') {
                console.error("Unexpected response format:", data);
                return null; // Return null if the response is not an object
            }
            return data;
        })
        .catch(error => {
            console.error(`Error fetching race with ID ${id}:`, error);
            return null; // Return null in case of any error
        });
}


// function startRace(id) {
//     return fetch(`${SERVER}/api/races/${id}/start`, {
//         method: 'POST',
//         ...defaultFetchOpts(),
//     })
//     .then(response => {
//         if (!response.ok) {
//             console.error(`HTTP error! Status: ${response.status}`);
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log("Race started successfully:", data);
//         return data;
//     })
//     .catch(err => {
//         console.log("Problem with starting the race request:", err);
//         throw err; // Re-throw the error to propagate it
//     });
// }

function startRace(id) {
    fetch(`${SERVER}/api/races/${id}/start`, {
        method: 'POST',
        ...defaultFetchOpts(),
    })
    .then(response => {
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
        }
    })
    .catch(err => console.log("Problem with starting the race request:", err));
}

// function accelerate(id) {
//     console.log(`Sending acceleration request to server for race with ID: ${id}`);

//     return fetch(`${SERVER}/api/races/${id}/accelerate`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             console.error(`HTTP error! Status: ${response.status}`);
//         }
//         return response;
//     })
//     .catch(error => {
//         console.error(`Failed to accelerate race with ID ${id}:`, error);
//     });
// }

function accelerate(id) {
    console.log(`Sending acceleration request to server for race with ID: ${id}`);

    fetch(`${SERVER}/api/races/${id}/accelerate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
        }
    })
    .catch(error => {
        console.error(`Failed to accelerate race with ID ${id}:`, error);
    });
}

async function handleCreateRace() {
    console.log("in create race");

    // Render starting UI
    renderAt('#race', renderRaceStartView(store.track_name));

    // Get player_id and track_id from the store
    const player_id = store.player_id;
    const track_id = store.track_id;

    // Create the race
    const race = await createRace(player_id, track_id);
    console.log("RACE: ", race);
    store.race_id = race.ID;

    // Start the countdown
    await runCountdown();

    // Start the race
    await startRace(store.race_id); // Await the race start

    // Run the race
    await runRace(store.race_id);
}