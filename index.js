// https://ui.dev/dom/
// https://www.youtube.com/watch?v=TZ4wSipJ1E0&t=2s

const app = document.createElement('div');
document.body.appendChild(app);

const baseURL = 'https://pokeapi.co/api/v2/pokemon/';

// Treat the DOM as a global mutable state. Since the DOM is globally accessible
// and you can mutate any DOM element at any time, it's possible that the DOM element
// will change in a way that you weren't anticipating. So we use the variable currentPokemonId
// as our state for our event handlers when we click prev or next pokemon.
let currentPokemonId = 1;

// Create a Loading element
const loading = document.createElement('p');
loading.innerText = "Loading...";
loading.classList.add('loading');

// Get a pokemon by id
async function getPokemon(){
  const response = await fetch(`${baseURL}${currentPokemonId}`);
  const result = await response.json();   // resolve our promise into json
  return result;
}

// Takes a pokemon response and creates the elements for it
function createPokemon(pokemon){
  // Create a container for the entire pokemon
  const pokemonElement = document.createElement("div");
  pokemonElement.id = "pokemonContainer";
  pokemonElement.classList.add("pokemon-container");

  // Create the image
  const pokemonImage = document.createElement('img');
  // Set the src attribute directly on the element.
  // Use optional chain. If one option doesn't exist, then use the next one, and so on.
  pokemonImage.src =
    pokemon.sprites?.other?.dream_world?.front_default ||
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default;
  pokemonImage.classList.add("pokemon-image");
  pokemonElement.appendChild(pokemonImage);   // add to the pokemon element

  // Container for the pokemon information
  const pokemonInfo = document.createElement('div');
  pokemonElement.appendChild(pokemonInfo);

  const pokemonId = document.createElement('p');
  pokemonId.classList.add('pokemon-id');
  pokemonId.innerText = pokemon.id;
  pokemonInfo.appendChild(pokemonId);

  const pokemonName = document.createElement('p');
  pokemonName.innerText = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  pokemonName.classList.add('pokemon-name');
  pokemonInfo.appendChild(pokemonName);

  const pokemonTypes = document.createElement('div');
  pokemonTypes.classList.add('pokemon-types');

  pokemon.types.forEach((type) => {
    const typeElement = document.createElement('div');
    typeElement.classList.add(type.type.name);
    typeElement.innerText = type.type.name;
    pokemonTypes.appendChild(typeElement);
  })
  pokemonInfo.appendChild(pokemonTypes);

  // Add buttons
  pokemonElement.appendChild(createButtons());

  return pokemonElement;
}


async function loadAndRenderPokemon(){
  // Remove the current pokemon card and add loading
  const pokemonElement = document.getElementById('pokemonContainer');
  pokemonElement.remove();
  app.appendChild(loading);

  // Fetch the prev/next pokemon and remove loading
  const pokemon = await getPokemon();
  loading.remove();

  // Add pokemon to the DOM
  app.appendChild(createPokemon(pokemon));
}

function getPrev(){
  if(currentPokemonId <= 1){ return; }
  currentPokemonId -= 1
  loadAndRenderPokemon();
}

function getNext(){
  if(currentPokemonId >= 893){ return; }
  currentPokemonId += 1
  loadAndRenderPokemon();
}


function createButtons(){
  // Create container for buttons to return
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');

  const prevButton = document.createElement('button');
  prevButton.innerText = 'Prev';
  buttonContainer.appendChild(prevButton);

  const nextButton = document.createElement('button');
  nextButton.innerText = 'Next';
  buttonContainer.appendChild(nextButton);

  // Add event listeners
  prevButton.addEventListener('click', getPrev);
  nextButton.addEventListener('click', getNext);

  return buttonContainer;
}

// Init function that initially loads our page
async function init(){
  app.appendChild(loading);
  const pokemon = await getPokemon(1);  // wait to get the pokemon then remove loading
  const pokeElement = createPokemon(pokemon);
  app.appendChild(pokeElement);
  loading.remove();
}

init();
