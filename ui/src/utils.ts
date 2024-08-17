import { Pokemon, PokemonData, User } from "./types";

export async function getPokemonDataRaw(
    page?: number
): Promise<{ results: PokemonData[]; next: boolean }> {
    const limit = 50;
    const skip = limit * (page || 0) - 50;

    const url = page
        ? `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${skip}`
        : `https://pokeapi.co/api/v2/pokemon?limit=1302`;

    const response = await fetch(url);
    const data = await response.json();
    const next = data.next !== null;
    return { results: data.results as PokemonData[], next };
}

export async function getAllPokemon(
    page?: number
): Promise<{ results: Pokemon[]; next: boolean }> {
    const { results: raw, next } = await getPokemonDataRaw(page);
    const all = await Promise.all(
        raw.map(async (p) => {
            const pokemon = await getPokemon(p.name);
            return pokemon;
        })
    );

    return { results: all as Pokemon[], next };
}

export async function getPokemon(
    name: string,
    cachedUser?: User
): Promise<Pokemon | null> {
    if (cachedUser) {
        const customPokemon = cachedUser.customPokemon;
        const pokemon = customPokemon?.find((p) => p.name === name);
        if (!pokemon) return null;
        pokemon.isCustomPokemon = true;
        pokemon.isPartial = false;
        return pokemon as Pokemon;
    }

    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    const response = await fetch(url);
    const data: Pokemon = (await response.json()) as Pokemon;
    data.isCustomPokemon = false;
    data.isPartial = false;

    return data;
}

export function getPokemonType(type: string) {
    return types.find((t) => t.name === type);
}

export async function markAsFavorite(
    accessToken: string,
    pokemon: string
): Promise<User | null> {
    const url = `${import.meta.env.VITE_API_URL}/users/@me/favorite/${pokemon}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (response.ok) {
        const data = await response.json();
        return data as User;
    }

    return null;
}

export async function runSearch(
    query?: string,
    filter?: string,
    accessToken?: string
): Promise<Pokemon[]> {
    const baseUrl = `${
        import.meta.env.VITE_API_URL
    }/search?q=${query}&filter=${filter}`;
    const url = accessToken ? `${baseUrl}&accessToken=${accessToken}` : baseUrl;
    const response = await fetch(url);

    if (response.ok) {
        const data = await response.json();
        return data.results as Pokemon[];
    }
    return [] as Pokemon[];
}

export function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getAllTypes() {
    return types;
}

const types = [
    {
        name: "normal",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-v/black-white/1.png",
    },
    {
        name: "fighting",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-v/black-white/2.png",
    },
    {
        name: "flying",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-v/black-white/3.png",
    },
    {
        name: "poison",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-v/black-white/4.png",
    },
    {
        name: "ground",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-v/black-white/5.png",
    },
    {
        name: "rock",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-v/black-white/6.png",
    },
    {
        name: "bug",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-v/black-white/7.png",
    },
    {
        name: "ghost",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-v/black-white/8.png",
    },
    {
        name: "steel",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-v/black-white/9.png",
    },
    {
        name: "fire",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-v/black-white/10.png",
    },
    {
        name: "water",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-v/black-white/11.png",
    },
    {
        name: "grass",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-v/black-white/12.png",
    },
    {
        name: "electric",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-v/black-white/13.png",
    },
    {
        name: "psychic",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-v/black-white/14.png",
    },
    {
        name: "ice",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-v/black-white/15.png",
    },
    {
        name: "dragon",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-v/black-white/16.png",
    },
    {
        name: "dark",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-v/black-white/17.png",
    },
    {
        name: "fairy",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/18.png",
    },
    {
        name: "stellar",
        url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/19.png",
    },
];
