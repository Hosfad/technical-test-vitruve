import { Request, Response } from "express";
import { readFile } from "fs/promises";
import { AuthenticatedRequest, Pokemon, PokemonData } from "../types";
import { getError, parseUserForResponse } from "../utils";

async function makeFavorite(req: Request, res: Response) {
    const authenticatedReq = req as AuthenticatedRequest;
    const { pokemon } = req.params;
    const user = authenticatedReq.user;

    const includes = user.favorites.find((p) => p.name === pokemon);

    const searchIndex = await readFile("./data/search-index.json");

    const index = JSON.parse(searchIndex.toString());
    const desiredPokemon = index.find((p: PokemonData) => p.name === pokemon);
    const notFound = getError(res, 404);

    if (!desiredPokemon) {
        return notFound("Pokemon not found");
    }

    if (!includes) {
        user.favorites.push(desiredPokemon);
    } else {
        user.favorites = user.favorites.filter((p) => p.name !== pokemon);
    }
    res.json(await parseUserForResponse(user));
}

async function createNewPokemon(req: Request, res: Response) {
    const authenticatedReq = req as AuthenticatedRequest;

    const { height, weight, name, types, image } = req.body;

    if (!height || !weight || !name || !types || !image) {
        return getError(res, 400)("Missing required fields");
    }

    const user = authenticatedReq.user;

    const pokemon: Pokemon = {
        id: Date.now(),
        isCustomPokemon: true,
        height,
        weight,
        name,
        sprites: {
            front_default: image,
        },
        types: [
            {
                type: {
                    name: types,
                    url: "",
                },
            },
        ],
    };

    user.customPokemon.push(pokemon);
    res.json({ user: await parseUserForResponse(user), pokemon: pokemon });
}

async function editPokemon(req: Request, res: Response) {
    const authenticatedReq = req as AuthenticatedRequest;
    const { id } = req.params;

    const user = authenticatedReq.user;
    const pokemon = user.customPokemon.find((p) => p.id === parseInt(id));
    if (!pokemon) {
        return getError(res, 404)("Pokemon not found");
    }

    const { height, weight, name, types, image } = req.body;

    pokemon.height = height ?? pokemon.height;
    pokemon.weight = weight ?? pokemon.weight;
    pokemon.name = name ?? pokemon.name;
    if (types) {
        pokemon.types = [
            {
                type: {
                    name: types,
                    url: "",
                },
            },
        ];
    }
    pokemon.sprites.front_default = image ?? pokemon.sprites.front_default;

    res.json({ user: await parseUserForResponse(user), pokemon: pokemon });
}

async function deletePokemon(req: Request, res: Response) {
    const authenticatedReq = req as AuthenticatedRequest;
    const { id } = req.params;
    const user = authenticatedReq.user;
    if (!user.customPokemon) user.customPokemon = [];
    user.customPokemon = user.customPokemon.filter(
        (p) => p.id !== parseInt(id)
    );

    res.json(await parseUserForResponse(user));
}

export default {
    makeFavorite,
    createNewPokemon,
    editPokemon,
    deletePokemon,
};
