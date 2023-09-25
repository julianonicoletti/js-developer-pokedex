

const pokeApi = {}

function convertPokeApiDetailtoPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.name = pokeDetail.name
    pokemon.number = pokeDetail.id

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const[type] = types
    pokemon.types = types
    pokemon.type = type

    pokemon.stats = extractStats(pokeDetail);

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    return pokemon

}

function extractStats(pokeDetail) {
    const statsArray = pokeDetail.stats
    .filter((statData) => {
        const statusEscolhidos = ["hp", "attack", "defense", "speed"];
        return statusEscolhidos.includes(statData.stat.name);
    })
    .map((statData) => {
        return {
            name: statData.stat.name,
            base_stat: statData.base_stat,
        };
    });

    return statsArray;
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
            .then((response) => response.json())
            .then(convertPokeApiDetailtoPokemon)


}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody)=> jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) 
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonDetails) => pokemonDetails)
        
}



