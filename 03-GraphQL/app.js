async function run() {
    console.log("BASIC TASKS");
    await getTitles();
    await getCharacter();
    await getFivePlanets();
    await getStarships();

    console.log("\n\nINTERMEDIATE TASKS");
    await getFirstFiveShips();
    await getLanguages();
    await getPlanetClimates();
    await getVehicles();

    console.log("\n\nADVANCED TASKS");
    await getFilmCharacters();
    await getMultiFilmCharacters();
    await getTotalCharacters();

    console.log("\n\nCOMPLEX TASKS");
    await getCharacterProfile();
    await getCharacterHomeworlds();
    await getVehiclePilots();
    await getFilmEntities();
}

run();

async function getData(queryStr) {
    let response = await fetch('https://swapi-graphql.netlify.app/.netlify/functions/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `query {
                ${queryStr}
            }`
        }),
    });
    //const respJson = await response.json();
    return await response.json();
}

async function getTitles() {
    console.log("Task 1 -- Query Movie Titles");

    let query = `
            allFilms{
                films{
                    title
                }
            }`;


    let respJson = await getData(query);

    for (let film of respJson.data.allFilms.films) {
        console.log(film.title);
    }
}

async function getCharacter() {
    console.log("\nTask 2 -- Query Specific Character");

    let query = `
            person(id: "cGVvcGxlOjMx"){
                name
            }`;


    let respJson = await getData(query);

    console.log(respJson.data.person.name);
}

async function getFivePlanets() {
    console.log("\nTask 3 -- Get First Five Planets");

    query = `
            allPlanets(first: 5) {
                planets {
                    name
                }
            }`;

    let respJson = await getData(query);

    for (let planet of respJson.data.allPlanets.planets) {
        console.log(planet.name);
    }
}

async function getStarships() {
    console.log("\nTask 4 -- Get 3 Starship Names and Models");

    query = `
        allStarships(first: 3) {
            starships{
                name
                model
            }
        }
    `;

    let respJson = await getData(query);

    for (let ship of respJson.data.allStarships.starships) {
        console.log(`${ship.name} -- ${ship.model}`);
    }
}

async function getFirstFiveShips() {
    console.log("\nTask 5 - Get First 5 Characters Starships");

    query = `
        allPeople(first: 5){
            people{
                name,
                starshipConnection{
                    starships{
                        name
                    }
                }
            }
        }
    `;

    let respJson = await getData(query);

    for (let character of respJson.data.allPeople.people) {
        console.log(character.name);
        for (let ship of character.starshipConnection.starships) {
            console.log(`- ${ship.name}`);
        }
    }
}

async function getLanguages() {
    console.log("\nTask 6 -- Get Names and Languages of 5 Species");

    query = `
        allSpecies(first: 5) {
            species {
                name
                language
            }
        }
    `;

    let respJson = await getData(query);

    for (let species of respJson.data.allSpecies.species) {
        console.log(`${species.name} -- ${species.language}`);
    }
}

async function getPlanetClimates() {
    console.log("\nTask 7 -- Get Name and Climate of 5 Planets");

    query = `
        allPlanets(first: 5){
            planets{
                name
                climates
            }
        }
    `;

    let respJson = await getData(query);

    for (planet of respJson.data.allPlanets.planets) {
        console.log(planet.name);
        for (climate of planet.climates) {
            console.log(`- ${climate}`);
        }
    }
}

async function getVehicles() {
    console.log("\nTask 8 -- Get Name and Cost of 3 Vehicles");

    query = `
        allVehicles(first: 3){
            vehicles{
                name
                costInCredits
            }
        }
    `;

    let respJson = await getData(query);
    for (vehicle of respJson.data.allVehicles.vehicles) {
        console.log(`${vehicle.name} -- ${vehicle.costInCredits} credits`);
    }
}

async function getFilmCharacters() {
    console.log("\nTask 9 -- List All Characters in a Film");

    query = `
            film(id: "ZmlsbXM6Mg==") {
                title
                characterConnection {
                    characters{
                        name
                    }
                }
            }
    `;

    let respJson = await getData(query);
    console.log(`[${respJson.data.film.title}]`);
    for (character of respJson.data.film.characterConnection.characters) {
        console.log(`-${character.name}`);
    }
}

async function getMultiFilmCharacters() {
    console.log("\nTask 10 -- List Characters Who Appear in More Than One Film");

    query = `
        allPeople{
            people{
                name
                filmConnection{
                    totalCount
                }
            }
        }
    `;

    let respJson = await getData(query);
    for (character of respJson.data.allPeople.people) {
        if (character.filmConnection.totalCount > 1)
            console.log(`${character.name} -- ${character.filmConnection.totalCount}`);
    }
}

async function getTotalCharacters() {
    console.log("\nTask 11 -- Calculate The Total Count of Characters Across All Films");

    query = `
        allFilms{
            films{
                title
                characterConnection{
                    totalCount
                }
            }
        }
    `;

    let respJson = await getData(query);
    let total = 0;
    for (film of respJson.data.allFilms.films) {
        console.log(`${film.title} -- ${film.characterConnection.totalCount} characters`);
        total += film.characterConnection.totalCount;
    }
    console.log(`Total character count: ${total}`);
}

async function getCharacterProfile() {
    console.log("\nTask 12 -- Get The Full Profile of a Specific Character");

    query = `
        person(id: "cGVvcGxlOjEx") {
            name
            gender
            birthYear
            eyeColor
            hairColor
            homeworld {
                name
                population
                climates
            }
            filmConnection {
                films {
                    title
                }
            }
            starshipConnection {
                starships {
                    name
                    model
                }
            }
        }
    `;

    let respJson = await getData(query);
    let character = respJson.data.person;
    let log = '';

    log += `[${character.name}]\n`;
    log += `Gender: ${character.gender}\n`;
    log += `Birthyear: ${character.birthYear}\n`;
    log += `Eye Color: ${character.eyeColor}\n`;
    log += `Hair Color: ${character.hairColor}\n`;
    log += `Homeworld: ${character.homeworld.name}\n`;
    log += `\tPopulation: ${character.homeworld.population}\n`;
    log += `\tClimates:\n`;
    for (climate of character.homeworld.climates)
        log += `\t- ${climate}\n`;
    log += `Films:\n`;
    for (film of character.filmConnection.films)
        log += `\t- ${film.title}\n`;
    log += `Starships:\n`;
    for (starship of character.starshipConnection.starships)
        log += `\t- ${starship.name} -- ${starship.model}\n`;

    console.log(log);
}

async function getCharacterHomeworlds() {
    console.log("\nTask 13 -- Get The Name And Population of First 5 Characters Homeworlds");

    query = `
        allPeople(first: 5) {
            people {
                name
                homeworld {
                    name
                    population
                }
            }
        }
    `;

    let respJson = await getData(query);

    for (let i = 0; i < respJson.data.allPeople.people.length; i++) {
        let character = respJson.data.allPeople.people[i];
        let log = `${character.name}\nHomeworld: ${character.homeworld.name}\nPopulation: ${character.homeworld.population}`;

        if (i + 1 < respJson.data.allPeople.people.length - 1)
            log += '\n';

        console.log(log);
    }
}

async function getVehiclePilots() {
    console.log("\nTask 14 -- Get Name of First 3 Vehicles, And The Name And Species of The Pilots")

    query = `
        allVehicles(first: 3) {
            vehicles {
                name
                pilotConnection {
                    pilots {
                        name
                        species {
                            name
                        }
                    }
                }
            }
        }
    `;

    let respJson = await getData(query);

    for (vehicle of respJson.data.allVehicles.vehicles) {
        console.log(`${vehicle.name}`);
        for (pilot of vehicle.pilotConnection.pilots)
            console.log(`- ${pilot.name}, ${pilot.species.name}`);
    }
}

async function getFilmEntities() {
    console.log("\nTask 15 -- List All Characters, Planets, And Starships of First 3 Films");

    query = `
        allFilms(first: 3) {
            films {
                title
                characterConnection {
                    characters {
                        name
                    }
                }
                planetConnection {
                    planets {
                        name
                    }
                }
                starshipConnection {
                    starships {
                        name
                    }
                }
            }
        }
    `;

    let respJson = await getData(query);
    for (film of respJson.data.allFilms.films) {
        console.log(`[${film.title}]`);

        console.log("Characters");
        for (character of film.characterConnection.characters)
            console.log(`- ${character.name}`);

        console.log("Planets");
        for (planet of film.planetConnection.planets)
            console.log(`- ${planet.name}`);

        console.log("Starships");
        for (starship of film.starshipConnection.starships)
            console.log(`- ${starship.name}`);
    }
}