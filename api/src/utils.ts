import axios from "axios";
import { Response } from "express";
import { existsSync, mkdir } from "fs";
import { readdir, readFile, writeFile } from "fs/promises";
import { Pokemon, PokemonData, User } from "./types";

const usersDir = "./data/users";
if (!existsSync(usersDir)) {
    mkdir(usersDir, { recursive: true }, (err) => {
        if (err) throw err;
    });
}

export async function getPokemonDataRaw(
    page?: number
): Promise<{ results: PokemonData[]; next: boolean } | null> {
    const limit = 50;
    const skip = limit * (page || 0) - 50;

    const url = page
        ? `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${skip}`
        : `https://pokeapi.co/api/v2/pokemon?limit=1302`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        const next = data.next !== null;
        return { results: data.results as PokemonData[], next };
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getAllPokemon(
    page?: number
): Promise<{ results: Pokemon[]; next: boolean }> {
    const res = await getPokemonDataRaw(page);
    if (!res) {
        return { results: [], next: false };
    }
    const { results: raw, next } = res;
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

    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
        const response = await axios.get(url);
        const data: Pokemon = (await response.data) as Pokemon;
        data.isCustomPokemon = false;
        data.isPartial = false;
        return data;
    } catch (error) {
        return null;
    }
}

export async function getUserInfo(email: string): Promise<User | null> {
    try {
        const data = await readFile(`${usersDir}/${email}.json`, "utf-8");

        if (!data) return null;

        return JSON.parse(data);
    } catch (error) {
        console.error(error);
        return null;
    }
}
export async function getAllUsers(): Promise<User[]> {
    const all: User[] = [];
    const files = await readdir(usersDir);
    for (const file of files) {
        const data = await readFile(`${usersDir}/${file}`, "utf-8");
        if (!data) continue;
        all.push(JSON.parse(data));
    }
    return all;
}
export async function getUserThroughToken(token: string): Promise<User | null> {
    const all = await getAllUsers();

    const user = all.find((u) => u.accessToken === token);
    return user || null;
}

export async function saveUser(user: User) {
    await writeFile(
        `${usersDir}/${user.email}.json`,
        JSON.stringify(user, null, 2)
    );

    return user;
}

export const getError = (res: Response, status: number) => (error: string) =>
    res.status(status).json({ error });
