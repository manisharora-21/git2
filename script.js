const typesURL = "https://pokeapi.co/api/v2/type/?limit=21";
let offset = 0;
const pokemonURL = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`;
let types;
let pokemons;

const select = document.querySelector("select");
const pokemonsDiv = document.querySelector("#pokemons");

// Initialize App
async function setup() {
    await getTypes(); // Ensure types are loaded before event listener
    select.addEventListener("change", handleTypeChange); // Attach event listener after dropdown loads
    await getPokemons(); // Load default Pokémon list
}

// Fetch Pokémon list
async function getPokemons() {
    try {
        pokemons = await getDataFromURL(pokemonURL);
        const promises = pokemons.results.map(obj => getDataFromURL(obj.url));

        let finalData = await Promise.all(promises);
        displayData(finalData);
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
}

// Fetch Pokémon types
async function getTypes() {
    try {
        types = await getDataFromURL(typesURL);
        createOptions(types.results);
    } catch (error) {
        console.error("Error fetching types:", error);
    }
}

// Create dropdown options
function createOptions(typesArray) {
    const fragment = document.createDocumentFragment();
    typesArray.forEach(obj => {
        const option = document.createElement("option");
        option.value = obj.name;
        option.innerText = obj.name;
        fragment.append(option);
    });
    select.append(fragment);
}

// Handle Type Selection
async function handleTypeChange(e) {
    const selectedType = e.target.value;
    console.log("Selected Type:", selectedType);

    const typeURL = `https://pokeapi.co/api/v2/type/${selectedType}`;
    try {
        const typeData = await getDataFromURL(typeURL);
        const pokemonList = typeData.pokemon.slice(0, 20); // Limit to first 20 Pokémon

        const promises = pokemonList.map(obj => getDataFromURL(obj.pokemon.url));
        let finalData = await Promise.all(promises);

        displayData(finalData);
    } catch (error) {
        console.error("Error fetching Pokémon of type:", selectedType, error);
    }
}

// Generic function to fetch data
async function getDataFromURL(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

// Display Pokémon data
function displayData(data) {
    pokemonsDiv.innerHTML = ""; // ✅ Clear previous results before displaying new ones

    const fragment = document.createDocumentFragment();
    data.forEach(obj => {
        const parent = document.createElement("div");
        const image = document.createElement("img");
        const name = document.createElement("h2");
        const type = document.createElement("p");

        // ✅ Corrected image path
        image.src = obj.sprites.other.dream_world.front_default || obj.sprites.front_default;
        image.alt = obj.name;

        name.innerText = obj.name;

        // ✅ Corrected Type Extraction
        const typesList = obj.types.map(t => t.type.name).join(", ");
        type.innerText = `Type: ${typesList}`;

        parent.append(image, name, type);
        fragment.append(parent);
    });

    pokemonsDiv.append(fragment);
}

// ✅ Call setup function to start the app
setup();
