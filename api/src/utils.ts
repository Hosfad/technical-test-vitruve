import { existsSync, readFileSync, writeFileSync } from "fs";
import { Pokemon, PokemonData, User } from "./types";
import axios from "axios";

const usersDir = "./data/users";

export async function getPokemonDataRaw(page?: number) {
    const limit = 20;
    const skip = limit * (page || 0) - 20;

    const url = page
        ? `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${skip}`
        : `https://pokeapi.co/api/v2/pokemon?limit=1302`;

    const response = await axios.get(url);

    const data = await response.data;
    const next = data.next !== null;
    return data.results;
}

export async function getAllPokemon(page?: number) {
    const time = Date.now();
    const raw = await getPokemonDataRaw(page);
    const all = await Promise.all(
    raw.map(async (p: PokemonData) => {
            const pokemon = await getPokemon(p.name);
            return pokemon;
        })
    );
    console.log(all.length);

    let searchIndex = all.map((p: Pokemon) => {
        if (!p) return null;
        return {
            name: p.name,
            sprites: {
                front_default: p.sprites.front_default,
            },
        };
    });

    searchIndex = searchIndex.filter((p) => p !== null);
    console.log(`Time to fetch all pokemon: ${Date.now() - time}ms`);

    writeFileSync(
        "./data/search-index.json",
        JSON.stringify(searchIndex, null, 2)
    );
}

export async function getPokemon(name: string): Promise<Pokemon | null> {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    try {
        const response = await axios.get(url);
        const data = await response.data;

        return data as Pokemon;
    } catch (e) {
        console.error(name);
        return null;
    }
}

export function getUserInfo(email: string): User | null {
    const exists = existsSync(`${usersDir}/${email}.json`);
    if (!exists) {
        return null;
    }

    const data = readFileSync(`${usersDir}/${email}.json`, "utf-8");
    return JSON.parse(data);
}

export function saveUser(user: User) {
    writeFileSync(
        `${usersDir}/${user.email}.json`,
        JSON.stringify(user, null, 2)
    );

    return user;
}