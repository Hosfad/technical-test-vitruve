import { Pokemon, PokemonData } from "./types";
import { useQuery } from 'react-query';

 async function getPokemonData(limit?: number): Promise<PokemonData[]> {
    const url = limit
        ? `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
        : "https://pokeapi.co/api/v2/pokemon";


    const response = await fetch(url);
    const data = await response.json();
    return data.results as PokemonData[];
}


export async function getPokemon(name: string): Promise<Pokemon> {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    const response = await fetch(url);
    const data = await response.json();
    return data as Pokemon;
}


