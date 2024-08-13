export type Pokemon = {
    name: string;

    height: number;
    weight: number;

    forms : PokemonData[];
    sprites : {
        back_default: string;
    };

    stats : PokemonStats[];
    types : string[]

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
