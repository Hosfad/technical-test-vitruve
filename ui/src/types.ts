export type Pokemon = {
    id: number;
    isCustomPokemon: boolean;

    name: string;

    height: number;
    weight: number;
    sprites: {
        front_default: string;
    };

    forms?: PokemonData[];
    stats?: PokemonStats[];
    types?: {
        type: PokemonData;
    }[];
};
export type PokemonData = {
    name: string;
    url: string;
};

export type PokemonStats = {
    base_stat: number;
    effort: number;
    stat: PokemonData;
};

export type User = {
    username: string;
    email: string;
    password: string;
    favorites: {
        name: string;
        sprites: {
            front_default: string;
        };
    }[];
    accessToken?: string;
    customPokemon?: Pokemon[];
};
