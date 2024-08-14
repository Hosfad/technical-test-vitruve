
export type Pokemon = {
    name: string;

    height: number;
    weight: number;

    forms : PokemonData[];
    sprites : {
        front_default: string;
    };

    stats : PokemonStats[];
    types : string[]
    evolutions : PokemonData[]

};

export type PokemonData = {
    name: string;
    url: string;
};

export type PokemonStats = {
    base_stat: number;
    effort: number;
    stat: PokemonData;

}


export type User = {
    name: string;
    email: string;
    password: string;
    favorites: string[]
    accessToken?: string
}

